import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as MuiProvider, CssBaseline } from "@mui/material";
import { useThemeMode } from "./mode";
import { getMuiTheme } from "./muiTheme";

interface Props {
  children: ReactNode;
}

const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: Props) => {
  const { mode, toggleMode } = useThemeMode();

  const muiTheme = getMuiTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiProvider>
    </ThemeContext.Provider>
  );
};
