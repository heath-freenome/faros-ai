import type {ReactNode} from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {GRAY_100, GRAY_700, GRAY_900} from "../constants.ts";

interface NavButtonProps {
    children: ReactNode;
    withArrow?: boolean;
}

export function NavButton({children, withArrow}: NavButtonProps) {
    return (
        <Button
            disableRipple
            endIcon={withArrow ? <KeyboardArrowDownIcon sx={{fontSize: '16px !important'}}/> : undefined}
            sx={{
                color: GRAY_700,
                fontSize: '0.8125rem',
                fontWeight: 500,
                textTransform: 'none',
                px: 1.25,
                py: 0.5,
                minWidth: 0,
                borderRadius: '6px',
                '&:hover': {backgroundColor: GRAY_100, color: GRAY_900},
                '& .MuiButton-endIcon': {ml: 0.25},
            }}
        >
            {children}
        </Button>
    );
}