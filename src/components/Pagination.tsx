import { useCallback } from "react";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {GRAY_100, GRAY_200, GRAY_300, GRAY_50, GRAY_500, GRAY_700} from "../constants.ts";

const PAGE_SIZES = [5, 10, 25, 50];

export function Pagination(props: {
    pageSize: number,
    startIndex: number,
    endIndex: number,
    onChange: (newPage: number) => void,
    loading: boolean,
    totalCount: number,
    onPrev: () => void,
    hasPrev: boolean,
    onNext: () => void,
    hasNext: boolean
}) {
    const { pageSize, startIndex, endIndex, loading, totalCount, hasNext, hasPrev, onPrev, onNext, onChange } = props;

    const handleChange = useCallback((e: SelectChangeEvent<number>) =>
        onChange(Number(e.target.value)),
        [onChange]
    );

    return (
        <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1.5, gap: 0.75}}>
            <Select<number>
                value={pageSize}
                onChange={handleChange}
                variant="outlined"
                size="small"
                IconComponent={KeyboardArrowDownIcon}
                renderValue={() => `${startIndex > 0 ? startIndex : 1}–${endIndex > 0 ? endIndex : pageSize}`}
                sx={{
                    fontSize: "0.8125rem", color: GRAY_700, height: 30,
                    "& .MuiOutlinedInput-notchedOutline": {borderColor: GRAY_200},
                    "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: GRAY_300},
                    "& .MuiSelect-select": {py: 0, px: 1, pr: "24px !important"},
                    "& .MuiSvgIcon-root": {fontSize: 16, right: 4},
                }}
            >
                {PAGE_SIZES.map((size) => (
                    <MenuItem key={size} value={size} dense>
                        <ListItemText primary={`${size} per page`} primaryTypographyProps={{fontSize: '0.8125rem'}}/>
                    </MenuItem>
                ))}
            </Select>

            <Typography sx={{fontSize: "0.8125rem", color: GRAY_500}}>
                of {loading ? "…" : totalCount}
            </Typography>

            <IconButton
                size="small"
                onClick={onPrev}
                disabled={!hasPrev || loading}
                sx={{
                    width: 28,
                    height: 28,
                    border: `1px solid ${GRAY_200}`,
                    borderRadius: "6px",
                    color: GRAY_700,
                    "&:disabled": {color: GRAY_300, borderColor: GRAY_100},
                    "&:hover:not(:disabled)": {backgroundColor: GRAY_50}
                }}
            >
                <ChevronLeftIcon sx={{fontSize: 16}}/>
            </IconButton>

            <IconButton
                size="small"
                onClick={onNext}
                disabled={!hasNext || loading}
                sx={{
                    width: 28,
                    height: 28,
                    border: `1px solid ${GRAY_200}`,
                    borderRadius: "6px",
                    color: GRAY_700,
                    "&:disabled": {color: GRAY_300, borderColor: GRAY_100},
                    "&:hover:not(:disabled)": {backgroundColor: GRAY_50}
                }}
            >
                <ChevronRightIcon sx={{fontSize: 16}}/>
            </IconButton>
        </Box>
    );
}