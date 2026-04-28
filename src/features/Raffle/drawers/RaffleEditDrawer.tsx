import React, { useState } from "react";
import { RaffleForm } from "../components/RaffleForm";
import { useRaffleById, useUpdateRaffle } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/providers/useNotification";
import type { Raffle } from "../types/raffle.types";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";
import type { RaffleFormValues } from "../schema/raffle.schema";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const RaffleEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();

  const { raffleId } = searchParams;

  const { data, isPending, isError } = useRaffleById(raffleId);
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

  const handleSubmit = (raffle: RaffleFormValues) => {
    updateRaffle.mutate({ id: raffleId, ...raffle } as Raffle, {
      onSuccess: () => {
        notify(
          `${raffle.name ?? raffle.name} updated successfully!`,
          "success",
        );
        setIsDirty(false);
        handleClose(true);
      },
      onError: (err) => {
        notify(err?.message || `Failed to update raffle!`, "error");
      },
    });
  };

  return (
    <DrawerLayout
      open={!!raffleId}
      title="Edit Raffle"
      loading={isPending}
      error={isError || !data}
      onClose={handleClose}
    >
      {!isPending && data && (
        <RaffleForm
          initialData={data}
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
