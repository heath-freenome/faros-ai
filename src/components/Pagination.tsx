import { useCallback } from 'react';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { GRAY_200, GRAY_300, GRAY_500, GRAY_700, WHITE } from '../constants';
import { NavIconButton } from '../styles/components';

const PAGE_SIZES = [5, 10, 25, 50];

/** Props for `Pagination`. */
interface PaginationProps {
  /** Number of records displayed per page. */
  pageSize: number;
  /** 1-based index of the first visible record. */
  startIndex: number;
  /** 1-based index of the last visible record. */
  endIndex: number;
  /** Called with the new page size when the user changes the per-page selector. */
  onChange: (newPage: number) => void;
  /** True while employee data is being fetched; disables navigation buttons. */
  loading: boolean;
  /** Total number of employees matching the current search/filter. */
  totalCount: number;
  /** Called when the user clicks the previous-page button. */
  onPrev: () => void;
  /** Whether a previous page exists (disables the prev button when false). */
  hasPrev: boolean;
  /** Called when the user clicks the next-page button. */
  onNext: () => void;
  /** Whether a next page exists (disables the next button when false). */
  hasNext: boolean;
}

/**
 * Footer pagination bar rendered below the employee table.
 * Provides a per-page selector, a "X–Y of N" count display, and prev/next buttons.
 */
export function Pagination(props: PaginationProps) {
  const { pageSize, startIndex, endIndex, loading, totalCount, hasNext, hasPrev, onPrev, onNext, onChange } = props;

  /** Converts the Select's string event value to a number before forwarding to `onChange`. */
  const handleChange = useCallback(
    (e: SelectChangeEvent<number>) => onChange(Number(e.target.value)),
    [onChange],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: '0 0 8px 8px',
        mr: -0.25,
        py: 1.5,
        px: 2,
        gap: 0.75,
        backgroundColor: WHITE,
        border: `1px solid ${GRAY_200}`,
        borderTop: 0,
      }}
    >
      <Select<number>
        value={pageSize}
        onChange={handleChange}
        variant="outlined"
        size="small"
        IconComponent={KeyboardArrowDownIcon}
        renderValue={() => `${startIndex > 0 ? startIndex : 1}–${endIndex > 0 ? endIndex : pageSize}`}
        sx={{
          fontSize: '0.8125rem',
          color: GRAY_700,
          height: 30,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: GRAY_200 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: GRAY_300 },
          '& .MuiSelect-select': { py: 0, px: 1, pr: '24px !important' },
          '& .MuiSvgIcon-root': { fontSize: 16, right: 4 },
        }}
      >
        {PAGE_SIZES.map(size => (
          <MenuItem key={size} value={size} dense>
            <ListItemText primary={`${size} per page`} primaryTypographyProps={{ fontSize: '0.8125rem' }} />
          </MenuItem>
        ))}
      </Select>

      <Typography sx={{ fontSize: '0.8125rem', color: GRAY_500 }}>
        of {loading ? '…' : totalCount}
      </Typography>

      <NavIconButton onClick={onPrev} disabled={!hasPrev || loading}>
        <ChevronLeftIcon sx={{ fontSize: 16 }} />
      </NavIconButton>

      <NavIconButton onClick={onNext} disabled={!hasNext || loading}>
        <ChevronRightIcon sx={{ fontSize: 16 }} />
      </NavIconButton>
    </Box>
  );
}
