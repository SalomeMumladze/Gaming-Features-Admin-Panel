import { createTheme } from "@mui/material";
import { lightTheme, darkTheme } from "./tokens";
import type { Mode } from "./mode";

export const getMuiTheme = (mode: Mode) => {
  const color = mode === "light" ? lightTheme : darkTheme;

  return createTheme({
    palette: {
      mode,
      background: {
        default: color.bg,
        paper: color.surface,
      },
      text: {
        primary: color.text,
      },
      warning: { main: color.warning },
      primary: { main: color.primary },
      info: { main: color.info },
      error: { main: color.danger },
      success: { main: color.success },
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: color.bg,
            color: color.text,
            fontSize: "12px",
          },
          arrow: {
            color: "#000",
          },
        },
      },
    },
  });
};
