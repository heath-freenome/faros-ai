import type { ReactNode } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EmployeeTable } from './EmployeeTable';
import { EmployeeDetailPanel } from './EmployeeDetailPanel';

import { GRAY_500, GRAY_900 } from '../constants';
import type { Employee } from '../types';

interface EmployeesPageProps {
    breadcrumb: ReactNode;
}

export function EmployeesPage(props: EmployeesPageProps) {
  const { breadcrumb } = props;
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  return (
    <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', height: '100%' }}>
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
