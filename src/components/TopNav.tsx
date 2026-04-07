import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';

import { WHITE, GRAY_100, GRAY_200, GRAY_400, GRAY_500, GRAY_700, GRAY_900 } from '../constants';

interface NavButtonProps {
  children: ReactNode;
  withArrow?: boolean;
}

function NavButton({ children, withArrow }: NavButtonProps) {
  return (
    <Button
      disableRipple
      endIcon={withArrow ? <KeyboardArrowDownIcon sx={{ fontSize: '16px !important' }} /> : undefined}
      sx={{
        color: GRAY_700,
        fontSize: '0.8125rem',
        fontWeight: 500,
        textTransform: 'none',
        px: 1.25,
        py: 0.5,
        minWidth: 0,
        borderRadius: '6px',
        '&:hover': { backgroundColor: GRAY_100, color: GRAY_900 },
        '& .MuiButton-endIcon': { ml: 0.25 },
      }}
    >
      {children}
    </Button>
  );
}

export function TopNav() {
  return (
    <Box
      sx={{
        height: 48,
        backgroundColor: WHITE,
        borderBottom: `1px solid ${GRAY_200}`,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 0.5,
        flexShrink: 0,
      }}
    >
      {/* Left side */}
      <IconButton size="small" sx={{ color: GRAY_500, mr: 0.5 }}>
        <GridViewOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <NavButton withArrow>Default Workspace</NavButton>
      <NavButton withArrow>Modules</NavButton>
      <NavButton>Scorecard</NavButton>

      <Box sx={{ flex: 1 }} />

      {/* Right side — Personal */}
      <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, fontWeight: 500, mr: 0.5 }}>
        Personal:
      </Typography>
      <IconButton size="small" sx={{ color: GRAY_500 }}>
        <PersonOutlineIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton size="small" sx={{ color: GRAY_500 }}>
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: GRAY_200 }} />

      {/* Right side — Acme */}
      <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, fontWeight: 500, mr: 0.5 }}>
        Acme:
      </Typography>
      <IconButton size="small" sx={{ color: GRAY_500 }}>
        <HomeOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton size="small" sx={{ color: GRAY_500 }}>
        <BookmarkBorderOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
