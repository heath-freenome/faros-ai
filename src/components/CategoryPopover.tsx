import type { Dispatch, SetStateAction } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import type { FilterKey } from '../types';
import { WHITE, GRAY_50, GRAY_200, GRAY_300, GRAY_400, GRAY_500, GRAY_700, GRAY_800, GRAY_900, BLUE_600 } from '../constants';

interface FilterCategory {
  key: FilterKey;
  label: string;
}

// Filter category definitions — order matches the Figma
export const FILTER_CATEGORIES: FilterCategory[] = [
  { key: 'accountTypes', label: 'Accounts Connected' },
  { key: 'teams', label: 'Team' },
  { key: 'trackingStatuses', label: 'Tracking Status' },
];

interface CategoryPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  pendingTypes: FilterKey[];
  setPendingTypes: Dispatch<SetStateAction<FilterKey[]>>;
  onApply: () => void;
  onCancel: () => void;
}

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
      PaperProps={{
        elevation: 2,
        sx: { mt: 0.75, width: 210, borderRadius: '8px', border: `1px solid ${GRAY_200}`, overflow: 'hidden' },
      }}
    >
      <Box sx={{ px: 2, pt: 1.75, pb: 1 }}>
        <Typography sx={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: GRAY_400,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        }}>
          Filter by
        </Typography>
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
              sx={{ p: 0, mr: 1.25, color: GRAY_300, '&.Mui-checked': { color: BLUE_600 } }}
            />
            <Typography sx={{ fontSize: '0.875rem', color: GRAY_700, lineHeight: 1 }}>
              {cat.label}
            </Typography>
          </Box>
        );
      })}

      <Divider sx={{ mt: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1.25 }}>
        <Button size="small" variant="contained" onClick={onApply}
          sx={{
            backgroundColor: GRAY_900,
            color: WHITE,
            fontSize: '0.8125rem',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '6px',
            px: 1.5,
            py: 0.5,
            boxShadow: 'none',
            minWidth: 0,
            '&:hover': { backgroundColor: GRAY_800, boxShadow: 'none' },
          }}>
          Apply
        </Button>
        <Button size="small" onClick={onCancel}
          sx={{
            color: GRAY_500,
            fontSize: '0.8125rem',
            fontWeight: 400,
            textTransform: 'none',
            p: 0,
            minWidth: 0,
            '&:hover': { backgroundColor: 'transparent', color: GRAY_700 },
          }}>
          Cancel
        </Button>
      </Box>
    </Popover>
  );
}
