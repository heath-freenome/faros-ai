import { useState, useEffect, useCallback, useRef } from 'react';

import type { Employee, PageInfo, ApiFilter } from '../types';
import { parseApiError } from './apiError';

const GQL_ENDPOINT = 'http://localhost:4000/graphql';

interface GqlVariables {
  first: number;
  after: string | null;
  search: string | null;
  filter: ApiFilter;
}

interface EmployeesConnection {
  totalCount: number;
  pageInfo: PageInfo;
  edges: { cursor: string; node: Employee }[];
}

interface GqlData {
  employees: EmployeesConnection;
}

async function gqlFetch(query: string, variables: GqlVariables): Promise<GqlData> {
  const res = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  const json: { errors?: { message: string }[]; data: GqlData } = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

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

interface UseEmployeesParams {
  search: string;
  filter: ApiFilter;
  pageSize?: number;
}

interface EmployeesState {
  employees: Employee[];
  totalCount: number;
  pageInfo: PageInfo | null;
  loading: boolean;
  error: string | null;
  page: number;
}

interface UseEmployeesResult extends EmployeesState {
  goNext: () => void;
  goPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  startIndex: number;
  endIndex: number;
}

export function useEmployees({ search, filter, pageSize = 5 }: UseEmployeesParams): UseEmployeesResult {
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

  const fetchPage = useCallback(async (afterCursor: string | null, pageIndex: number) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await gqlFetch(EMPLOYEES_QUERY, {
        first: pageSize,
        after: afterCursor,
        search: search || null,
        filter: filter ?? null,
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
      setState(s => ({ ...s, loading: false, error: (err as Error).message }));
    }
  }, [search, filter, pageSize]);

  // Reset to page 0 whenever search / filter / pageSize changes
  useEffect(() => {
    cursorHistory.current = [null];
    fetchPage(null, 0);
  }, [fetchPage]);

  const goNext = useCallback(() => {
    if (!state.pageInfo?.hasNextPage) return;
    const nextPage = state.page + 1;
    const cursor = state.pageInfo.endCursor;
    if (cursorHistory.current.length <= nextPage) {
      cursorHistory.current.push(cursor);
    }
    fetchPage(cursor, nextPage);
  }, [state.pageInfo, state.page, fetchPage]);

  const goPrev = useCallback(() => {
    if (state.page <= 0) return;
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
