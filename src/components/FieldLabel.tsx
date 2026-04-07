import type { ReactNode } from 'react';
import Typography from '@mui/material/Typography';

import { GRAY_500 } from '../constants';

interface FieldLabelProps {
  children: ReactNode;
}

export function FieldLabel({ children }: FieldLabelProps) {
  return (
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: GRAY_500, mb: 0.625 }}>
      {children}
    </Typography>
  );
}
