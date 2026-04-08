import { useState, useEffect, useCallback, useRef } from 'react';

import type { Employee, PageInfo, ApiFilter } from '../types';
import { DEFAULT_USER_ID } from '../constants';
import { getApiBaseUrl } from '../config';
import { parseApiError } from './parseApiError.ts';
import { useTelemetry } from './useTelemetry';

const GQL_ENDPOINT = `${getApiBaseUrl()}/graphql`;

/** Variables passed to the `GetEmployees` GraphQL query. */
interface GqlVariables {
  /** Maximum number of records to return in a single page. */
  first: number;
  /** Relay cursor marking the exclusive start of the page, or `null` for the first page. */
  after: string | null;
  /** Free-text search string, or `null` for no search filter. */
  search: string | null;
  /** Structured filter payload, or `null` for no filters. */
  filter: ApiFilter;
}

/** Shape of the `employees` connection in the GraphQL response. */
interface EmployeesConnection {
  /** Total number of employees matching the query across all pages. */
  totalCount: number;
  /** Relay pagination metadata for the current page. */
  pageInfo: PageInfo;
  /** Ordered list of edges, each pairing a cursor with its employee node. */
  edges: { cursor: string; node: Employee }[];
}

/** Top-level data shape returned by the `GetEmployees` query. */
interface GqlData {
  /** Paginated employee connection containing edges, pageInfo, and totalCount. */
  employees: EmployeesConnection;
}

/**
 * Executes a GraphQL query against the employees endpoint.
 * Throws an `Error` for non-2xx HTTP responses or top-level GraphQL errors.
 *
 * @param query - GraphQL query string.
 * @param variables - Variables to include in the request body.
 * @returns Parsed `data` field from the GraphQL response.
 */
async function gqlFetch(query: string, variables: GqlVariables): Promise<GqlData> {
  const res = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
  const json: { errors?: { message: string }[]; data: GqlData } = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
}

/**
 * GraphQL query that fetches a paginated, searchable, filterable list of employees.
 * Returns core employee fields plus nested `teams` and `accounts` associations,
 * along with Relay-style `pageInfo` and `totalCount` for pagination.
 */
const EMPLOYEES_QUERY = `
  query GetEmployees($first: Int, $after: String, $search: String, $filter: EmployeeFilter) {
    employees(first: $first, after: $after, search: $search, filter: $filter) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          uid
          name
          email
          photoUrl
          inactive
          trackingStatus
          trackingCategory
          teams {
            id
            name
          }
          accounts {
            type
            source
            uid
          }
        }
      }
    }
  }
`;

/** Input parameters for `useEmployees`. */
interface UseEmployeesParams {
  /** Free-text search string; empty string fetches all. */
  search: string;
  /** Active filter payload, or `null` for no filters. */
  filter: ApiFilter;
  /** Number of records per page (defaults to 5). */
  pageSize?: number;
}

/** Internal state managed by `useEmployees`. */
interface EmployeesState {
  /** Employees on the current page. */
  employees: Employee[];
  /** Total number of employees matching the current search/filter across all pages. */
  totalCount: number;
  /** Relay pagination metadata for the current page, or null before the first fetch. */
  pageInfo: PageInfo | null;
  /** True while a fetch is in-flight. */
  loading: boolean;
  /** Human-readable error message from the last failed fetch, or null. */
  error: string | null;
  /** Zero-based current page index. */
  page: number;
}

/** Return value of `useEmployees`. */
interface UseEmployeesResult extends EmployeesState {
  /** Navigate to the next page. No-op if no next page. */
  goNext: () => void;
  /** Navigate to the previous page. No-op if on the first page. */
  goPrev: () => void;
  /** True when there is a previous page to navigate to. */
  hasPrev: boolean;
  /** True when there is a next page to navigate to. */
  hasNext: boolean;
  /** 1-based index of the first visible record (0 when empty). */
  startIndex: number;
  /** 1-based index of the last visible record (0 when empty). */
  endIndex: number;
}

