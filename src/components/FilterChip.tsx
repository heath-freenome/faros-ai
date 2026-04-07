import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import {GRAY_300, GRAY_400, GRAY_700, SKY_100, SKY_200, SKY_700} from '../constants';

/** Props for `FilterChip`. */
interface FilterChipProps {
  /** Filter dimension name, e.g. "Team". */
  label: string;
  /** Currently selected value summary, e.g. "Frontend" or "3 selected". */
  valueLabel: string;
  /** Called when the chip body is clicked (opens the sub-filter popover). */
  onClick: (e: MouseEvent<HTMLElement>) => void;
  /** Called when the close icon is clicked (removes this filter). */
  onRemove: () => void;
}

/**
 * Active filter chip displayed in the filter bar.
 * Shows the dimension label and current value summary; clicking opens the
 * sub-filter popover, and the × icon removes the filter entirely.
 */
export function FilterChip({ label, valueLabel, onClick, onRemove }: FilterChipProps) {
  /** Stops propagation to the chip body and removes this filter dimension. */
  const handleRemove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove();
  }, [onRemove]);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 32,
        border: `1px solid ${GRAY_300}`,
        borderRadius: '6px',
        backgroundColor: SKY_100,
        px: 1.25,
        gap: 0.5,
        cursor: 'pointer',
        '&:hover': { borderColor: SKY_700, backgroundColor: SKY_200 },
      }}
      onClick={onClick}
    >
      <Typography sx={{ fontSize: '0.8125rem', color: GRAY_700, lineHeight: 1, whiteSpace: 'nowrap' }}>
        <Box component="span" sx={{ fontWeight: 500 }}>{label}:</Box>
        {' '}{valueLabel}
      </Typography>
      <IconButton
        size="small"
        onClick={handleRemove}
        sx={{ p: 0, ml: 0.25, color: GRAY_400, '&:hover': { color: GRAY_700, backgroundColor: 'transparent' } }}
      >
        <CloseIcon sx={{ fontSize: 13 }} />
      </IconButton>
    </Box>
  );
}
