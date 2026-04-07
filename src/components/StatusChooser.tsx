import { useCallback, useState } from 'react';
import type { MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';

import {
  GRAY_50,
  GRAY_100, GRAY_600,
  GREEN_100, GREEN_700,
  AMBER_100, AMBER_700,
  BLUE_600,
} from '../constants';
import { PopoverSectionLabel } from '../styles/components';

// ── Status option definitions ──────────────────────────────────────────────

/** A selectable tracking-status option with its associated badge colours. */
export interface StatusOption {
  /** Tracking status value, e.g. `"Included"` or `"Ignored"`. */
  status: string;
  /** Activity category value, e.g. `"Active"`, `"Inactive"`, or `""`. */
  category: string;
  /** Background colour for the badge. */
  bg: string;
  /** Foreground/text colour for the badge. */
  color: string;
  /** Human-readable label shown in the dropdown and badge. */
  label: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { status: 'Included', category: 'Active',   bg: GREEN_100, color: GREEN_700, label: 'Included · Active' },
  { status: 'Included', category: 'Inactive', bg: AMBER_100, color: AMBER_700, label: 'Included · Inactive' },
  { status: 'Ignored',  category: '',         bg: GRAY_100,  color: GRAY_600,  label: 'Ignored' },
];

/**
 * Returns the `StatusOption` matching the given status/category pair,
 * falling back to the first option (Included · Active) if not found.
 */
export function getStatusOption(status: string, category: string): StatusOption {
  return (
    STATUS_OPTIONS.find(o => o.status === status && o.category === category) ??
    STATUS_OPTIONS[0]
  );
}

// ── Component ──────────────────────────────────────────────────────────────

/** Props for `StatusChooser`. */
interface StatusChooserProps {
  /** The status to display */
  status: string;
  /** The catecory of the status */
  category: string;
  /** Called with the new status and category when the user picks an option. */
  onChange: (status: string, category: string) => void;
}

/**
 * Inline badge-style dropdown for selecting an employee's tracking status.
 * Renders the current selection as a coloured badge; clicking it opens a
 * popover listing all available `STATUS_OPTIONS`.
 */
export function StatusChooser({ status, category, onChange }: StatusChooserProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const current = getStatusOption(status, category);

  /** Opens the status-selection popover anchored to the clicked element. */
  const open = useCallback((e: MouseEvent<HTMLElement>) => {
    setAnchor(e.currentTarget);
  }, []);

  /** Applies the chosen status option and closes the popover. */
  const select = useCallback((opt: StatusOption) => {
    onChange(opt.status, opt.category);
    setAnchor(null);
  }, [onChange]);

  return (
    <>
      {/* Trigger — styled as the badge + dropdown arrow */}
      <Box
        onClick={open}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.625,
          px: 1,
          py: 0.375,
          borderRadius: '2px',
          backgroundColor: current.bg,
          color: current.color,
          border: `1px solid ${current.color}40`,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'filter 0.1s',
          '&:hover': { filter: 'brightness(0.95)' },
        }}
      >
        <PersonIcon sx={{ fontSize: 13 }} />
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1 }}>
          {current.label}
        </Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 14, ml: 0.25, opacity: 0.7 }} />
      </Box>

      {/* Options popover */}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { mt: 0.75, minWidth: 200, py: 0.75 } }}
      >
        <PopoverSectionLabel sx={{ px: 2, pt: 0.75, pb: 1, display: 'block' }}>
          Tracking status
        </PopoverSectionLabel>

        {STATUS_OPTIONS.map(opt => {
          const isSelected = opt.status === status && opt.category === category;
          return (
            <Box
              key={opt.label}
              onClick={() => select(opt)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                cursor: 'pointer',
                backgroundColor: isSelected ? GRAY_50 : 'transparent',
                '&:hover': { backgroundColor: GRAY_50 },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.625,
                  px: 1,
                  py: 0.375,
                  borderRadius: '6px',
                  backgroundColor: opt.bg,
                  color: opt.color,
                  border: `1px solid ${opt.color}40`,
                }}
              >
                <PersonIcon sx={{ fontSize: 13 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1 }}>
                  {opt.label}
                </Typography>
              </Box>

              {isSelected && (
                <CheckIcon sx={{ fontSize: 15, color: BLUE_600, flexShrink: 0 }} />
              )}
            </Box>
          );
        })}
      </Popover>
    </>
  );
}
