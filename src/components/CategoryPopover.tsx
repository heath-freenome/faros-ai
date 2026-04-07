import type { Dispatch, SetStateAction } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

import type { FilterKey } from '../types';
import { GRAY_50, GRAY_700 } from '../constants';
import { DarkButton, GhostButton, PopoverSectionLabel } from '../styles/components';

/** A single filterable dimension displayed in `CategoryPopover`. */
interface FilterCategory {
  /** The filter key used in state and API payloads. */
  key: FilterKey;
  /** Human-readable label shown in the checkbox list. */
  label: string;
}

// Filter category definitions — order matches the Figma
export const FILTER_CATEGORIES: FilterCategory[] = [
  { key: 'accountTypes', label: 'Accounts Connected' },
  { key: 'teams', label: 'Team' },
  { key: 'trackingStatuses', label: 'Tracking Status' },
];

/** Props for `CategoryPopover`. */
interface CategoryPopoverProps {
  /** Whether the popover is currently visible. */
  open: boolean;
  /** DOM element the popover anchors to (the "Add Filter" button). */
  anchorEl: HTMLElement | null;
  /** Filter keys checked in the current (uncommitted) selection. */
  pendingTypes: FilterKey[];
  /** Called to set the pending types */
  setPendingTypes: Dispatch<SetStateAction<FilterKey[]>>;
  /** Called when the user clicks Apply. */
  onApply: () => void;
  /** Called when the user clicks Cancel or dismisses the popover. */
  onCancel: () => void;
}

/**
 * Popover that lets the user choose which filter dimensions (teams, tracking
 * status, accounts) to add to the filter bar. Changes are staged in
 * `pendingTypes` and only committed when "Apply" is clicked.
 */
export function CategoryPopover({ open, anchorEl, pendingTypes, setPendingTypes, onApply, onCancel }: CategoryPopoverProps) {
  function toggle(key: FilterKey) {
    setPendingTypes(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onCancel}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { mt: 0.75, width: 210 } }}
    >
      <Box sx={{ px: 2, pt: 1.75, pb: 1 }}>
        <PopoverSectionLabel>Filter by</PopoverSectionLabel>
      </Box>

      {FILTER_CATEGORIES.map(cat => {
        const checked = pendingTypes.includes(cat.key);
        return (
          <Box
            key={cat.key}
            onClick={() => toggle(cat.key)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.875,
              cursor: 'pointer',
              '&:hover': { backgroundColor: GRAY_50 },
            }}
          >
            <Checkbox
              size="small" checked={checked} disableRipple tabIndex={-1}
              sx={{ p: 0, mr: 1.25 }}
            />
            <Box sx={{ fontSize: '0.875rem', color: GRAY_700, lineHeight: 1 }}>
              {cat.label}
            </Box>
          </Box>
        );
      })}

      <Divider sx={{ mt: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1.25 }}>
        <DarkButton onClick={onApply}>Apply</DarkButton>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
      </Box>
    </Popover>
  );
}
