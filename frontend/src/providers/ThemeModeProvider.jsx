import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { buildAppTheme } from "../theme";

const ThemeModeContext = createContext({ mode: "dark", toggleMode: () => {} });

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("hcstream-theme") : null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  useEffect(() => {
    window.localStorage.setItem("hcstream-theme", mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const theme = useMemo(() => buildAppTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
