import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5D4037', // Deep brown
    },
    secondary: {
      main: '#B68D40', // Warm gold
    },
    background: {
      default: '#F5EFE7', // Aged-paper tone
    },
    text: {
      primary: '#3E2723', // Darker brown for contrast
      secondary: '#5D4037',
    },
    // Custom values for components that need specific colors
    custom: {
      border: '#d3c1a5', // Originally used for borders in the search filter
      sliderBg: '#ebe3d5', // Background for genre slider
      textSliderSelected: '#5D4037', // Color for selected genre
      textSliderUnselected: '#8D6E63', // Color for unselected genres
      searchIconHover: '#4E342E', // Hover color for search icon
    },
  },
  typography: {
    fontFamily: "'Playfair Display', serif",
    h6: {
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
      color: '#3E2723',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#5D4037',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontFamily: "'Playfair Display', serif",
          transition: '0.3s',
        },
        containedPrimary: {
          backgroundColor: '#5D4037',
          color: '#F5EFE7',
          '&:hover': {
            backgroundColor: '#4B3226',
          },
        },
        outlinedPrimary: {
          borderColor: '#5D4037',
          color: '#5D4037',
          '&:hover': {
            borderColor: '#4B3226',
            color: '#4B3226',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: '#F5EFE7',
          boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.2)',
          border: '2px solid #B68D40',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F5EFE7',
          borderRadius: '12px',
          border: '2px solid #B68D40',
        },
      },
    },
  },
});

export default theme;
