import React, {useState} from "react";
import { LeaderboardForm } from "../components/LeaderboardForm";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Leaderboard } from "../hooks/useLeaderboard";
import { DrawerLayout } from "@/shared/components/DrawerLayout";
import { useConfirm } from "@/shared/providers/ConfirmProvider";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const LeaderboardEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const { leaderboardId } = searchParams;
  const { getById, update } = useLeaderboard();
  const { data: row, isLoading, isError } = getById(leaderboardId);

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

  const handleUpdate = (data: Leaderboard) => {
    if (!row) return;
    update.mutate(
      { ...row, ...data },
      {
        onSuccess: () => {
          notify(`${data.title ?? row.title} updated successfully!`, "success");
          setIsDirty(false);
          handleClose();
        },
        onError: () => {
          notify("Failed to update leaderboard!", "error");
        },
      },
    );
  };

  return (
    <DrawerLayout
      open={!!leaderboardId}
      title="Edit Leaderboard"
      loading={isLoading || update.isLoading}
      error={isError || !row}
      onClose={handleClose}
    >
      {row && (
        <LeaderboardForm
          initialData={row}
          onSubmit={handleUpdate}
          isSubmitting={update.isLoading}
          onDirtyChange={setIsDirty}
        />
      )}
    </DrawerLayout>
  );
};

LeaderboardEditDrawer.requiredParams = {
  leaderboardId: true,
};
