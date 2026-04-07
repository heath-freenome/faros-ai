import { styled } from '@mui/material/styles';
import Button, { type ButtonProps } from '@mui/material/Button';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import {
  BLUE_600, BLUE_700,
  GRAY_50, GRAY_100, GRAY_200, GRAY_300, GRAY_700, GRAY_800, GRAY_900,
  WHITE,
} from '../constants';

// ── Button base styles ─────────────────────────────────────────────────────

const StyledPrimaryButton = styled(Button)({
  backgroundColor: BLUE_600,
  color: WHITE,
  fontSize: '0.8125rem',
  boxShadow: 'none',
  '&:hover': { backgroundColor: BLUE_700, boxShadow: 'none' },
});

const StyledDarkButton = styled(Button)({
  backgroundColor: GRAY_900,
  color: WHITE,
  fontSize: '0.8125rem',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '12px',
  paddingRight: '12px',
  boxShadow: 'none',
  minWidth: 0,
  '&:hover': { backgroundColor: GRAY_800, boxShadow: 'none' },
});

const StyledGhostButton = styled(Button)({
  color: GRAY_700,
  fontSize: '0.8125rem',
  fontWeight: 400,
  padding: 0,
  minWidth: 0,
  '&:hover': { backgroundColor: 'transparent' },
});

const StyledNavIconButton = styled(IconButton)({
  width: 28,
  height: 28,
  border: `1px solid ${GRAY_200}`,
  borderRadius: '6px',
  color: GRAY_700,
  '&.Mui-disabled': { color: GRAY_300, borderColor: GRAY_100 },
  '&:hover:not(.Mui-disabled)': { backgroundColor: GRAY_50 },
});

// ── Exported wrappers (enforce sensible defaults) ──────────────────────────

/** Blue primary action button — contained/small by default */
export function PrimaryButton(props: ButtonProps) {
  return <StyledPrimaryButton variant="contained" size="small" {...props} />;
}

/** Dark (GRAY_900) apply/confirm button — contained/small by default */
export function DarkButton(props: ButtonProps) {
  return <StyledDarkButton variant="contained" size="small" {...props} />;
}

/** Ghost/text cancel button — small by default, no background */
export function GhostButton(props: ButtonProps) {
  return <StyledGhostButton size="small" {...props} />;
}

/** Bordered square icon button for Pagination prev/next — small by default */
export function NavIconButton(props: IconButtonProps) {
  return <StyledNavIconButton size="small" {...props} />;
}

// ── Typography ─────────────────────────────────────────────────────────────

/** Small all-caps section label used in popover headers */
export const PopoverSectionLabel = styled(Typography)({
  fontSize: '0.6875rem',
  fontWeight: 600,
  color: GRAY_700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
});
