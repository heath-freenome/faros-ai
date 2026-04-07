import { useState } from 'react';
import type { MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';

import {
  GRAY_50, GRAY_100, GRAY_200, GRAY_400, GRAY_600,
  GREEN_100, GREEN_700,
  AMBER_100, AMBER_700,
  BLUE_600,
} from '../constants';

// ── Status option definitions ──────────────────────────────────────────────

export interface StatusOption {
  status: string;
  category: string;
  bg: string;
  color: string;
  label: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { status: 'Included', category: 'Active',   bg: GREEN_100, color: GREEN_700, label: 'Included · Active' },
  { status: 'Included', category: 'Inactive', bg: AMBER_100, color: AMBER_700, label: 'Included · Inactive' },
  { status: 'Ignored',  category: '',         bg: GRAY_100,  color: GRAY_600,  label: 'Ignored' },
];

export function getStatusOption(status: string, category: string): StatusOption {
  return (
    STATUS_OPTIONS.find(o => o.status === status && o.category === category) ??
    STATUS_OPTIONS[0]
  );
}

// ── Component ──────────────────────────────────────────────────────────────

interface StatusChooserProps {
  status: string;
  category: string;
  onChange: (status: string, category: string) => void;
}

export function StatusChooser({ status, category, onChange }: StatusChooserProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const current = getStatusOption(status, category);

  function open(e: MouseEvent<HTMLElement>) {
    setAnchor(e.currentTarget);
  }

  function select(opt: StatusOption) {
    onChange(opt.status, opt.category);
    setAnchor(null);
  }

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
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 0.75,
            minWidth: 200,
            borderRadius: '8px',
            border: `1px solid ${GRAY_200}`,
            overflow: 'hidden',
            py: 0.75,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: GRAY_400,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            px: 2,
            pt: 0.75,
            pb: 1,
          }}
        >
          Tracking status
        </Typography>

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
