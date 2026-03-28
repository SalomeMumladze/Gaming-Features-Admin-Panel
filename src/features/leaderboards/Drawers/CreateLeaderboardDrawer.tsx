import React, { useState } from "react";
import { Drawer, Card, CardHeader, CardContent } from "@mui/material";
import { LeaderboardForm } from "../components/LeaderboardForm";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Leaderboard } from "../hooks/useLeaderboard";

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
    <Drawer open={!!createLeaderboard} onClose={handleClose} anchor="right">
      <Card
        sx={{
          maxWidth: 800,
          width: "100%",
          boxShadow: 0,
          borderRadius: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title={"Create Leaderboard"}
          sx={{
            borderRadius: 0,
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          }}
        />

        <CardContent
          sx={{
            flex: 1,
            overflowY: "auto",
            paddingBottom: 2,
          }}
        >
          <LeaderboardForm
            onSubmit={handleSubmit}
            isSubmitting={create.isLoading}
          />
        </CardContent>
      </Card>
    </Drawer>
  );
};

CreateLeaderboardDrawer.requiredParams = {
  createLeaderboard: true,
};
