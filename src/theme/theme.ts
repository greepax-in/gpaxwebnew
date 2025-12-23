// FILE: src/theme/theme.ts

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      layout: {
        sectionPaddingY: { xs: number; md: number };
        containerPaddingX: { xs: number; md: number };
        stackGap: { xs: number; md: number };
        cardPadding: { xs: number; md: number };
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      layout?: {
        sectionPaddingY?: { xs: number; md: number };
        containerPaddingX?: { xs: number; md: number };
        stackGap?: { xs: number; md: number };
        cardPadding?: { xs: number; md: number };
      };
    };
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1f7a52",
      dark: "#145a3d",
      light: "#2f9b6b",
      contrastText: "#f7f6f2",
    },
    secondary: {
      main: "#0f1b14",
    },
    success: {
      main: "#1f9f63",
      dark: "#157a4b",
      contrastText: "#061109",
    },
    background: {
      default: "#f6f5f0",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f1b14",
      secondary: "#40544a",
    },
    divider: "#d8dfd6",
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
    h1: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontSize: "2.5rem",
      lineHeight: 1.05,
      fontWeight: 600,
      letterSpacing: "-0.02em",
      "@media (min-width:900px)": {
        fontSize: "3.25rem",
      },
    },
    h2: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontSize: "1.75rem",
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      "@media (min-width:900px)": {
        fontSize: "2.25rem",
      },
    },
    h3: {
      fontFamily: "var(--font-display), var(--font-body), sans-serif",
      fontSize: "1.125rem",
      lineHeight: 1.3,
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 16,
  },
  custom: {
    layout: {
      sectionPaddingY: { xs: 32, md: 72 },
      containerPaddingX: { xs: 20, md: 32 },
      stackGap: { xs: 16, md: 24 },
      cardPadding: { xs: 20, md: 28 },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        body: {
          margin: 0,
          backgroundColor: "#f6f5f0",
          color: "#0f1b14",
          fontFamily: "var(--font-body), sans-serif",
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
      styleOverrides: {
        root: {
          paddingLeft: 20,
          paddingRight: 20,
          "@media (min-width:900px)": {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          minHeight: 46,
          padding: "10px 20px",
          transition:
            "background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
        },
        containedPrimary: {
          backgroundColor: "#1f7a52",
        },
        containedSuccess: {
          backgroundColor: "#1f9f63",
          color: "#061109",
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #d8dfd6",
          borderRadius: 20,
          boxShadow: "0 16px 40px rgba(15, 27, 20, 0.08)",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          border: "1px solid #d8dfd6",
          backgroundColor: "#f6f5f0",
          color: "#0f1b14",
          fontWeight: 600,
        },
        label: {
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 4,
          paddingBottom: 4,
          fontSize: "0.75rem",
        },
      },
    },
  },
});

export default theme;
