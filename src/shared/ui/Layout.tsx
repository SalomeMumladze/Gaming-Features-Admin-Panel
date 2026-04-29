import React, { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UrlContextProvider } from "@/shared/providers/useQueryParams";
import {
  SIDEBAR_WIDTH,
  COLLAPSED_WIDTH,
  TOPBAR_HEIGHT,
} from "@/shared/utils/const";
import Drawers from "./Drawers";

export const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(() => !isMobile);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <UrlContextProvider>
      <Sidebar
        open={open}
        toggleSidebar={toggleSidebar}
        variant={isMobile ? "temporary" : "permanent"}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          ml: {
            xs: 0,
            sm: open ? `${SIDEBAR_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
          },
          transition: "margin-left 0.3s ease",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: {
              xs: 0,
              sm: open ? `${SIDEBAR_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
            },
            right: 0,
            height: `${TOPBAR_HEIGHT}px`,
            zIndex: (theme) => theme.zIndex.appBar,
            transition: "left 0.3s ease",
          }}
        >
          <Topbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            mt: `${TOPBAR_HEIGHT}px`,
            overflowY: "auto",
          }}
          p={3}
        >
          <Outlet />
        </Box>
      </Box>

      <Drawers />
    </UrlContextProvider>
  );
};
