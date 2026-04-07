import { useState, useEffect } from 'react';

import type { FilterOptions } from '../types';
import { DEFAULT_USER_ID } from '../constants';
import { parseApiError } from './parseApiError.ts';
import { useTelemetry } from './useTelemetry';

const GQL_ENDPOINT = 'http://localhost:4000/graphql';

/**
 * GraphQL query that fetches all available filter dimension values in a single request.
 * Returns teams (uid + name), tracking statuses, tracking categories, and account types
 * (type + source) used to populate filter popovers.
 */
const FILTER_OPTIONS_QUERY = `
  query {
    filterOptions {
      teams { uid name }
      trackingStatuses
      trackingCategories
      accountTypes { type source }
    }
  }
`;

/** Return value of `useFilterOptions`. */
interface UseFilterOptionsResult {
  /** The fetched filter dimension values, or `null` while loading or on error. */
  options: FilterOptions | null;
  /** True while the initial fetch is in-flight. */
  loading: boolean;
  /** Human-readable error message if the fetch failed, or `null`. */
  error: string | null;
}

/**
 * Fetches available filter dimensions (teams, tracking statuses, account types)
 * from the GraphQL API. Runs once on mount.
 *
 * **Telemetry**
 * | Event | When | `details` |
 * |---|---|---|
 * | `api.filterOptions.success` | Fetch succeeded | `{ teams, trackingStatuses, accountTypes }` counts |
 * | `api.filterOptions.error` | Fetch failed | `{ query: 'FILTER_OPTIONS_QUERY' }` |
 */
export function useFilterOptions(): UseFilterOptionsResult {
  const { track } = useTelemetry();
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const requestStart = new Date().toISOString();
    const t0 = Date.now();
    let responseStatus: number | undefined;

    fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: FILTER_OPTIONS_QUERY }),
    })
      .then(async r => {
        responseStatus = r.status;
        if (!r.ok) {
          throw new Error(await parseApiError(r));
        }
        return r.json() as Promise<{ errors?: { message: string }[]; data: { filterOptions: FilterOptions } }>;
      })
      .then(json => {
        if (cancelled) {
          return;
        }
        if (json.errors?.length) {
          throw new Error(json.errors[0].message);
        }
        track({
          userId: DEFAULT_USER_ID,
          event: 'api.filterOptions.success',
          context: 'useFilterOptions',
          details: JSON.stringify({ teams: json.data.filterOptions.teams?.length, trackingStatuses: json.data.filterOptions.trackingStatuses?.length, accountTypes: json.data.filterOptions.accountTypes?.length }),
          requestStart,
          requestDuration: Date.now() - t0,
          requestStatus: responseStatus,
        });
        setOptions(json.data.filterOptions);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          track({
            userId: DEFAULT_USER_ID,
            event: 'api.filterOptions.error',
            context: 'useFilterOptions',
            details: JSON.stringify({ query: 'FILTER_OPTIONS_QUERY' }),
            requestStart,
            requestDuration: Date.now() - t0,
            requestStatus: responseStatus,
            requestError: err.message,
          });
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [track]);

  return { options, loading, error };
}
