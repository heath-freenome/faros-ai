import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import SearchIcon from '@mui/icons-material/Search';

import type { FilterItem, FilterKey } from '../types';
import { WHITE, GRAY_50, GRAY_200, GRAY_300, GRAY_400, GRAY_500, GRAY_700, GRAY_800, GRAY_900, BLUE_600 } from '../constants';

interface CategoryMeta {
  searchPlaceholder: string;
}

const CATEGORY_META: Partial<Record<FilterKey, CategoryMeta>> = {
  teams:            { searchPlaceholder: 'Search team name...' },
  trackingStatuses: { searchPlaceholder: 'Search status...' },
  accountTypes:     { searchPlaceholder: 'Search account...' },
};

interface SubFilterPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  categoryKey: FilterKey;
  items: FilterItem[];
  selectedValues: string[];
  onApply: (newValues: string[]) => void;
  onCancel: () => void;
}

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

  function toggle(value: string) {
    setLocal(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
    );
  }

  function toggleAll() {
    setLocal(allSelected ? [] : items.map(i => i.value));
  }

  const { searchPlaceholder } = CATEGORY_META[categoryKey] ?? { searchPlaceholder: 'Search...' };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onCancel}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        elevation: 2,
        sx: {
          mt: 0.75,
          width: 230,
          borderRadius: '8px',
          border: `1px solid ${GRAY_200}`,
          overflow: 'hidden',
        },
      }}
    >
      {/* Search */}
      <Box sx={{ px: 1.5, pt: 1.25, pb: 0.75 }}>
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
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
            sx: {
              fontSize: '0.8125rem',
              backgroundColor: GRAY_50,
              '& fieldset': { borderColor: GRAY_200 },
              '&:hover fieldset': { borderColor: GRAY_300 },
              '&.Mui-focused fieldset': { borderColor: BLUE_600, borderWidth: '1px' },
              '& input': { py: '6px', px: '4px' },
            },
          }}
        />
      </Box>

      {/* Deselect all / Select all */}
      <Box sx={{ px: 1.5, pb: 0.5 }}>
        <Button
          size="small"
          onClick={toggleAll}
          sx={{
            fontSize: '0.75rem',
            color: GRAY_500,
            textTransform: 'none',
            p: 0,
            minWidth: 0,
            fontWeight: 400,
            '&:hover': { backgroundColor: 'transparent', color: GRAY_700 },
          }}
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </Button>
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
                sx={{
                  p: 0,
                  flexShrink: 0,
                  color: GRAY_300,
                  '&.Mui-checked': { color: BLUE_600 },
                }}
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
        <Button
          size="small"
          variant="contained"
          onClick={() => onApply(local)}
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
          }}
        >
          Apply
        </Button>
        <Button
          size="small"
          onClick={onCancel}
          sx={{
            color: GRAY_500,
            fontSize: '0.8125rem',
            fontWeight: 400,
            textTransform: 'none',
            p: 0,
            minWidth: 0,
            '&:hover': { backgroundColor: 'transparent', color: GRAY_700 },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Popover>
  );
}
