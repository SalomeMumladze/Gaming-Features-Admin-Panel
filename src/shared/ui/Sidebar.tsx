import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  Casino,
  SportsEsports,
  ArrowForwardIos,
  ArrowBackIos,
} from "@mui/icons-material";
import { SIDEBAR_WIDTH, COLLAPSED_WIDTH } from "@/shared/utils/const";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  variant: "permanent" | "temporary";
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  toggleSidebar,
  variant,
}) => {
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const items = [
    { text: "Leaderboards", icon: <Dashboard />, path: "/leaderboards" },
    { text: "Raffles", icon: <Casino />, path: "/raffles" },
    { text: "Wheels", icon: <SportsEsports />, path: "/wheels" },
  ];

  return (
    <Drawer
      variant={variant}
      open={isMobile ? open : true}
      onClose={toggleSidebar}
      PaperProps={{
        sx: {
          width: {
            xs: open ? SIDEBAR_WIDTH : 0,
            sm: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
          },
          overflowX: "hidden",
          whiteSpace: "nowrap",
          transition: "width 0.3s ease",
          boxSizing: "border-box",
        },
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <List>
          {items.map((item) => {
            const active = location.pathname.startsWith(item.path);

            const content = (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  justifyContent: open ? "initial" : "center",
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    color: active ? "primary.main" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
              </ListItemButton>
            );

            return open ? (
              content
            ) : (
              <Tooltip key={item.text} title={item.text} placement="right">
                {content}
              </Tooltip>
            );
          })}
        </List>
        <div className="border-t  border-solid  ">
          <ListItemButton
            onClick={toggleSidebar}
            sx={{
              justifyContent: open ? "initial" : "center",
              px: 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : "auto",
                justifyContent: "center",
              }}
              className="py-2"
            >
              {open ? (
                <div className="flex items-center text-xs">
                  <ArrowBackIos sx={{ fontSize: 16 }} />
                  Minimize
                </div>
              ) : (
                <Tooltip title="Expand Menu" placement="right">
                  <ArrowForwardIos sx={{ fontSize: 16 }} />
                </Tooltip>
              )}
            </ListItemIcon>
          </ListItemButton>
        </div>
      </div>
    </Drawer>
  );
};
