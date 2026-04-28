import React, { useState } from "react";
import { RaffleForm } from "../components/RaffleForm";
import { useCreateRaffle } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/providers/useNotification";
import type { RaffleFormData } from "../types/raffle.types";
import type { RaffleFormValues } from "../schema/raffle.schema";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateRaffleDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { createRaffle } = searchParams;
  const create = useCreateRaffle();

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

  const handleSubmit = (data: RaffleFormValues) => {
    create.mutate(data as RaffleFormData, {
      onSuccess: () => {
        notify(`${data.name} created successfully!`, "success");
        handleClose();
      },
      onError: () => {
        notify("Failed to create raffle!", "error");
      },
    });
  };

  return (
    <DrawerLayout
      open={!!createRaffle}
      title="Create Raffle"
      error={create.isError}
      onClose={handleClose}
    >
      <RaffleForm onSubmit={handleSubmit} onDirtyChange={setIsDirty} />
    </DrawerLayout>
  );
};

CreateRaffleDrawer.requiredParams = {
  createRaffle: true,
};
