import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonOffIcon from '@mui/icons-material/PersonOff';

import { GRAY_400, GRAY_900, GREEN_600, AMBER_500 } from '../constants';

/** Colour configuration for a single tracking status + category combination. */
interface StatusConfig {
  /** Colour applied to the person icon. */
  iconColor: string;
  /** Colour applied to the status dot (reserved for future use). */
  dotColor: string;
  /** Icon component to render. */
  Icon: React.ElementType;
}

/** Maps category keys (including `"default"`) to their `StatusConfig`. */
type StatusMap = Record<string, StatusConfig>;

const STATUS_CONFIG: Record<string, StatusMap> = {
  Included: {
    Active: { iconColor: GREEN_600, dotColor: GREEN_600, Icon: PersonIcon },
    Inactive: { iconColor: AMBER_500, dotColor: AMBER_500, Icon: PersonOutlineIcon },
    default: { iconColor: GREEN_600, dotColor: GREEN_600, Icon: PersonIcon },
  },
  Ignored: {
    default: { iconColor: GRAY_400, dotColor: GRAY_400, Icon: PersonOffIcon },
  },
};

/** Props for `TrackingStatusCell`. */
interface TrackingStatusCellProps {
  /** Tracking inclusion status, e.g. `"Included"` or `"Ignored"`. */
  status: string;
  /** Activity category, e.g. `"Active"` or `"Inactive"`. Empty string for ignored employees. */
  category: string;
}

/**
 * Table cell content that renders a coloured person icon alongside the
 * tracking status and (when applicable) the activity category as text.
 */
export function TrackingStatusCell({ status, category }: TrackingStatusCellProps) {
  const statusMap = STATUS_CONFIG[status] || STATUS_CONFIG.Ignored;
  const { iconColor, Icon } = statusMap[category] || statusMap.default;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Icon */}
      <Icon sx={{ fontSize: 18, color: iconColor, flexShrink: 0 }} />

      {/* Text */}
      <Box>
        <Typography
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: GRAY_900,
            lineHeight: 1.4,
          }}
        >
          {status || '—'}
        </Typography>
        {category && status !== 'Ignored' && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: iconColor,
              lineHeight: 1.4,
            }}
          >
            {category}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
