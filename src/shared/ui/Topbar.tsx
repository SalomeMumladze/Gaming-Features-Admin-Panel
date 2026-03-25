import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export const Topbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          GamifyHub Admin
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
