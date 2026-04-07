import type { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';

import {GRAY_400, GRAY_500, SKY_300 } from '../constants';

/** Props for `ColHeader`. */
interface ColHeaderProps extends PropsWithChildren {
  /** Shows a sort icon when true. */
  sortable?: boolean;
  /** Highlights the sort icon in sky-blue when true (indicates active sort). */
  sorted?: boolean;
}

/** Table column header with an optional sort indicator icon. */
export function ColHeader({ children, sortable, sorted }: ColHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, userSelect: 'none' }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: GRAY_500, letterSpacing: 0 }}>
        {children}
      </Typography>
      {sortable && (
        <SouthOutlinedIcon sx={{ fontSize: 14, color: sorted ? SKY_300 : GRAY_400 }} />
      )}
    </Box>
  );
}
