import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Public-facing pages (landing, login, signup, legal pages, 404) were built with hardcoded
// light backgrounds and never designed for a dark variant. They sit outside the
// authenticated app's Layout, so the app-wide dark mode toggle (ThemeModeContext) would
// otherwise flip their theme-relative text/icon colors to light-on-light and make them
// unreadable. This pins them to a fixed light theme regardless of that toggle.
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6f42c1' },
  },
});

export default function LightModeShell({ children }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
