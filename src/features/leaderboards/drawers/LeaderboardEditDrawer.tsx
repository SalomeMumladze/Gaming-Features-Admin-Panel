import React, { useState } from "react";
import { LeaderboardForm } from "@/features/leaderboards/components/LeaderboardForm";
import {
  useLeaderboardById,
  useUpdateLeaderboard,
} from "../hooks/useLeaderboard";
import { useNotification } from "@/shared/providers/useNotification";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";
import type { LeaderboardFormValues } from "@/features/leaderboards/schemas/leaderboard.schema";
import type { Leaderboard } from "@/features/leaderboards/types/leaderboard.types";

interface EditLeaderboardSearchParams {
  leaderboardId?: string;
}

interface Props {
  searchParams: EditLeaderboardSearchParams;
  afterOpenChange?: (open: boolean) => void;
}

export const LeaderboardEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { leaderboardId } = searchParams;

  const { data: row, isPending, isError } = useLeaderboardById(leaderboardId);

  const update = useUpdateLeaderboard();

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

  const handleUpdate = (data: LeaderboardFormValues) => {
    update.mutate({ id: leaderboardId, ...data } as Leaderboard, {
      onSuccess: () => {
        notify(`${data.title} updated successfully!`, "success");
        setIsDirty(false);
        handleClose(true);
      },
      onError: (error: any) => {
        notify(
          error?.response?.data?.message || "Failed to update leaderboard!",
          "error",
        );
      },
    });
  };

  return (
    <DrawerLayout
      open={leaderboardId === "true" ? false : !!leaderboardId}
      title="Edit Leaderboard"
      loading={isPending || update.isPending}
      error={isError || (!isPending && !row)}
      onClose={handleClose}
    >
      {row && (
        <LeaderboardForm
          initialData={row}
          onSubmit={handleUpdate}
          isSubmitting={update.isPending}
          onDirtyChange={setIsDirty}
        />
      )}
    </DrawerLayout>
  );
};

LeaderboardEditDrawer.requiredParams = {
  leaderboardId: true,
};
