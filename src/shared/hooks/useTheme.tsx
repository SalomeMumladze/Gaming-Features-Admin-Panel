import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

const STORAGE_KEY = "admin-theme-mode";

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),

    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
