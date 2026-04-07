import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import {WHITE} from "../constants.ts";
import CloseIcon from "@mui/icons-material/Close";

interface InsightsTooltipContentProps {
    onClose: () => void;
}

export function InsightsTooltipContent({onClose}: InsightsTooltipContentProps) {
    return (
        <Box sx={{p: 0.5, maxWidth: 240}}>
            <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5}}>
                <Typography sx={{fontSize: '0.8125rem', fontWeight: 600}}>
                    New: AI Employee Insights
                </Typography>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        color: WHITE,
                        opacity: 0.8,
                        p: 0,
                        ml: 1,
                        '&:hover': {opacity: 1, backgroundColor: 'transparent'}
                    }}
                >
                    <CloseIcon sx={{fontSize: 14}}/>
                </IconButton>
            </Box>
            <Typography sx={{fontSize: '0.75rem', lineHeight: 1.5, opacity: 0.9}}>
                Unlock AI-powered analysis of team activity to surface productivity trends,
                flag anomalies, and get recommendations — all in one click.
            </Typography>
        </Box>
    );
}