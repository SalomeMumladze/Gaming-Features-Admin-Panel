import React, { useState } from "react";
import { WheelForm } from "../components/WheelForm";
import { useWheelsManagement } from "../hooks/useWheelManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Wheel } from "../hooks/useWheelManagement";
import { DrawerLayout } from "@/shared/components/DrawerLayout";

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
  const [loading, setLoading] = useState(false);

  const handleClose = () => afterOpenChange?.(false);

  const handleSubmit = (data: Wheel) => {
    if (!row) return;
    setLoading(true);
    updateWheel.mutate(
      { ...row, ...data },
      {
        onSuccess: () => {
          notify(`${data.name ?? row.name} updated successfully!`, "success");
          handleClose();
          setLoading(false);
        },
        onError: () => {
          notify("Failed to update wheel!", "error");
          setLoading(false);
        },
      },
    );
  };

  return (
    <DrawerLayout
      open={!!wheelId}
      title="Edit Wheel"
      loading={isLoading || loading}
      error={isError || !row}
      onClose={handleClose}
    >
      {row && (
        <WheelForm
          initialData={row}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      )}
    </DrawerLayout>
  );
};

EditWheelDrawer.requiredParams = {
  wheelId: true,
};
