import type { PropsWithChildren } from 'react';
import IconButton from '@mui/material/IconButton';

import { GRAY_100, GRAY_500 } from '../constants.ts';

/** Props for `SquareIconButton`. */
interface SquareIconButtonProps extends PropsWithChildren {
  onClick?: () => void;
}

/** Small square icon button with a visible border, used in the top nav toolbar. */
export function SquareIconButton({ children, onClick }: SquareIconButtonProps) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      sx={{
        color: GRAY_500,
        border: `1px solid ${GRAY_100}`,
        borderRadius: 1,
        mx: 0.5,
      }}
    >
      {children}
    </IconButton>
  );
}