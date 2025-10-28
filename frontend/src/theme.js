import { createTheme } from "@mui/material/styles";

const palettes = {
  dark: {
    mode: "dark",
    primary: { main: "#ff4b2b" },
    secondary: { main: "#ff416c" },
    background: {
      default: "#0f0f0f",
      paper: "#181818",
    },
  },
  light: {
    mode: "light",
    primary: { main: "#ff4b2b" },
    secondary: { main: "#ff416c" },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
};

export const buildAppTheme = (mode = "dark") =>
  createTheme({
    palette: palettes[mode] ?? palettes.dark,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 500 },
    },
  });
