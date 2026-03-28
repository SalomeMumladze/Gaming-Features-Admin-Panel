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

export const EditWheelDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();

  const handleClose = () => {
    afterOpenChange?.(false);
  };

  const { wheelId } = searchParams;
  const { getWheel, updateWheel } = useWheelsManagement();
  const { data: row, isLoading, isError } = getWheel(wheelId);

  const handleSubmit = (data: Wheel) => {
    updateWheel.mutate(
      { ...row, ...data },
      {
        onSuccess: () => {
          const title = data.name ?? row?.name;
          notify(`${title} updated successfully!`, "success");
          handleClose();
        },
        onError: () => {
          notify("Failed to update leaderboard!", "error");
        },
      },
    );
  };

  return (
    <Drawer open={!!wheelId} onClose={handleClose} anchor="right">
      <Box p={2} width="100%" margin="auto">
        {isLoading && (
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
        {isError && !isLoading && (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Alert severity="error">Failed to load leaderboard.</Alert>
          </Stack>
        )}
        {!isLoading && !isError && row && (
          <WheelForm
            onSubmit={handleSubmit}
            initialData={row}
            isSubmitting={updateWheel.isLoading}
          />
        )}
      </Box>
    </Drawer>
  );
};

EditWheelDrawer.requiredParams = {
  wheelId: true,
};
