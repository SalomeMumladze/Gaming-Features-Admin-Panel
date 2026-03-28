import React, { useState } from "react";
import { WheelForm } from "../components/WheelForm";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Wheel } from "../hooks/useWheelManagement";
import { DrawerLayout } from "@/shared/components/DrawerLayout";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateWheelDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { createWheel } = searchParams;
  const { create } = useWheelsManagement();
  const [loading, setLoading] = useState(false);

  const handleClose = () => afterOpenChange?.(false);

  const handleSubmit = (data: Wheel) => {
    setLoading(true);
    create.mutate(data, {
      onSuccess: () => {
        notify(`${data.name} created successfully!`, "success");
        handleClose();
        setLoading(false);
      },
      onError: () => {
        notify("Failed to create wheel!", "error");
        setLoading(false);
      },
    });
  };

  return (
    <DrawerLayout
      open={!!createWheel}
      title="Create Wheel"
      loading={loading}
      error={create.isError}
      onClose={handleClose}
    >
      <WheelForm onSubmit={handleSubmit} isSubmitting={loading} />
    </DrawerLayout>
  );
};

CreateWheelDrawer.requiredParams = {
  createWheel: true,
};
