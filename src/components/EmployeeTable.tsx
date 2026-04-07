import type {ChangeEvent, MouseEvent} from 'react';
import {useCallback, useMemo, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import {useEmployees} from '../hooks/useEmployees';
import {useFilterOptions} from '../hooks/useFilterOptions';
import {SubFilterPopover} from './SubFilterPopover';
import {FilterChip} from './FilterChip';
import {CategoryPopover, FILTER_CATEGORIES} from './CategoryPopover';
import {TableData} from "./TableData.tsx";
import type {ApiFilter, Employee, FilterItem, FilterKey, FilterOptions, FilterValues} from '../types';
import {BLUE_600, GRAY_200, GRAY_300, GRAY_400, GRAY_500, GRAY_700, WHITE,} from '../constants';
import {Pagination} from "./Pagination.tsx";

// ── Helpers ────────────────────────────────────────────────────────────────

function buildItems(categoryKey: FilterKey, options: FilterOptions | null): FilterItem[] {
  if (!options) return [];
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

function chipValueLabel(selectedValues: string[], allItems: FilterItem[]): string {
  if (!allItems.length || selectedValues.length === allItems.length) return 'All';
  if (selectedValues.length === 0) return 'None';
  if (selectedValues.length === 1) {
    return allItems.find(i => i.value === selectedValues[0])?.label ?? selectedValues[0];
  }
  return `${selectedValues.length} selected`;
}

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

// ── Main table ─────────────────────────────────────────────────────────────

interface EmployeeTableProps {
  onView: (emp: Employee) => void;
  viewedEmployeeId?: string;
}

export function EmployeeTable({ onView, viewedEmployeeId }: EmployeeTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [categoryAnchor, setCategoryAnchor] = useState<HTMLElement | null>(null);
  const [pendingTypes, setPendingTypes] = useState<FilterKey[]>([]);
  const [activeFilterTypes, setActiveFilterTypes] = useState<FilterKey[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({ teams: [], trackingStatuses: [], accountTypes: [] });

  const [subFilterAnchor, setSubFilterAnchor] = useState<HTMLElement | null>(null);
  const [openSubFilterKey, setOpenSubFilterKey] = useState<FilterKey | null>(null);

  const { options: filterOptions } = useFilterOptions();
  const isViewingEmployee = viewedEmployeeId !== undefined;

  const apiFilter = useMemo(
    () => buildApiFilter(activeFilterTypes, filterValues, filterOptions),
    [activeFilterTypes, filterValues, filterOptions],
  );

  const {
    employees, totalCount, loading, error,
    goNext, goPrev, hasNext, hasPrev, startIndex, endIndex,
  } = useEmployees({ search, filter: apiFilter, pageSize });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(val), 300);
  }, []);

  const handleSelectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? new Set(employees.map(emp => emp.id)) : new Set());
  }, [employees]);

  const handleSelectOne = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const categoryOpen = Boolean(categoryAnchor);

  function openCategoryPanel(e: MouseEvent<HTMLButtonElement>) {
    setPendingTypes([...activeFilterTypes]);
    setCategoryAnchor(e.currentTarget);
  }

  function handleCategoryApply() {
    const newValues = { ...filterValues };
    FILTER_CATEGORIES.forEach(cat => {
      if (pendingTypes.includes(cat.key) && !activeFilterTypes.includes(cat.key)) {
        newValues[cat.key] = buildItems(cat.key, filterOptions).map(i => i.value);
      }
      if (!pendingTypes.includes(cat.key)) {
        newValues[cat.key] = [];
      }
    });
    setFilterValues(newValues);
    setActiveFilterTypes(pendingTypes);
    setCategoryAnchor(null);
  }

  function handleCategoryCancel() {
    setPendingTypes([...activeFilterTypes]);
    setCategoryAnchor(null);
  }

  function openSubFilter(e: MouseEvent<HTMLElement>, key: FilterKey) {
    e.stopPropagation();
    setOpenSubFilterKey(key);
    setSubFilterAnchor(e.currentTarget);
  }

  function handleSubFilterApply(key: FilterKey, newValues: string[]) {
    setFilterValues(prev => ({ ...prev, [key]: newValues }));
    setSubFilterAnchor(null);
    setOpenSubFilterKey(null);
  }

  function handleSubFilterCancel() {
    setSubFilterAnchor(null);
    setOpenSubFilterKey(null);
  }

  function removeFilter(key: FilterKey) {
    setActiveFilterTypes(prev => prev.filter(k => k !== key));
    setFilterValues(prev => ({ ...prev, [key]: [] }));
  }

  const allSelected = employees.length > 0 && employees.every(e => selected.has(e.id));
  const someSelected = employees.some(e => selected.has(e.id)) && !allSelected;

  return (
    <Box>
      {/* Search */}
      <TextField
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search employees by name ..."
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{fontSize: 16, color: GRAY_400}}/>
                </InputAdornment>
            ),
            sx: {
              fontSize: '0.875rem',
              color: GRAY_700,
              backgroundColor: WHITE,
              '& fieldset': {borderColor: GRAY_200},
              '&:hover fieldset': {borderColor: GRAY_300},
              '&.Mui-focused fieldset': {borderColor: BLUE_600, borderWidth: '1px'},
            },
          }}
          sx={{mb: 1.5}}
      />

      {/* Filter row */}
      <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2.5}}>
        <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon sx={{fontSize: '13px !important'}}/>}
            onClick={openCategoryPanel}
            sx={{
              height: 34,
              color: categoryOpen || activeFilterTypes.length > 0 ? GRAY_700 : GRAY_500,
              fontSize: '0.8125rem',
              fontWeight: 500,
              textTransform: 'none',
              minWidth: 0,
              px: 1.25,
              border: `1px solid ${GRAY_300}`,
              borderRadius: '6px',
              backgroundColor: 'transparent',
              '&:hover': {backgroundColor: 'transparent', borderColor: GRAY_400, color: GRAY_700},
              '& .MuiButton-startIcon': {mr: 0.5},
            }}
        >
          Add Filter
        </Button>

        {activeFilterTypes.map(key => {
          const cat = FILTER_CATEGORIES.find(c => c.key === key);
          const items = buildItems(key, filterOptions);
          const valueLabel = chipValueLabel(filterValues[key] || [], items);
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
          anchorEl={categoryAnchor}
          pendingTypes={pendingTypes}
          setPendingTypes={setPendingTypes}
          onApply={handleCategoryApply}
          onCancel={handleCategoryCancel}
      />

      {openSubFilterKey && (
          <SubFilterPopover
              open={Boolean(subFilterAnchor)}
              anchorEl={subFilterAnchor}
              categoryKey={openSubFilterKey}
              items={buildItems(openSubFilterKey, filterOptions)}
              selectedValues={filterValues[openSubFilterKey] || []}
              onApply={(vals) => handleSubFilterApply(openSubFilterKey, vals)}
              onCancel={handleSubFilterCancel}
          />
      )}

      {error && (
          <Alert severity="error" sx={{mb: 2}}>
            Failed to load employees: {error}
          </Alert>
      )}

      <TableData
          employees={employees}
          loading={loading}
          pageSize={pageSize}
          selected={selected}
          allSelected={allSelected}
          someSelected={someSelected}
          isViewingEmployee={isViewingEmployee}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onView={onView}
      />

      <Pagination
          pageSize={pageSize}
          startIndex={startIndex}
          endIndex={endIndex}
          onChange={setPageSize}
          loading={loading}
          totalCount={totalCount}
          onPrev={goPrev}
          hasPrev={hasPrev}
          onNext={goNext}
          hasNext={hasNext}
      />
    </Box>
  );
}
