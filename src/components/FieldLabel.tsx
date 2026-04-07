import type { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

import { GRAY_500 } from '../constants';

/** Small muted label rendered above a form field in the detail panel. */
export function FieldLabel({ children }: PropsWithChildren) {
  return (
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: GRAY_500, mb: 0.625 }}>
      {children}
    </Typography>
  );
}
