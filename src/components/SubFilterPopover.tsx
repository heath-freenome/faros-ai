import { useState, useMemo, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import SearchIcon from '@mui/icons-material/Search';

import type { FilterItem, FilterKey } from '../types';
import { GRAY_50, GRAY_400, GRAY_700 } from '../constants';
import { fieldInputSx } from '../styles/fieldInputSx';
import { DarkButton, GhostButton } from '../styles/components';

/** UI metadata for a single filter dimension in `SubFilterPopover`. */
interface CategoryMeta {
  /** Placeholder text for the popover's search input. */
  searchPlaceholder: string;
}

const CATEGORY_META: Partial<Record<FilterKey, CategoryMeta>> = {
  teams:            { searchPlaceholder: 'Search team name...' },
  trackingStatuses: { searchPlaceholder: 'Search status...' },
  accountTypes:     { searchPlaceholder: 'Search account...' },
};

/** Props for `SubFilterPopover`. */
interface SubFilterPopoverProps {
  /** Flag indicating whether the popover is open */
  open: boolean;
  /** The HTML element to which the popover is anchored */
  anchorEl: HTMLElement | null;
  /** The filter dimension being edited (drives the search placeholder). */
  categoryKey: FilterKey;
  /** All available items for this filter dimension. */
  items: FilterItem[];
  /** Values currently selected for this dimension. */
  selectedValues: string[];
  /** Called with the new selection when the user clicks Apply. */
  onApply: (newValues: string[]) => void;
  /** Called when the user clicks Cancel or dismisses the popover. */
  onCancel: () => void;
}

/**
 * Popover for selecting individual values within a single filter dimension.
 * Includes a search input, select/deselect-all toggle, and a scrollable
 * checkbox list. Edits are staged locally and committed on Apply.
 */
export function SubFilterPopover({
  open,
  anchorEl,
  categoryKey,
  items,
  selectedValues,
  onApply,
  onCancel,
}: SubFilterPopoverProps) {
  const [search, setSearch] = useState('');
  // Component is conditionally rendered so it always mounts fresh — no sync effect needed
  const [local, setLocal] = useState<string[]>(() => [...selectedValues]);

  const filtered = useMemo(
    () => items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );

  const allSelected = local.length === items.length;

  /** Adds or removes a single item value from the local selection. */
  function toggle(value: string) {
    setLocal(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
    );
  }

  /** Selects all items when none/some are selected, or clears all when all are selected. */
  function toggleAll() {
    setLocal(allSelected ? [] : items.map(i => i.value));
  }

  /** Updates the local search string as the user types. */
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  /** Commits the local selection by calling `onApply` with the current staged values. */
  const handleApply = useCallback(() => {
    onApply(local);
  }, [onApply, local]);

  const { searchPlaceholder } = CATEGORY_META[categoryKey] ?? { searchPlaceholder: 'Search...' };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onCancel}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { mt: 0.75, width: 230 } }}
    >
      {/* Search */}
      <Box sx={{ px: 1.5, pt: 1.25, pb: 0.75 }}>
        <TextField
          value={search}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          size="small"
          fullWidth
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 15, color: GRAY_400 }} />
              </InputAdornment>
            ),
          }}
          sx={fieldInputSx}
        />
      </Box>

      {/* Deselect all / Select all */}
      <Box sx={{ px: 1.5, pb: 0.5 }}>
        <GhostButton onClick={toggleAll} sx={{ fontSize: '0.75rem' }}>
          {allSelected ? 'Deselect all' : 'Select all'}
        </GhostButton>
      </Box>

      {/* Item list */}
      <Box sx={{ maxHeight: 220, overflowY: 'auto' }}>
        {filtered.map(item => {
          const checked = local.includes(item.value);
          return (
            <Box
              key={item.value}
              onClick={() => toggle(item.value)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.625,
                cursor: 'pointer',
                '&:hover': { backgroundColor: GRAY_50 },
              }}
            >
              <Checkbox
                size="small"
                checked={checked}
                disableRipple
                tabIndex={-1}
                sx={{ p: 0, flexShrink: 0 }}
              />
              <Typography sx={{ fontSize: '0.875rem', color: GRAY_700, lineHeight: 1.2 }}>
                {item.label}
              </Typography>
            </Box>
          );
        })}

        {filtered.length === 0 && (
          <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.8125rem', color: GRAY_400 }}>No results</Typography>
          </Box>
        )}
      </Box>

      {/* Apply / Cancel */}
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1.125 }}>
        <DarkButton onClick={handleApply}>Apply</DarkButton>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
      </Box>
    </Popover>
  );
}
