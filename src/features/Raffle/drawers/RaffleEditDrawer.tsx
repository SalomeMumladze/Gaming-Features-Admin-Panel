import React, { useState } from "react";
import { RaffleForm } from "../components/RaffleForm";
import { useRaffleById, useUpdateRaffle } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/providers/useNotification";
import type { Raffle } from "../types/raffle.types";
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

  const { raffleId } = searchParams;

  const { data: row, isPending, isError } = useRaffleById(raffleId);
  const updateRaffle = useUpdateRaffle();

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

  const handleSubmit = (data: Raffle) => {
    if (!row) return;

    updateRaffle.mutate(
      { ...row, ...data },
      {
        onSuccess: () => {
          notify(`${data.name ?? row.name} updated successfully!`, "success");
          setIsDirty(false);
          handleClose(true);
        },
        onError: (err) => {
          notify(err?.message || `Failed to update raffle!`, "error");
        },
      },
    );
  };

  return (
    <DrawerLayout
      open={!!raffleId}
      title="Edit Raffle"
      loading={isPending}
      error={isError || !row}
      onClose={handleClose}
    >
      {!isPending && row && (
        <RaffleForm
          initialData={row}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          onDirtyChange={setIsDirty}
        />
      )}
    </DrawerLayout>
  );
};

RaffleEditDrawer.requiredParams = {
  raffleId: true,
};
