import React, { useState } from "react";
import { Box, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const SIDEBAR_WIDTH = 180;
const COLLAPSED_WIDTH = 60;

export const Layout: React.FC = () => {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => setOpen(!open);

  return (
    <Box display="flex" minHeight="100vh">
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
      >
        <Topbar />
        <Box p={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
