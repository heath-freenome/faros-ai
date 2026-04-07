import type { ChangeEvent, MouseEvent } from 'react';
import { useCallback, useMemo, useReducer, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import { useEmployees } from '../hooks/useEmployees';
import { useFilterOptions } from '../hooks/useFilterOptions';
import { SubFilterPopover } from './SubFilterPopover';
import { FilterChip } from './FilterChip';
import { CategoryPopover, FILTER_CATEGORIES } from './CategoryPopover';
import { TableData } from './TableData.tsx';
import type { ApiFilter, Employee, FilterItem, FilterKey, FilterOptions, FilterValues } from '../types';
import { BLUE_600, GRAY_200, GRAY_300, GRAY_400, GRAY_500, GRAY_700, WHITE } from '../constants';
import { Pagination } from './Pagination.tsx';

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Converts raw `FilterOptions` data into a flat list of `FilterItem` objects
 * for the given filter dimension key.
 *
 * @param categoryKey - The dimension to build items for.
 * @param options - The filter options returned by the API, or null if not yet loaded.
 * @returns Array of `{ value, label }` pairs ready for checkbox rendering.
 */
function buildItems(categoryKey: FilterKey, options: FilterOptions | null): FilterItem[] {
  if (!options) {
    return [];
  }
  if (categoryKey === 'teams') {
    return (options.teams || []).map(t => ({ value: t.uid, label: t.name }));
  }
  if (categoryKey === 'trackingStatuses') {
    return (options.trackingStatuses || []).map(s => ({ value: s, label: s }));
  }
  if (categoryKey === 'accountTypes') {
    return (options.accountTypes || []).map(a => ({ value: a.type, label: a.source }));
  }
  return [];
}

/**
 * Returns a concise human-readable summary of the current filter selection
 * for display inside a `FilterChip`.
 * Returns `"All"` when everything is selected, `"None"` when nothing is,
 * the single item's label when exactly one is selected, or `"N selected"`.
 *
 * @param selectedValues - Values currently checked for this dimension.
 * @param allItems - All available items for this dimension.
 */
function chipValueLabel(selectedValues: string[], allItems: FilterItem[]): string {
  if (!allItems.length || selectedValues.length === allItems.length) {
    return 'All';
  }
  if (selectedValues.length === 0) {
    return 'None';
  }
  if (selectedValues.length === 1) {
    return allItems.find(i => i.value === selectedValues[0])?.label ?? selectedValues[0];
  }
  return `${selectedValues.length} selected`;
}

/**
 * Builds the `ApiFilter` payload to send to the GraphQL query.
 * Omits dimensions where nothing is filtered (all selected or none selected)
 * and returns `null` when no active constraints remain.
 *
 * @param activeTypes - Filter dimensions the user has toggled on.
 * @param filterValues - Currently selected values per dimension.
 * @param options - Available options used to detect "all selected" state.
 */
function buildApiFilter(activeTypes: FilterKey[], filterValues: FilterValues, options: FilterOptions | null): ApiFilter {
  const result: Record<string, string[]> = {};
  activeTypes.forEach(key => {
    const items = buildItems(key, options);
    const vals = filterValues[key] || [];
    if (items.length > 0 && vals.length > 0 && vals.length < items.length) {
      result[key] = vals;
    }
  });
  return Object.keys(result).length ? result : null;
}

// ── Reducer ────────────────────────────────────────────────────────────────

/** All UI state managed by the `EmployeeTable` reducer. */
interface TableState {
  /** Current value shown in the search input (updated on every keystroke). */
  searchInput: string;
  /** Debounced search string sent to the API (updated 300 ms after typing stops). */
  search: string;
  /** Number of rows per page. */
  pageSize: number;
  /** Set of selected employee IDs on the current page. */
  selected: Set<string>;
  /** Anchor element for the category-selection popover, or `null` when closed. */
  categoryAnchor: HTMLElement | null;
  /** Staged filter dimension selection before the user clicks Apply. */
  pendingTypes: FilterKey[];
  /** Committed active filter dimension keys driving the current query. */
  activeFilterTypes: FilterKey[];
  /** Selected values per filter dimension. */
  filterValues: FilterValues;
  /** Anchor element for the sub-filter value popover, or `null` when closed. */
  subFilterAnchor: HTMLElement | null;
  /** The dimension whose value popover is currently open, or `null`. */
  openSubFilterKey: FilterKey | null;
}

/** Discriminated union of all actions that can modify `TableState`. */
type TableAction =
  /** Updates the search input text immediately. */
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  /** Commits the debounced search string to trigger an API call. */
  | { type: 'COMMIT_SEARCH'; payload: string }
  /** Changes the number of rows per page. */
  | { type: 'SET_PAGE_SIZE'; payload: number }
  /** Selects all supplied employee IDs. */
  | { type: 'SELECT_ALL'; payload: string[] }
  /** Clears the entire selection. */
  | { type: 'DESELECT_ALL' }
  /** Toggles the selection state of a single employee. */
  | { type: 'TOGGLE_SELECT'; payload: string }
  /** Opens the category popover and seeds the pending selection. */
  | { type: 'OPEN_CATEGORY_PANEL'; payload: { anchor: HTMLElement; pendingTypes: FilterKey[] } }
  /** Updates the staged dimension selection while the category popover is open. */
  | { type: 'SET_PENDING_TYPES'; payload: FilterKey[] }
  /** Commits the chosen filter dimensions and their initial values, and closes the popover. */
  | { type: 'APPLY_CATEGORY'; payload: { types: FilterKey[]; values: FilterValues } }
  /** Discards pending changes and closes the category popover. */
  | { type: 'CANCEL_CATEGORY' }
  /** Opens the sub-filter value popover for a given dimension. */
  | { type: 'OPEN_SUB_FILTER'; payload: { anchor: HTMLElement; key: FilterKey } }
  /** Commits new values for a dimension and closes the sub-filter popover. */
  | { type: 'APPLY_SUB_FILTER'; payload: { key: FilterKey; values: string[] } }
  /** Closes the sub-filter popover without applying changes. */
  | { type: 'CANCEL_SUB_FILTER' }
  /** Removes a filter dimension and clears its selected values. */
  | { type: 'REMOVE_FILTER'; payload: FilterKey };

const INITIAL_FILTER_VALUES: FilterValues = { teams: [], trackingStatuses: [], accountTypes: [] };

/** Initial state for the `EmployeeTable` reducer. */
const INITIAL_STATE: TableState = {
  searchInput: '',
  search: '',
  pageSize: 5,
  selected: new Set(),
  categoryAnchor: null,
  pendingTypes: [],
  activeFilterTypes: [],
  filterValues: INITIAL_FILTER_VALUES,
  subFilterAnchor: null,
  openSubFilterKey: null,
};

/**
 * Pure reducer for all `EmployeeTable` UI state transitions.
 * Each action maps to exactly one state shape; no side-effects occur here.
 */
function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'SET_SEARCH_INPUT':
      return { ...state, searchInput: action.payload };
    case 'COMMIT_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload };
    case 'SELECT_ALL':
      return { ...state, selected: new Set(action.payload) };
    case 'DESELECT_ALL':
      return { ...state, selected: new Set() };
    case 'TOGGLE_SELECT': {
      const next = new Set(state.selected);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, selected: next };
    }
    case 'OPEN_CATEGORY_PANEL':
      return { ...state, categoryAnchor: action.payload.anchor, pendingTypes: action.payload.pendingTypes };
    case 'SET_PENDING_TYPES':
      return { ...state, pendingTypes: action.payload };
    case 'APPLY_CATEGORY':
      return { ...state, activeFilterTypes: action.payload.types, filterValues: action.payload.values, categoryAnchor: null };
    case 'CANCEL_CATEGORY':
      return { ...state, pendingTypes: [...state.activeFilterTypes], categoryAnchor: null };
    case 'OPEN_SUB_FILTER':
      return { ...state, subFilterAnchor: action.payload.anchor, openSubFilterKey: action.payload.key };
    case 'APPLY_SUB_FILTER':
      return { ...state, filterValues: { ...state.filterValues, [action.payload.key]: action.payload.values }, subFilterAnchor: null, openSubFilterKey: null };
    case 'CANCEL_SUB_FILTER':
      return { ...state, subFilterAnchor: null, openSubFilterKey: null };
    case 'REMOVE_FILTER':
      return { ...state, activeFilterTypes: state.activeFilterTypes.filter(k => k !== action.payload), filterValues: { ...state.filterValues, [action.payload]: [] } };
    default:
      return state;
  }
}

