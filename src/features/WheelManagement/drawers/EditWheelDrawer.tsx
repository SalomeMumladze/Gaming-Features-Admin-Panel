import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import { WheelForm } from "../components/WheelForm";

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

  const handleSubmit = (data: any) => {
    updateWheel.mutate(
      { ...row, ...data },
      {
        onSuccess: () => {
          const title = data.name ?? row.name;
          notify(`${title} updated successfully!`, "success");
          handleClose();
        },
        onError: () => {
          notify("Failed to update leaderboard!", "error");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Drawer open={!!wheelId} onClose={handleClose} anchor="right">
        <Box width={420} p={2}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Drawer>
    );
  }

  if (isError || !row) {
    return (
      <Drawer open={!!wheelId} onClose={handleClose} anchor="right">
        <Box width={420} p={2}>
          <Typography variant="h6">Error loading leaderboard</Typography>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer open={!!wheelId} onClose={handleClose} anchor="right">
      <WheelForm
        onSubmit={handleSubmit}
        initialData={row}
        isSubmitting={updateWheel.isLoading}
      />
    </Drawer>
  );
};

EditWheelDrawer.requiredParams = {
  wheelId: true,
};
