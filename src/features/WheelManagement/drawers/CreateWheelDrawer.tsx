import React, { useState } from "react";
import { WheelForm } from "../components/WheelForm";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Wheel } from "../hooks/useWheelManagement";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";

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

  const [isDirty, setIsDirty] = useState(false);
  const { confirm } = useConfirm();

  const handleClose = async () => {
    if (isDirty) {
      const ok = await confirm({
        title: "Unsaved Changes",
        description:
          "You have unsaved changes. Are you sure you want to leave?",
      });

      if (!ok) return;
    }

    afterOpenChange?.(false);
  };

  const handleSubmit = (data: Wheel) => {
    create.mutate(data, {
      onSuccess: () => {
        notify(`${data.name} created successfully!`, "success");
        handleClose();
      },
      onError: () => {
        notify("Failed to create wheel!", "error");
      },
    });
  };

  return (
    <DrawerLayout
      open={!!createWheel}
      title="Create Wheel"
      loading={create.isLoading}
      error={create.isError}
      onClose={handleClose}
    >
      <WheelForm
        onSubmit={handleSubmit}
        isSubmitting={create.isLoading}
        onDirtyChange={setIsDirty}
      />
    </DrawerLayout>
  );
};

CreateWheelDrawer.requiredParams = {
  createWheel: true,
};
