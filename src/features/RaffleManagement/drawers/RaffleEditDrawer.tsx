import React from "react";
import {
  Drawer,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import { RaffleForm } from "../components/RaffleForm";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const RaffleEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();

  const handleClose = () => {
    afterOpenChange?.(false);
  };

  const { raffleId } = searchParams;
  const { getRaffle, updateRaffle } = useRaffleManagement();

  const { data: row, isLoading, isError } = getRaffle(raffleId);

  const handleSubmit = (formData: any) => {
    if (raffleId) {
      updateRaffle.mutate(
        { ...row, ...formData },
        {
          onSuccess: () => {
            const name = formData.name ?? row.name;
            notify(`${name} updated successfully!`, "success");
            handleClose();
          },
          onError: (err) => {
            notify(err?.message || `Failed to update leaderboard!`, "error");
          },
        },
      );
    }
  };

  return (
    <Drawer open={!!raffleId} onClose={handleClose} anchor="right">
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
          title={raffleId ? "Edit Raffle" : "Create Raffle"}
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
          {isLoading && (
            <Box p={2}>
              <Typography variant="h6">Loading...</Typography>
            </Box>
          )}

          {isError && (
            <Box p={2}>
              <Typography variant="h6" color="error">
                Error loading raffle
              </Typography>
            </Box>
          )}

          {!isLoading && !isError && row && (
            <RaffleForm initialData={row} onSubmit={handleSubmit} />
          )}
        </CardContent>
      </Card>
    </Drawer>
  );
};

RaffleEditDrawer.requiredParams = {
  raffleId: true,
};
