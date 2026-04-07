import {useCallback, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

import {
  BLUE_600,
  ENABLE_AI_EMPLOYEE_INSIGHTS,
  GRAY_200,
  GRAY_400,
  GRAY_500,
  TOP_NAV_HEIGHT,
  WHITE,
} from '../constants';
import { useFeatureFlag } from '../context/FeatureFlags';
import { useConsent } from '../context/ConsentContext';
import { AiInsightsConsentDialog } from './AiInsightsConsentDialog';
import { SquareIconButton } from './SquareIconButton.tsx';
import { NavButton } from './NavButton.tsx';
import { InsightsTooltipContent } from './InsightsTooltipContent.tsx';

export function TopNav() {
  const aiInsightsEnabled = useFeatureFlag(ENABLE_AI_EMPLOYEE_INSIGHTS);
  const { consentToken } = useConsent();
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(aiInsightsEnabled && consentToken === null);

  const openDialog = useCallback(() => {
    setTooltipOpen(false);
    setConsentDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => setConsentDialogOpen(false), []);

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
      {/* Left side */}
      <IconButton size="small" sx={{ color: GRAY_500, mr: 0.5 }}>
        <ViewSidebarOutlinedIcon sx={{ fontSize: 18, transform: 'rotate(180deg)' }} />
      </IconButton>

      <NavButton withArrow>Default Workspace</NavButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1, borderColor: GRAY_200 }} />

      <NavButton withArrow>Modules</NavButton>
      <NavButton>Scorecard</NavButton>

      <Box sx={{ flex: 1 }} />

      {/* AI Insights button — feature-flagged */}
      {aiInsightsEnabled && (
        <>
          <Tooltip
            open={tooltipOpen}
            title={<InsightsTooltipContent onClose={() => setTooltipOpen(false)} />}
            placement="bottom"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: BLUE_600,
                  color: WHITE,
                  borderRadius: '8px',
                  px: 1.5,
                  py: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              },
              arrow: { sx: { color: BLUE_600 } },
            }}
          >
            <span>
              <SquareIconButton onClick={openDialog}>
                <AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />
              </SquareIconButton>
            </span>
          </Tooltip>
          <AiInsightsConsentDialog
            open={consentDialogOpen}
            onClose={closeDialog}
          />
        </>
      )}

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
