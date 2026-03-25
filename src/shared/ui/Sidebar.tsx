import React from "react";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export const Sidebar: React.FC = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItemButton component={Link} to="/leaderboards">
          <ListItemText primary="Leaderboards" />
        </ListItemButton>
        <ListItemButton component={Link} to="/raffles">
          <ListItemText primary="Raffles" />
        </ListItemButton>
        <ListItemButton component={Link} to="/wheels">
          <ListItemText primary="Wheels" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};
