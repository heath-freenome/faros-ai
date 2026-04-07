import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import type { Team } from '../types';
import {
  GRAY_100, GRAY_400, GRAY_700,
  BLUE_100, BLUE_700,
  INDIGO_100, INDIGO_800,
  VIOLET_100, VIOLET_700,
  SKY_100, SKY_700,
  GREEN_100, GREEN_800,
  EMERALD_100, EMERALD_800,
  AMBER_100, AMBER_700,
  YELLOW_100, YELLOW_800,
  RED_100, RED_800,
  PINK_100, PINK_800,
} from '../constants';

interface TeamColor {
  bg: string;
  color: string;
}

// Fixed color map keyed on lowercased team name
const TEAM_COLOR_MAP: Record<string, TeamColor> = {
  'frontend':       { bg: VIOLET_100, color: VIOLET_700 },
  'collaboration':  { bg: BLUE_100,   color: BLUE_700 },
  'data platform':  { bg: AMBER_100,  color: AMBER_700 },
  'sales':          { bg: EMERALD_100, color: EMERALD_800 },
  'backend':        { bg: SKY_100,    color: SKY_700 },
  'infrastructure': { bg: PINK_100,   color: PINK_800 },
  'security':       { bg: RED_100,    color: RED_800 },
};

// Fallback palette for any unknown team name, using a stable hash
const FALLBACK_PALETTE: TeamColor[] = [
  { bg: GRAY_100,   color: GRAY_700 },
  { bg: YELLOW_100, color: YELLOW_800 },
  { bg: GREEN_100,  color: GREEN_800 },
  { bg: INDIGO_100, color: INDIGO_800 },
];

function getTeamColor(name = ''): TeamColor {
  const key = name.toLowerCase();
  if (TEAM_COLOR_MAP[key]) return TEAM_COLOR_MAP[key];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = key.charCodeAt(i) + ((h << 5) - h);
  return FALLBACK_PALETTE[Math.abs(h) % FALLBACK_PALETTE.length];
}

interface TeamChipsProps {
  teams: Team[];
}

export function TeamChips({ teams }: TeamChipsProps) {
  if (!teams?.length) {
    return <Typography sx={{ color: GRAY_400, fontSize: '0.8rem' }}>—</Typography>;
  }
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {teams.map(team => {
        const { bg, color } = getTeamColor(team.name);
        return (
          <Chip
            key={team.id}
            label={team.name.toLowerCase()}
            size="small"
            sx={{
              backgroundColor: bg,
              color,
              fontSize: '0.7rem',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        );
      })}
    </Box>
  );
}