// ── Main table ─────────────────────────────────────────────────────────────

/** Props for `EmployeeTable`. */
interface EmployeeTableProps {
  /** Called when the user clicks "View" on a row, passing the selected employee. */
  onView: (emp: Employee) => void;
  /** ID of the currently viewed employee; used to highlight its row. */
  viewedEmployeeId?: string;
}

/**
 * Full-featured employee table with search, filter chips, paginated data, and row selection.
 * Manages all filter and pagination state internally via a single `useReducer`;
 * communicates selection to the parent via `onView`.
 */
export function EmployeeTable({ onView, viewedEmployeeId }: EmployeeTableProps) {
  const [state, dispatch] = useReducer(tableReducer, INITIAL_STATE);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { options: filterOptions } = useFilterOptions();

  const apiFilter = useMemo(
    () => buildApiFilter(state.activeFilterTypes, state.filterValues, filterOptions),
    [state.activeFilterTypes, state.filterValues, filterOptions],
  );

  const {
    employees, totalCount, loading, error,
    goNext, goPrev, hasNext, hasPrev, startIndex, endIndex,
  } = useEmployees({ search: state.search, filter: apiFilter, pageSize: state.pageSize });

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Updates the search input immediately and debounces the committed search string by 300 ms. */
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    dispatch({ type: 'SET_SEARCH_INPUT', payload: val });
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => dispatch({ type: 'COMMIT_SEARCH', payload: val }), 300);
  }, []);

  /** Selects all employees on the current page when checked, or clears the selection when unchecked. */
  const handleSelectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch({ type: 'SELECT_ALL', payload: employees.map(emp => emp.id) });
    } else {
      dispatch({ type: 'DESELECT_ALL' });
    }
  }, [employees]);

  /** Toggles the selection state of a single employee row by its ID. */
  const handleSelectOne = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SELECT', payload: id });
  }, []);

  /** Opens the category (filter dimension) selection popover, seeding pending state from the active types. */
  function openCategoryPanel(e: MouseEvent<HTMLButtonElement>) {
    dispatch({ type: 'OPEN_CATEGORY_PANEL', payload: { anchor: e.currentTarget, pendingTypes: [...state.activeFilterTypes] } });
  }

  /**
   * Commits the pending filter type selection.
   * Newly added dimensions are pre-populated with all values selected;
   * removed dimensions have their values cleared.
   */
  function handleCategoryApply() {
    const newValues = { ...state.filterValues };
    FILTER_CATEGORIES.forEach(cat => {
      if (state.pendingTypes.includes(cat.key) && !state.activeFilterTypes.includes(cat.key)) {
        newValues[cat.key] = buildItems(cat.key, filterOptions).map(i => i.value);
      }
      if (!state.pendingTypes.includes(cat.key)) {
        newValues[cat.key] = [];
      }
    });
    dispatch({ type: 'APPLY_CATEGORY', payload: { types: state.pendingTypes, values: newValues } });
  }

  /** Discards pending changes and closes the category popover. */
  function handleCategoryCancel() {
    dispatch({ type: 'CANCEL_CATEGORY' });
  }

  /** Opens the per-dimension value selection popover for the given filter key. */
  function openSubFilter(e: MouseEvent<HTMLElement>, key: FilterKey) {
    e.stopPropagation();
    dispatch({ type: 'OPEN_SUB_FILTER', payload: { anchor: e.currentTarget, key } });
  }

  /** Commits the new value selection for the given dimension and closes the sub-filter popover. */
  function handleSubFilterApply(key: FilterKey, newValues: string[]) {
    dispatch({ type: 'APPLY_SUB_FILTER', payload: { key, values: newValues } });
  }

  /** Closes the sub-filter popover without applying any changes. */
  function handleSubFilterCancel() {
    dispatch({ type: 'CANCEL_SUB_FILTER' });
  }

  /** Removes a filter dimension entirely, clearing its selected values. */
  function removeFilter(key: FilterKey) {
    dispatch({ type: 'REMOVE_FILTER', payload: key });
  }

  const categoryOpen = Boolean(state.categoryAnchor);
  const allSelected = employees.length > 0 && employees.every(e => state.selected.has(e.id));
  const someSelected = employees.some(e => state.selected.has(e.id)) && !allSelected;

  return (
    <Box>
      {/* Search */}
      <TextField
        value={state.searchInput}
        onChange={handleSearchChange}
        placeholder="Search employees by name ..."
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: GRAY_400 }} />
            </InputAdornment>
          ),
          sx: {
            fontSize: '0.875rem',
            color: GRAY_700,
            backgroundColor: WHITE,
            '& fieldset': { borderColor: GRAY_200 },
            '&:hover fieldset': { borderColor: GRAY_300 },
            '&.Mui-focused fieldset': { borderColor: BLUE_600, borderWidth: '1px' },
          },
        }}
        sx={{ mb: 1.5 }}
      />

      {/* Filter row */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon sx={{ fontSize: '13px !important' }} />}
          onClick={openCategoryPanel}
          sx={{
            height: 34,
            color: categoryOpen || state.activeFilterTypes.length > 0 ? GRAY_700 : GRAY_500,
            fontSize: '0.8125rem',
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 0,
            px: 1.25,
            border: `1px solid ${GRAY_300}`,
            borderRadius: '6px',
            backgroundColor: WHITE,
            '&:hover': { backgroundColor: WHITE, borderColor: GRAY_400, color: GRAY_700 },
            '& .MuiButton-startIcon': { mr: 0.5 },
          }}
        >
          Add Filter
        </Button>

        {state.activeFilterTypes.map(key => {
          const cat = FILTER_CATEGORIES.find(c => c.key === key);
          const items = buildItems(key, filterOptions);
          const valueLabel = chipValueLabel(state.filterValues[key] || [], items);
          return (
            <FilterChip
              key={key}
              label={cat?.label ?? key}
              valueLabel={valueLabel}
              onClick={e => openSubFilter(e, key)}
              onRemove={() => removeFilter(key)}
            />
          );
        })}
      </Box>

      <CategoryPopover
        open={categoryOpen}
        anchorEl={state.categoryAnchor}
        pendingTypes={state.pendingTypes}
        setPendingTypes={types => dispatch({ type: 'SET_PENDING_TYPES', payload: types })}
        onApply={handleCategoryApply}
        onCancel={handleCategoryCancel}
      />

      {state.openSubFilterKey && (
        <SubFilterPopover
          open={Boolean(state.subFilterAnchor)}
          anchorEl={state.subFilterAnchor}
          categoryKey={state.openSubFilterKey}
          items={buildItems(state.openSubFilterKey, filterOptions)}
          selectedValues={state.filterValues[state.openSubFilterKey] || []}
          onApply={(vals) => handleSubFilterApply(state.openSubFilterKey!, vals)}
          onCancel={handleSubFilterCancel}
        />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load employees: {error}
        </Alert>
      )}

      <TableData
        employees={employees}
        loading={loading}
        pageSize={state.pageSize}
        selected={state.selected}
        allSelected={allSelected}
        someSelected={someSelected}
        viewedEmployeeId={viewedEmployeeId}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onView={onView}
      />

      <Pagination
        pageSize={state.pageSize}
        startIndex={startIndex}
        endIndex={endIndex}
        loading={loading}
        totalCount={totalCount}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onChange={pageSize => dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize })}
        onPrev={goPrev}
        onNext={goNext}
      />
    </Box>
  );
}
