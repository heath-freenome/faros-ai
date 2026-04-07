import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { GREEN_100, GREEN_700, GRAY_100, GRAY_600, BLUE_100, BLUE_700, AMBER_100, AMBER_700 } from '../constants';

const STATUS_STYLES: Record<string, { backgroundColor: string; color: string }> = {
  Included: {
    backgroundColor: GREEN_100,
    color: GREEN_700,
  },
  Ignored: {
    backgroundColor: GRAY_100,
    color: GRAY_600,
  },
};

const CATEGORY_STYLES: Record<string, { backgroundColor: string; color: string }> = {
  Active: {
    backgroundColor: BLUE_100,
    color: BLUE_700,
  },
  Inactive: {
    backgroundColor: AMBER_100,
    color: AMBER_700,
  },
};

interface TrackingStatusBadgeProps {
  status: string;
  category: string;
}

export function TrackingStatusBadge({ status, category }: TrackingStatusBadgeProps) {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Ignored;
  const categoryStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES.Inactive;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {status && (
        <Chip
          label={status}
          size="small"
          sx={{
            ...statusStyle,
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 20,
            alignSelf: 'flex-start',
          }}
        />
      )}
      {category && (
        <Chip
          label={category}
          size="small"
          sx={{
            ...categoryStyle,
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 20,
            alignSelf: 'flex-start',
          }}
        />
      )}
    </Box>
  );
}
