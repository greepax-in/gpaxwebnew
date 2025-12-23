import { createTheme } from '@mui/material/styles';

export const greenpaxTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0F172A',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8FAFC',
    },
    divider: '#E5E7EB',
  },

  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',

    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: '#0F172A',
    },

    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#0F172A',
    },

    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      color: '#334155',
    },

    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#334155',
    },

    caption: {
      fontSize: '0.875rem',
      color: '#64748B',
    },

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  spacing: 8,

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E5E7EB',
          boxShadow: 'none',
        },
      },
    },

    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
  },
});
