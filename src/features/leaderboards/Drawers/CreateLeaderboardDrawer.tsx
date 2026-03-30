import React, { useState } from "react";
import { LeaderboardForm } from "../components/LeaderboardForm";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useNotification } from "@/shared/providers/useNotification";
import type { Leaderboard } from "../hooks/useLeaderboard";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateLeaderboardDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { createLeaderboard } = searchParams;
  const { create } = useLeaderboard();

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

  const handleSubmit = (data: Leaderboard) => {
    create.mutate(data, {
      onSuccess: () => {
        notify(`${data.title} created successfully!`, "success");
        setIsDirty(false);
        afterOpenChange?.(false);
      },
      onError: () => {
        notify("Failed to create leaderboard!", "error");
      },
    });
  };

  return (
    <>
      <DrawerLayout
        open={!!createLeaderboard}
        title="Create Leaderboard"
        loading={create.isLoading}
        error={create.isError}
        onClose={handleClose}
      >
        <LeaderboardForm
          onSubmit={handleSubmit}
          isSubmitting={create.isLoading}
          onDirtyChange={setIsDirty}
        />
      </DrawerLayout>
    </>
  );
};

CreateLeaderboardDrawer.requiredParams = {
  createLeaderboard: true,
};
