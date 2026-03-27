import React, { useState } from "react";
import { Box, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UrlContextProvider } from "@/shared/hooks/useQueryParams";

const SIDEBAR_WIDTH = 180;
const COLLAPSED_WIDTH = 60;
const TOPBAR_HEIGHT = 64;

export const Layout: React.FC = () => {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => setOpen(!open);

  return (
    <UrlContextProvider>
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            width: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        <Sidebar open={open} toggleSidebar={toggleSidebar} />
      </Drawer>

      <Box
        flex={1}
        ml={open ? `${SIDEBAR_WIDTH}px` : `${COLLAPSED_WIDTH}px`}
        transition="margin-left 0.3s"
        display="flex"
        flexDirection="column"
        height="100vh"
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: open ? `${SIDEBAR_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
            right: 0,
            height: `${TOPBAR_HEIGHT}px`,
            zIndex: (theme) => theme.zIndex.appBar,
            transition: "left 0.3s",
          }}
        >
          <Topbar />
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
    </UrlContextProvider>
  );
};
