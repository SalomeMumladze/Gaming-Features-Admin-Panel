import React from "react";
import {
  Drawer,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Alert,
} from "@mui/material";
import { LeaderboardForm } from "../components/LeaderboardForm";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { ErrorOutline } from "@mui/icons-material";
import { useNotification } from "@/shared/hooks/useNotification";
import type { Leaderboard } from "../hooks/useLeaderboard";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const LeaderboardEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();

  const { getById, update } = useLeaderboard();
  const id = searchParams.leaderboardId;

  const { data: row, isLoading, isError } = getById(id);

  const handleClose = () => {
    afterOpenChange?.(false);
  };

  const handleUpdate = (formData: Leaderboard) => {
    if (!row) return;
    update.mutate(
      { ...row, ...formData },
      {
        onSuccess: () => {
          const title = formData.title ?? row.title;
          notify(`${title} updated successfully!`, "success");
          handleClose();
        },
        onError: () => {
          notify("Failed to update leaderboard!", "error");
        },
      },
    );
  };

  return (
    <Drawer open={!!id} onClose={handleClose} anchor="right">
      <Card
        sx={{
          width: "100%",
          boxShadow: 0,
          borderRadius: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          title="Edit Leaderboard"
          sx={{
            borderRadius: 0,
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          }}
        />

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
            paddingBottom: 2,
          }}
        >
          {isLoading && (
            <Stack direction="column" alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography>Loading leaderboard...</Typography>
            </Stack>
          )}

          {isError && !isLoading && (
            <Stack direction="column" alignItems="center" spacing={2}>
              <Alert
                severity="error"
                variant="outlined"
                icon={<ErrorOutline />}
              >
                Failed to load leaderboard.
              </Alert>
            </Stack>
          )}

          {!isLoading && !isError && row && (
            <LeaderboardForm
              initialData={row}
              onSubmit={handleUpdate}
              isSubmitting={update.isLoading}
            />
          )}
        </CardContent>
      </Card>
    </Drawer>
  );
};

LeaderboardEditDrawer.requiredParams = {
  leaderboardId: true,
};
