'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-inter)',
  },

  palette: {
    primary: {
        main: '#6366F1'
    }
  }
});

export default theme;
