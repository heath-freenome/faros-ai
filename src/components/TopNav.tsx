import type { ReactNode, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';

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

function SquareIconButton({ children }: PropsWithChildren) {
  return (
      <IconButton
        size="small"
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
        <ViewSidebarOutlinedIcon sx={{ fontSize: 18, transform: 'rotate(180deg)' }} />
      </IconButton>

      <NavButton withArrow>Default Workspace</NavButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1, borderColor: GRAY_200 }} />

      <NavButton withArrow>Modules</NavButton>
      <NavButton>Scorecard</NavButton>

      <Box sx={{ flex: 1 }} />

      {/* Right side — Personal */}
      <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, fontWeight: 500, mr: 0.5 }}>
        Personal:
      </Typography>
      <SquareIconButton>
        <PhotoCameraFrontOutlinedIcon sx={{ fontSize: 18 }} />
      </SquareIconButton>
      <SquareIconButton>
        <Diversity1OutlinedIcon sx={{ fontSize: 18 }} />
      </SquareIconButton>

      {/* Right side — Acme */}
      <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, fontWeight: 500, ml: 1, mr: 0.5 }}>
        Acme:
      </Typography>
      <SquareIconButton>
        <HomeOutlinedIcon sx={{ fontSize: 18 }} />
      </SquareIconButton>
      <SquareIconButton>
        <FavoriteBorderOutlinedIcon sx={{ fontSize: 18 }} />
      </SquareIconButton>
    </Box>
  );
}
