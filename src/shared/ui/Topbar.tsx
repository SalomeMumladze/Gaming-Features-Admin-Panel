import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import { useTheme } from "@/shared/hooks/useTheme";

export const Topbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin
        </Typography>
        <IconButton color="inherit" onClick={toggleMode}>
          {mode === "light" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
