import React from "react";
import {
  Drawer,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LeaderboardForm } from "../components/LeaderboardForm";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Leaderboard } from "../hooks/useLeaderboard";
import { DrawerLayout } from "@/shared/components/DrawerLayout";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateLeaderboardDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();

  const handleClose = () => {
    afterOpenChange?.(false);
  };

  const { createLeaderboard } = searchParams;
  const { create } = useLeaderboard();

  const handleSubmit = (data: Leaderboard) => {
    create.mutate(data, {
      onSuccess: () => {
        const title = data.title;
        notify(`${title} created successfully!`, "success");
        handleClose();
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
      loading={create.isLoading}
      error={create.isError}
      onClose={handleClose}
    >
      <LeaderboardForm
        onSubmit={handleSubmit}
        isSubmitting={create.isLoading}
      />
    </DrawerLayout>
  );
};

CreateLeaderboardDrawer.requiredParams = {
  createLeaderboard: true,
};
