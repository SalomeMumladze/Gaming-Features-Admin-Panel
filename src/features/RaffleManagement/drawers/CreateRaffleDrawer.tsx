import React, { useState } from "react";
import { RaffleForm } from "../components/RaffleForm";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Raffle } from "../hooks/useRaffleManagement";
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
  const [loading, setLoading] = useState(false);
  const { createRaffle } = searchParams;
  const { create } = useRaffleManagement();

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

  const handleSubmit = (data: Raffle) => {
    setLoading(true);
    create.mutate(data, {
      onSuccess: () => {
        notify(`${data.name} created successfully!`, "success");
        handleClose();
        setLoading(false);
      },
      onError: () => {
        notify("Failed to create raffle!", "error");
        setLoading(false);
      },
    });
  };

  return (
    <DrawerLayout
      open={!!createRaffle}
      title="Create Raffle"
      loading={loading}
      error={create.isError}
      onClose={handleClose}
    >
      <RaffleForm
        onSubmit={handleSubmit}
        isSubmitting={loading}
        onDirtyChange={setIsDirty}
      />
    </DrawerLayout>
  );
};

CreateRaffleDrawer.requiredParams = {
  createRaffle: true,
};
