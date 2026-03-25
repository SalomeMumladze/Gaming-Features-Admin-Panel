import React from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  Casino,
  SportsEsports,
  ArrowForwardIos,
  ArrowBackIos,
} from "@mui/icons-material";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  const location = useLocation();
  const items = [
    { text: "Leaderboards", icon: <Dashboard />, path: "/leaderboards" },
    { text: "Raffles", icon: <Casino />, path: "/raffles" },
    { text: "Wheels", icon: <SportsEsports />, path: "/wheels" },
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      <List>
        {items.map((i) => {
          const active = location.pathname.startsWith(i.path);
          return (
            <ListItemButton
              key={i.text}
              component={Link}
              to={i.path}
              selected={active}
              sx={{ justifyContent: open ? "initial" : "center", px: 2 }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                {i.icon}
              </ListItemIcon>
              <ListItemText
                primary={i.text}
                sx={{ opacity: open ? 1 : 0, transition: "0.3s" }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <div className="border-t  border-solid border-color-red  ">
        <ListItemButton
          sx={{ justifyContent: open ? "initial" : "center", px: 2 }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : "auto",
              justifyContent: "center",
            }}
            className="py-2"
            onClick={toggleSidebar}
          >
            {open ? (
              <div className="flex items-center text-xs justify-center">
                <ArrowBackIos sx={{ fontSize: 16 }} /> Minimize Menu
              </div>
            ) : (
              <ArrowForwardIos
                sx={{ fontSize: 16 }}
                className="flex w-full items-center justify-center"
              />
            )}
          </ListItemIcon>
        </ListItemButton>
      </div>
    </div>
  );
};
