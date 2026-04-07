import type {PropsWithChildren} from 'react';
import IconButton from '@mui/material/IconButton';

import {GRAY_100, GRAY_500} from '../constants.ts';

interface SquareIconButtonProps extends PropsWithChildren {
    onClick?: () => void;
}

export function SquareIconButton({children, onClick}: SquareIconButtonProps) {
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