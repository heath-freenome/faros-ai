import { createTheme } from '@mui/material/styles';

import {
  WHITE, BRAND_NAVY_DARK, BRAND_NAVY, BRAND_NAVY_LIGHT, BRAND_ORANGE,
  GRAY_50, GRAY_50_COOL, GRAY_200, GRAY_300, GRAY_400, GRAY_500, GRAY_900,
  GREEN_100, GREEN_600, GREEN_700,
  RED_600,
  AMBER_100, AMBER_600,
  BLUE_100, BLUE_600,
} from './constants';

export const theme = createTheme({
  palette: {
    primary: {
      main: BRAND_NAVY,
      light: BRAND_NAVY_LIGHT,
      dark: BRAND_NAVY_DARK,
      contrastText: WHITE,
    },
    secondary: {
      main: BRAND_ORANGE,
      contrastText: WHITE,
    },
    background: {
      default: GRAY_50_COOL,
      paper: WHITE,
    },
    text: {
      primary: GRAY_900,
      secondary: GRAY_500,
    },
    divider: GRAY_200,
    success: {
      main: GREEN_600,
      light: GREEN_100,
      dark: GREEN_700,
    },
    error: {
      main: RED_600,
    },
    warning: {
      main: AMBER_600,
      light: AMBER_100,
    },
    info: {
      main: BLUE_600,
      light: BLUE_100,
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, Roboto, sans-serif',
    fontSize: 14,
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem' },
    caption: { fontSize: '0.75rem', color: GRAY_500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 22,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: GRAY_200,
          padding: '12px 16px',
        },
        head: {
          backgroundColor: GRAY_50,
          color: GRAY_500,
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: GRAY_50,
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: WHITE,
          '& fieldset': {
            borderColor: GRAY_300,
          },
          '&:hover fieldset': {
            borderColor: GRAY_400,
          },
          '&.Mui-focused fieldset': {
            borderColor: BRAND_NAVY,
          },
        },
        input: {
          padding: '8px 12px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '8px 12px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderLeft: `1px solid ${GRAY_200}`,
        },
      },
    },
  },
});
