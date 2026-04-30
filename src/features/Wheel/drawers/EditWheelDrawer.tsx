import React, { useState } from "react";
import { WheelForm } from "../components/WheelForm";
import { useWheelById, useUpdateWheel } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/providers/useNotification";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";
import type { WheelFormValues } from "../schema/wheel.schema";
import type { Wheel } from "../types/wheel.types";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const EditWheelDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { wheelId } = searchParams;

  const { data: row, isPending, isError } = useWheelById(wheelId);
  const updateWheel = useUpdateWheel();

  const [isDirty, setIsDirty] = useState(false);
  const { confirm } = useConfirm();

  const handleClose = async (force = false) => {
    if (isDirty && !force) {
      const ok = await confirm({
        title: "Unsaved Changes",
        description:
          "You have unsaved changes. Are you sure you want to leave?",
      });

      if (!ok) return;
    }

    afterOpenChange?.(false);
  };

  const handleSubmit = (data: WheelFormValues) => {
    if (!row || !wheelId) return;

    updateWheel.mutate({ ...data, id: wheelId } as Wheel, {
      onSuccess: () => {
        notify(`${data.name ?? row.name} updated successfully!`, "success");
        setIsDirty(false);
        handleClose(true);
      },
      onError: () => {
        notify("Failed to update wheel!", "error");
      },
    });
  };

  return (
    <DrawerLayout
      open={!!wheelId}
      title="Edit Wheel"
      loading={isPending || updateWheel.isPending}
      error={isError || !row}
      onClose={handleClose}
    >
      {row && (
        <WheelForm
          initialData={row}
          onSubmit={handleSubmit}
          isSubmitting={updateWheel.isPending || isPending}
          onDirtyChange={setIsDirty}
        />
      )}
    </DrawerLayout>
  );
};

EditWheelDrawer.requiredParams = {
  wheelId: true,
};
