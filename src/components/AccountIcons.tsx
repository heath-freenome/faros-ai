import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import type { Account } from '../types';
import { GRAY_400 } from '../constants';
import githubIcon from '../../assets/icons/github.png';
import jiraIcon from '../../assets/icons/jira.png';
import pagerdutyIcon from '../../assets/icons/pagerduty.png';
import googleCalendarIcon from '../../assets/icons/google-calendar.png';

interface AccountMeta {
  icon: string;
  label: string;
}

const ACCOUNT_META: Record<string, AccountMeta> = {
  vcs: { icon: githubIcon, label: 'GitHub' },
  tms: { icon: jiraIcon, label: 'Jira' },
  ims: { icon: pagerdutyIcon, label: 'PagerDuty' },
  cal: { icon: googleCalendarIcon, label: 'Google Calendar' },
};

// Canonical order to display account icons
const TYPE_ORDER = ['vcs', 'tms', 'ims', 'cal'];

interface AccountIconsProps {
  accounts: Account[];
}

export function AccountIcons({ accounts }: AccountIconsProps) {
  if (!accounts?.length) {
    return (
      <Box sx={{ color: GRAY_400, fontSize: '0.75rem' }}>—</Box>
    );
  }

  // Deduplicate by type for icon display
  const presentTypes = new Set(accounts.map(a => a.type));

  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
      {TYPE_ORDER.filter(t => presentTypes.has(t)).map(type => {
        const meta = ACCOUNT_META[type];
        if (!meta) {
          return null;
        }
        // Find accounts of this type for tooltip
        const accountsOfType = accounts.filter(a => a.type === type);
        const tooltipContent = accountsOfType.map(a => `${a.source}: ${a.uid}`).join(', ');
        return (
          <Tooltip key={type} title={tooltipContent} arrow placement="top">
            <Box
              component="img"
              src={meta.icon}
              alt={meta.label}
              sx={{
                width: 20,
                height: 20,
                objectFit: 'contain',
                borderRadius: '3px',
                cursor: 'default',
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}
