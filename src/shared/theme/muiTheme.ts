import { createTheme } from "@mui/material";
import { lightTheme, darkTheme } from "./tokens";
import type { Mode } from "./mode";

export const getMuiTheme = (mode: Mode) => {
  const color = mode === "light" ? lightTheme : darkTheme;

  return createTheme({
    palette: {
      mode,
      primary: { main: color.primary },
      background: {
        default: color.bg,
        paper: color.surface,
      },
      text: {
        primary: color.text,
      },
      error: { main: color.danger },
      success: { main: color.success },
    },
  });
};