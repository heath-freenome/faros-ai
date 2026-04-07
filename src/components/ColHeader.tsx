import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import { GRAY_400, GRAY_500 } from '../constants';

interface ColHeaderProps {
  children: ReactNode;
  sortable?: boolean;
}

export function ColHeader({ children, sortable }: ColHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, userSelect: 'none' }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: GRAY_500, letterSpacing: 0 }}>
        {children}
      </Typography>
      {sortable && (
        <UnfoldMoreIcon sx={{ fontSize: 14, color: GRAY_400 }} />
      )}
    </Box>
  );
}
