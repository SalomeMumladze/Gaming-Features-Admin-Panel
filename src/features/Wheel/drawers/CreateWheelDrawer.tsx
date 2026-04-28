import React, { useState } from "react";
import { WheelForm } from "../components/WheelForm";
import { useCreateWheel } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/providers/useNotification";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";
import type { WheelFormValues } from "../schema/wheel.schema";
import type { WheelFormData } from "../types/wheel.types";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateWheelDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { createWheel } = searchParams;
  const create = useCreateWheel();

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

  const handleSubmit = (data: WheelFormValues) => {
    const payload: WheelFormData = {
      ...data,
      segments: data.segments.map((seg) => ({
        id: crypto.randomUUID(),
        label: seg.label,
        weight: seg.weight,
        color: seg.color,
        prizeType: "nothing",
        prizeAmount: 0,
        imageUrl: "",
      })),
    };

    create.mutate(payload, {
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
      loading={create.isPending}
      error={create.isError}
      onClose={handleClose}
    >
      <WheelForm
        onSubmit={handleSubmit}
        isSubmitting={create.isPending}
        onDirtyChange={setIsDirty}
      />
    </DrawerLayout>
  );
};

CreateWheelDrawer.requiredParams = {
  createWheel: true,
};
