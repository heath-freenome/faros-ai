import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';

import { GRAY_200, GRAY_400, GRAY_500, TOP_NAV_HEIGHT, WHITE } from '../constants';
import { SquareIconButton } from './SquareIconButton';
import { NavButton } from './NavButton';
import { AiInsightsNavButton } from './AiInsightsNavButton';

export function TopNav() {
  return (
    <Box
      sx={{
        height: TOP_NAV_HEIGHT,
        backgroundColor: WHITE,
        borderBottom: `1px solid ${GRAY_200}`,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 0.5,
        flexShrink: 0,
      }}
    >
      {/* Left side. This is hard-coded for pixel perfection. */}
      <IconButton size="small" sx={{ color: GRAY_500, mr: 0.5 }}>
        <ViewSidebarOutlinedIcon sx={{ fontSize: 18, transform: 'rotate(180deg)' }} />
      </IconButton>

      <NavButton withArrow>Default Workspace</NavButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1, borderColor: GRAY_200 }} />

      <NavButton withArrow>Modules</NavButton>
      <NavButton>Scorecard</NavButton>

      <Box sx={{ flex: 1 }} />

      <AiInsightsNavButton />

      {/* Right side — Personal. This is hard-coded for pixel perfection. */}
      <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, fontWeight: 500, mr: 0.5 }}>
        Personal:
      </Typography>
      <SquareIconButton>
        <PhotoCameraFrontOutlinedIcon sx={{ fontSize: 18 }} />
      </SquareIconButton>
      <SquareIconButton>
        <Diversity1OutlinedIcon sx={{ fontSize: 18 }} />
      </SquareIconButton>

      {/* Right side — Acme. This is hard-coded for pixel perfection. */}
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
