import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import { useTheme } from "@/shared/hooks/useTheme";

export const Topbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Admin</Typography>
        <IconButton color="inherit" onClick={toggleMode}>
          {mode === "light" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
