import React, { useState } from "react";
import { Drawer, Card, CardHeader, CardContent } from "@mui/material";
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
      <WheelForm onSubmit={handleSubmit} isSubmitting={create.isLoading} />
    </Drawer>
  );
};

CreateWheelDrawer.requiredParams = {
  createWheel: true,
};
