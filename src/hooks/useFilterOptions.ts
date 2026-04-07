import { useState, useEffect } from 'react';

import type { FilterOptions } from '../types';
import { parseApiError } from './apiError';

const GQL_ENDPOINT = 'http://localhost:4000/graphql';

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

interface UseFilterOptionsResult {
  options: FilterOptions | null;
  loading: boolean;
  error: string | null;
}

export function useFilterOptions(): UseFilterOptionsResult {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: FILTER_OPTIONS_QUERY }),
    })
      .then(async r => {
        if (!r.ok) throw new Error(await parseApiError(r));
        return r.json() as Promise<{ errors?: { message: string }[]; data: { filterOptions: FilterOptions } }>;
      })
      .then(json => {
        if (cancelled) return;
        if (json.errors?.length) throw new Error(json.errors[0].message);
        setOptions(json.data.filterOptions);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return { options, loading, error };
}
