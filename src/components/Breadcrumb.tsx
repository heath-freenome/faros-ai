import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';

import { GRAY_400, GRAY_700 } from '../constants';
import { PrimaryButton } from '../styles/components';

/** Props for `CrumbLink`. */
interface CrumbLinkProps {
  children: ReactNode;
}

/** Individual clickable breadcrumb label. */
function CrumbLink({ children }: CrumbLinkProps) {
  return (
    <Typography
      component="span"
      sx={{
        fontSize: '0.8125rem',
        color: GRAY_700,
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {children}
    </Typography>
  );
}

/** Chevron separator rendered between breadcrumb items. */
function CrumbSep() {
  return <ChevronRightIcon sx={{ fontSize: 14, color: GRAY_400, mx: 0.25 }} />;
}

/**
 * Page breadcrumb bar for the Employees page.
 * Hard-coded to "Admin Settings > Organization Setup > Employees Page" with a
 * primary "New" action button on the right.
 */
export function Breadcrumb() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        mt: 1.5,
      }}
    >
      {/* Crumbs. This is hard-coded for pixel perfection. */}
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

      <PrimaryButton
        startIcon={<AddIcon sx={{ fontSize: '16px !important' }} />}
        sx={{ px: 1.75, py: 0.625 }}
      >
        New
      </PrimaryButton>
    </Box>
  );
}
