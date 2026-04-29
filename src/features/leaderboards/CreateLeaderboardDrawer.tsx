import React, { useState } from "react";
import { LeaderboardForm } from "@/features/leaderboards/components/LeaderboardForm";
import { useCreateLeaderboard } from "./hooks/useLeaderboard";
import { useNotification } from "@/shared/providers/useNotification";
import type { LeaderboardFormData } from "@/features/leaderboards/types/leaderboard.types";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";
import type { LeaderboardFormValues } from "@/features/leaderboards/schemas/leaderboard.schema";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateLeaderboardDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { createLeaderboard } = searchParams;

  const create = useCreateLeaderboard();

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

  const handleSubmit = (data: LeaderboardFormValues) => {
    create.mutate(data as LeaderboardFormData, {
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
    <DrawerLayout
      open={!!createLeaderboard}
      title="Create Leaderboard"
      loading={create.isPending}
      error={create.isError}
      onClose={handleClose}
    >
      <LeaderboardForm
        onSubmit={handleSubmit}
        isSubmitting={create.isPending}
        onDirtyChange={setIsDirty}
      />
    </DrawerLayout>
  );
};

CreateLeaderboardDrawer.requiredParams = {
  createLeaderboard: true,
};
