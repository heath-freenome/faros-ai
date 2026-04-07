import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';

import { WHITE, GRAY_200, GRAY_400, GRAY_700, BLUE_600, BLUE_700 } from '../constants';

interface CrumbLinkProps {
  children: ReactNode;
}

function CrumbLink({ children }: CrumbLinkProps) {
  return (
    <Typography
      component="span"
      sx={{
        fontSize: '0.8125rem',
        color: BLUE_600,
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {children}
    </Typography>
  );
}

function CrumbSep() {
  return <ChevronRightIcon sx={{ fontSize: 14, color: GRAY_400, mx: 0.25 }} />;
}

export function Breadcrumb() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 1.5,
        backgroundColor: WHITE,
        borderBottom: `1px solid ${GRAY_200}`,
      }}
    >
      {/* Crumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CrumbLink>Admin Settings</CrumbLink>
        <CrumbSep />
        <CrumbLink>Organization Setup</CrumbLink>
        <CrumbSep />
        <Typography
          component="span"
          sx={{ fontSize: '0.8125rem', color: GRAY_700, fontWeight: 500 }}
        >
          Employees Page
        </Typography>
        <LockOutlinedIcon sx={{ fontSize: 13, color: GRAY_400, ml: 0.75 }} />
      </Box>

      {/* New button */}
      <Button
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: '16px !important' }} />}
        sx={{
          backgroundColor: BLUE_600,
          color: WHITE,
          fontSize: '0.8125rem',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: '6px',
          px: 1.75,
          py: 0.625,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: BLUE_700,
            boxShadow: 'none',
          },
        }}
      >
        New
      </Button>
    </Box>
  );
}
