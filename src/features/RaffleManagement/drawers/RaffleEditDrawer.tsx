import React, { useState } from "react";
import { RaffleForm } from "../components/RaffleForm";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Raffle } from "../hooks/useRaffleManagement";
import { DrawerLayout } from "@/shared/components/DrawerLayout";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const EditRaffleDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);

  const { raffleId } = searchParams;
  const { getRaffle, updateRaffle } = useRaffleManagement();
  const { data: row, isLoading, isError } = getRaffle(raffleId);

  const handleClose = () => afterOpenChange?.(false);

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
        />
      )}
    </DrawerLayout>
  );
};

EditRaffleDrawer.requiredParams = {
  raffleId: true,
};
