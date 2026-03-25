import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const Layout: React.FC = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1}>
        <Topbar />
        <Box p={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
