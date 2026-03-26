import React from "react";
import {
  Drawer,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { LeaderboardForm } from "../components/LeaderboardForm";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { ErrorOutline } from "@mui/icons-material";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const LeaderboardEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { getById, update } = useLeaderboard();
  const id = searchParams.leaderboardId;

  const { data: row, isLoading, isError } = getById(id);
  const handleClose = () => {
    afterOpenChange?.(false);
  };

  if (isLoading) {
    return (
      <Drawer open={!!id} onClose={handleClose} anchor="right">
        <Box width={420} p={2}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Drawer>
    );
  }

  if (isError || !row) {
    return (
      <Drawer open={!!id} onClose={handleClose} anchor="right">
        <Box width={420} p={2}>
          <Typography variant="h6">Error loading leaderboard</Typography>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer open={!!id} onClose={handleClose} anchor="right">
      <Card
        sx={{ maxWidth: 800, width: "100%", boxShadow: 0, borderRadius: 0 }}
      >
        <CardHeader
          title={
            isLoading ? "Loading..." : isError ? "Error" : "Edit Leaderboard"
          }
          sx={{
            borderRadius: 0,
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          }}
        />
        <CardContent>
          {isLoading && (
            <Box className="flex items-center justify-center w-full m-auto my-6">
              <CircularProgress size={25} />
            </Box>
          )}
          {isError && (
            <Box className="flex items-center justify-center w-full m-auto my-6 gap-2">
              <ErrorOutline sx={{ fontSize: 20 }} color="error" />
              <Typography color="error">Something went wrong!</Typography>
            </Box>
          )}
          {row && (
            <LeaderboardForm
              initialData={row}
              onSubmit={(data) => {
                update.mutate({
                  ...row,
                  ...data,
                });
                handleClose();
              }}
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
