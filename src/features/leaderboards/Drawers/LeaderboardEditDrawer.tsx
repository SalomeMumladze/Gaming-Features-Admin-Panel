import React, { useState, useEffect } from "react";
import { Drawer, Typography, Button, Box } from "@mui/material";

interface Props {
  searchParams: Record<string, string>;
  destroyOnClose?: boolean;
  afterOpenChange?: (open: boolean) => void;
}

export const LeaderboardEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const id = searchParams.leaderboardId;
  const [open, setOpen] = useState(Boolean(id));
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setOpen(Boolean(id));
  }, [id]);

  const handleClose = () => {
    setOpen(false);
    afterOpenChange?.(false);
  };

  const handleSave = () => {
    setSuccess(true);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      transitionDuration={300}
    >
      <Box
        sx={{
          width: 400,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          opacity: open ? 1 : 0,
          transform: open ? "translateX(0)" : "translateX(20px)",
          transition: "all 0.3s ease",
        }}
      >
        <Typography variant="h6">Edit Leaderboard</Typography>
        <Typography>ID: {id}</Typography>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        {success && (
          <Typography color="success.main" mt={2}>
            Saved Successfully!
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};
LeaderboardEditDrawer.requiredParams = {
  leaderboardId: true,
};
