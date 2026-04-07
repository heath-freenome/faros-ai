import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { TrackingStatusCell } from './TrackingStatusCell';
import { AccountIcons } from './AccountIcons';
import { TeamChips } from './TeamChips';
import { ColHeader } from './ColHeader';
import { SkeletonRow } from './SkeletonRow';
import type { Employee } from '../types';
import {
  WHITE, GRAY_50, GRAY_200, GRAY_300, GRAY_400, GRAY_700, GRAY_900,
  BLUE_50,
} from '../constants';

// ── Sticky column sx helpers ───────────────────────────────────────────────

const STICKY = { position: 'sticky' };
const STICKY_COL_1 = { ...STICKY, left: 0, zIndex: 3 } as const;
const STICKY_COL_2 = { ...STICKY, left: 52, zIndex: 3, borderRight: `1px solid ${GRAY_200}` } as const;
const STICKY_LAST = { ...STICKY, right: 0, zIndex: 3, borderLeft: `1px solid ${GRAY_200}` } as const;

// ── Props ──────────────────────────────────────────────────────────────────

/** Props for `TableData`. */
interface TableDataProps {
  /** The list of Employee records to display in the TableData component */
  employees: Employee[];
  /** Flag indicating whether the TableData is in the loading state */
  loading: boolean;
  /** Current page size; controls the number of skeleton rows shown while loading. */
  pageSize: number;
  /** Set of employee IDs that are currently checked. */
  selected: Set<string>;
  /** True when every employee on the current page is selected. */
  allSelected: boolean;
  /** True when some (but not all) employees on the current page are selected. */
  someSelected: boolean;
  /** ID of the employee currently open in the detail panel, or undefined. */
  viewedEmployeeId?: string;
  /** Called when the header checkbox changes — selects or deselects all visible rows. */
  onSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Called when a single row's checkbox is toggled, with that employee's ID. */
  onSelectOne: (id: string) => void;
  /** Called with the full employee object when the user clicks "View". */
  onView: (emp: Employee) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Scrollable MUI Table that renders employee rows with sticky first/last columns.
 * Shows skeleton rows while loading, an empty-state message when no results are found,
 * and highlights selected or currently-viewed rows in light blue.
 */
export function TableData({
  employees,
  loading,
  pageSize,
  selected,
  allSelected,
  someSelected,
  viewedEmployeeId,
  onSelectAll,
  onSelectOne,
  onView,
}: TableDataProps) {
  const isViewingEmployee = viewedEmployeeId !== undefined;
  return (
    <TableContainer sx={{ border: `1px solid ${GRAY_200}`, borderRadius: '8px 8px 0 0', overflowX: 'auto', backgroundColor: WHITE }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: GRAY_50 }}>
            {/* Checkbox — sticky left */}
            <TableCell
              padding="checkbox"
              sx={{ pl: 2, width: 52, ...(isViewingEmployee ? STICKY_COL_1 : undefined) }}
            >
              <Checkbox
                size="small"
                indeterminate={someSelected}
                checked={allSelected}
                onChange={onSelectAll}
              />
            </TableCell>

            {/* Name — sticky left */}
            <TableCell sx={{ width: 220, minWidth: 220, ...(isViewingEmployee ? STICKY_COL_2 : undefined) }}>
              <ColHeader sortable sorted>Name</ColHeader>
            </TableCell>

            {/* Scrollable middle columns */}
            <TableCell sx={{ whiteSpace: 'nowrap' }}><ColHeader sortable>Tracking Status</ColHeader></TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}><ColHeader>Teams</ColHeader></TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}><ColHeader sortable>Accounts Connected</ColHeader></TableCell>

            {/* View — sticky right */}
            <TableCell sx={{ width: 72, ...(isViewingEmployee ? STICKY_LAST : undefined) }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
            : employees.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: GRAY_400, border: 0 }}>
                    No employees found
                  </TableCell>
                </TableRow>
              )
              : employees.map(emp => {
                const isHighlighted = selected.has(emp.id) || emp.id === viewedEmployeeId;
                const rowBg = isHighlighted ? BLUE_50 : WHITE;
                const rowHoverBg = isHighlighted ? BLUE_50 : GRAY_50;
                return (
                  <TableRow
                    key={emp.id}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '& td': { backgroundColor: rowBg },
                      '&:hover td': { backgroundColor: rowHoverBg },
                    }}
                  >
                    {/* Checkbox — sticky left */}
                    <TableCell
                      padding="checkbox"
                      sx={{ pl: 2, width: 52, ...(isViewingEmployee ? STICKY_COL_1 : undefined) }}
                    >
                      <Checkbox
                        size="small"
                        checked={selected.has(emp.id)}
                        onChange={() => onSelectOne(emp.id)}
                      />
                    </TableCell>

                    {/* Name — sticky left */}
                    <TableCell sx={{ width: 220, minWidth: 220, ...(isViewingEmployee ? STICKY_COL_2 : undefined) }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Avatar src={emp.photoUrl} alt={emp.name} sx={{ flexShrink: 0 }}>
                          {emp.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: GRAY_900, lineHeight: 1.4 }}>
                            {emp.name || '—'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, lineHeight: 1.4 }}>
                            {emp.email || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Scrollable middle columns */}
                    <TableCell>
                      <TrackingStatusCell status={emp.trackingStatus} category={emp.trackingCategory} />
                    </TableCell>
                    <TableCell>
                      <TeamChips teams={emp.teams} />
                    </TableCell>
                    <TableCell>
                      <AccountIcons accounts={emp.accounts} />
                    </TableCell>

                    {/* View — sticky right */}
                    <TableCell
                      align="right"
                      sx={{ pr: 2, width: 72, ...(isViewingEmployee ? STICKY_LAST : undefined) }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onView(emp)}
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          color: GRAY_700,
                          borderColor: GRAY_200,
                          borderRadius: '6px',
                          px: 1.5,
                          py: 0.25,
                          minWidth: 0,
                          boxShadow: 'none',
                          '&:hover': { borderColor: GRAY_300, backgroundColor: GRAY_50, boxShadow: 'none' },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
