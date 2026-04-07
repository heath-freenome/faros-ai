import type { ReactNode } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { EmployeeTable } from './EmployeeTable';
import { EmployeeDetailPanel } from './EmployeeDetailPanel';
import { GRAY_500, GRAY_900, TOP_NAV_HEIGHT } from '../constants';
import type { Employee } from '../types';

/** Props for `EmployeesPage`. */
interface EmployeesPageProps {
  /** Breadcrumb node rendered above the page title. */
  breadcrumb: ReactNode;
}

/**
 * Top-level page layout for the Employees section.
 * Renders the breadcrumb, page heading, employee table, and an optional
 * side-panel for the selected employee, all in a horizontally split layout.
 */
export function EmployeesPage(props: EmployeesPageProps) {
  const { breadcrumb } = props;
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', height: `calc(100vh - ${TOP_NAV_HEIGHT}px)` }}>
      {/* Main content — scrolls independently */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pt: 3, pb: 4 }}>
        {breadcrumb}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: GRAY_900,
            fontSize: '1.625rem',
            mt: 0.75,
            mb: 0.75,
            letterSpacing: '-0.02em',
          }}
        >
          Employees
        </Typography>
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: GRAY_500,
            mt: 1.5,
            mb: 3,
          }}
        >
          Easily assign employees to teams, include them for tracking in team productivity status,
          and manage their connected accounts.
        </Typography>

        <EmployeeTable onView={setSelectedEmployee} viewedEmployeeId={selectedEmployee?.id} />
      </Box>

      {/* Detail panel — fixed width, scrolls independently */}
      {selectedEmployee && (
        <EmployeeDetailPanel
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </Box>
  );
}
