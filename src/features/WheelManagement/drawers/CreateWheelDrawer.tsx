import React from "react";
import {
  Drawer,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import { WheelForm } from "../components/WheelForm";
import type { Wheel } from "../hooks/useWheelManagement";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateWheelDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();

  const handleClose = () => {
    afterOpenChange?.(false);
  };

  const { createWheel } = searchParams;
  const { create } = useWheelsManagement();

  const handleSubmit = (data: Wheel) => {
    create.mutate(data, {
      onSuccess: () => {
        const title = data.name;
        notify(`${title} created successfully!`, "success");
        handleClose();
      },
      onError: () => {
        notify("Failed to create raffle!", "error");
      },
    });
  };

  return (
    <Drawer open={!!createWheel} onClose={handleClose} anchor="right">
      <Box p={2} width="100%" margin="auto">
        {create.isLoading && (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Loading...
            </Typography>
          </Stack>
        )}
        {create.error && !create.isLoading && (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Alert severity="error">Failed to load leaderboard.</Alert>
          </Stack>
        )}
        <WheelForm onSubmit={handleSubmit} isSubmitting={create.isLoading} />
      </Box>
    </Drawer>
  );
};

CreateWheelDrawer.requiredParams = {
  createWheel: true,
};
