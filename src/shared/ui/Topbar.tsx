import React from "react";
import {
  AppBar,
  Breadcrumbs,
  Toolbar,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import { Brightness7, Brightness4, Menu } from "@mui/icons-material";
import { useTheme } from "@/shared/hooks/useTheme";
import { useLocation, Link as RouterLink } from "react-router-dom";

interface TopbarProps {
  isMobile: boolean;
  toggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ isMobile, toggleSidebar }) => {
  const { mode, toggleMode } = useTheme();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <AppBar color="transparent" position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={toggleSidebar}>
            <Menu />
          </IconButton>
        )}

        <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 1 }}>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return isLast ? (
              <Typography key={to}>{value}</Typography>
            ) : (
              <Link key={to} component={RouterLink} to={to}>
                {value}
              </Link>
            );
          })}
        </Breadcrumbs>

        <IconButton color="inherit" onClick={toggleMode}>
          {mode === "light" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