/**
 * Fetches a paginated, filterable list of employees from the GraphQL API.
 * Resets to page 0 whenever `search`, `filter`, or `pageSize` changes.
 *
 * **Telemetry**
 * | Event | When | `details` |
 * |---|---|---|
 * | `api.employees.success` | Page fetched successfully | `{ page, pageSize, afterCursor, search, filter }` |
 * | `api.employees.error` | Fetch or GraphQL error | `{ page, pageSize, afterCursor, search, filter }` |
 */
export function useEmployees({ search, filter, pageSize = 5 }: UseEmployeesParams): UseEmployeesResult {
  const { track } = useTelemetry();
  const [state, setState] = useState<EmployeesState>({
    employees: [],
    totalCount: 0,
    pageInfo: null,
    loading: true,
    error: null,
    page: 0,
  });

  // cursorHistory[i] = the `after` cursor needed to load page i
  const cursorHistory = useRef<(string | null)[]>([null]);

  /**
   * Fetches a single page of employees using the given cursor and updates component state.
   * Tracks request timing and outcome via telemetry. Re-created whenever `search`,
   * `filter`, or `pageSize` changes.
   *
   * @param afterCursor - Relay cursor marking the start of the page, or `null` for page 0.
   * @param pageIndex - Zero-based index of the page being loaded.
   */
  const fetchPage = useCallback(async (afterCursor: string | null, pageIndex: number) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const requestStart = new Date().toISOString();
    const t0 = Date.now();
    try {
      const data = await gqlFetch(EMPLOYEES_QUERY, {
        first: pageSize,
        after: afterCursor,
        search: search || null,
        filter: filter ?? null,
      });
      track({
        userId: DEFAULT_USER_ID,
        event: 'api.employees.success',
        context: 'useEmployees',
        details: JSON.stringify({ page: pageIndex, pageSize, afterCursor, search: search || null, filter }),
        requestStart,
        requestDuration: Date.now() - t0,
        requestStatus: 200,
      });
      const { edges, totalCount, pageInfo } = data.employees;
      setState({
        employees: edges.map(e => e.node),
        totalCount,
        pageInfo,
        loading: false,
        error: null,
        page: pageIndex,
      });
    } catch (err) {
      const errorMessage = (err as Error).message;
      track({
        userId: DEFAULT_USER_ID,
        event: 'api.employees.error',
        context: 'useEmployees',
        details: JSON.stringify({ page: pageIndex, pageSize, afterCursor, search: search || null, filter }),
        requestStart,
        requestDuration: Date.now() - t0,
        requestError: errorMessage,
      });
      setState(s => ({ ...s, loading: false, error: errorMessage }));
    }
  }, [search, filter, pageSize, track]);

  // Reset to page 0 whenever search / filter / pageSize changes
  useEffect(() => {
    cursorHistory.current = [null];
    fetchPage(null, 0);
  }, [fetchPage]);

  /** Advances to the next page, caching the end cursor for forward navigation. No-op if no next page exists. */
  const goNext = useCallback(() => {
    if (!state.pageInfo?.hasNextPage) {
      return;
    }
    const nextPage = state.page + 1;
    const cursor = state.pageInfo.endCursor;
    if (cursorHistory.current.length <= nextPage) {
      cursorHistory.current.push(cursor);
    }
    fetchPage(cursor, nextPage);
  }, [state.pageInfo, state.page, fetchPage]);

  /** Returns to the previous page using the cached cursor history. No-op when on page 0. */
  const goPrev = useCallback(() => {
    if (state.page <= 0) {
      return;
    }
    const prevPage = state.page - 1;
    fetchPage(cursorHistory.current[prevPage], prevPage);
  }, [state.page, fetchPage]);

  const startIndex = state.page * pageSize + 1;
  const endIndex = Math.min((state.page + 1) * pageSize, state.totalCount);

  return {
    ...state,
    goNext,
    goPrev,
    hasPrev: state.page > 0,
    hasNext: !!state.pageInfo?.hasNextPage,
    startIndex: state.totalCount > 0 ? startIndex : 0,
    endIndex: state.totalCount > 0 ? endIndex : 0,
  };
}
