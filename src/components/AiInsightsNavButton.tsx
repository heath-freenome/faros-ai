import { useCallback, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

import { AMBER_600, BLUE_600, ENABLE_AI_EMPLOYEE_INSIGHTS, OPT_OUT_TOKEN, WHITE } from '../constants';
import { useFeatureFlag } from '../context/FeatureFlags';
import { isConsentExpired, useConsent } from '../context/ConsentContext';
import { SquareIconButton } from './SquareIconButton';
import { InsightsTooltipContent } from './InsightsTooltipContent';
import { AiInsightsConsentDialog } from './AiInsightsConsentDialog';
import { ExpiredTooltipContent } from './ExpiredTooltipContent.tsx';

function tooltipSx(color: string) {
  return {
    tooltip: {
      sx: {
        backgroundColor: color,
        color: WHITE,
        borderRadius: '8px',
        px: 1.5,
        py: 1,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
    arrow: { sx: { color: color } },
  };
}

export function AiInsightsNavButton() {
  const aiInsightsEnabled = useFeatureFlag(ENABLE_AI_EMPLOYEE_INSIGHTS);
  const { consentToken, expiresAt } = useConsent();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(aiInsightsEnabled && consentToken === null);

  const openDialog = useCallback(() => {
    setTooltipOpen(false);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const closeTooltip = useCallback(() => setTooltipOpen(false), []);

  if (!aiInsightsEnabled) {
    return undefined;
  }

  const consentGranted = consentToken !== null && consentToken !== OPT_OUT_TOKEN;
  const expired = consentGranted && isConsentExpired(expiresAt);

  return (
    <>
      <Tooltip
        open={tooltipOpen || expired}
        title={
          expired
            ? <ExpiredTooltipContent onReconsent={openDialog}/>
            : <InsightsTooltipContent onClose={closeTooltip}/>
        }
        placement="bottom"
        arrow
        slotProps={tooltipSx(expired ? AMBER_600 : BLUE_600)}
      >
        <span>
          <SquareIconButton onClick={openDialog}>
            {consentGranted && !expired
              ? <AutoAwesomeIcon sx={{ fontSize: 18, color: BLUE_600 }}/>
              : <AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }}/>
            }
          </SquareIconButton>
        </span>
      </Tooltip>

      <AiInsightsConsentDialog open={dialogOpen} onClose={closeDialog}/>
    </>
  );
}
