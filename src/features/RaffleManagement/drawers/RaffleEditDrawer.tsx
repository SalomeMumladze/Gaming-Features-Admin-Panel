import React, { useState } from "react";
import { RaffleForm } from "../components/RaffleForm";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/providers/useNotification";
import type { Raffle } from "../hooks/useRaffleManagement";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const RaffleEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);

  const { raffleId } = searchParams;
  const { getRaffle, updateRaffle } = useRaffleManagement();
  const { data: row, isLoading, isError } = getRaffle(raffleId);

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
    if (!row) return;
    setLoading(true);
    updateRaffle.mutate(
      { ...row, ...data },
      {
        onSuccess: () => {
          notify(`${data.name ?? row.name} updated successfully!`, "success");
          handleClose();
          setLoading(false);
        },
        onError: (err) => {
          notify(err?.message || `Failed to update raffle!`, "error");
          setLoading(false);
        },
      },
    );
  };

  return (
    <DrawerLayout
      open={!!raffleId}
      title="Edit Raffle"
      loading={isLoading || loading}
      error={isError || !row}
      onClose={handleClose}
    >
      {row && (
        <RaffleForm
          initialData={row}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          onDirtyChange={setIsDirty}
        />
      )}
    </DrawerLayout>
  );
};

RaffleEditDrawer.requiredParams = {
  raffleId: true,
};
