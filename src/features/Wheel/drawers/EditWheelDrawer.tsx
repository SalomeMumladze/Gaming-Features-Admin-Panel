import React, { useState } from "react";
import { WheelForm } from "../components/WheelForm";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/providers/useNotification";
import type { Wheel } from "../hooks/useWheelManagement";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const EditWheelDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { wheelId } = searchParams;
  const { getWheel, updateWheel } = useWheelsManagement();
  const { data: row, isLoading, isError } = getWheel(wheelId);

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
    if (!row) return;

    updateWheel.mutate(
      { ...row, ...data },
      {
        onSuccess: () => {
          notify(`${data.name ?? row.name} updated successfully!`, "success");
          handleClose();
        },
        onError: () => {
          notify("Failed to update wheel!", "error");
        },
      },
    );
  };

  return (
    <DrawerLayout
      open={!!wheelId}
      title="Edit Wheel"
      loading={isLoading || updateWheel.isLoading}
      error={isError || !row}
      onClose={handleClose}
    >
      {row && (
        <WheelForm
          initialData={row}
          onSubmit={handleSubmit}
          isSubmitting={updateWheel.isLoading}
          onDirtyChange={setIsDirty}
        />
      )}
    </DrawerLayout>
  );
};

EditWheelDrawer.requiredParams = {
  wheelId: true,
};
