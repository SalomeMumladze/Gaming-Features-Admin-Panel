import React, { useState } from "react";
import {
  Drawer,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import { RaffleForm } from "../components/RaffleForm";
import type { Raffle } from "../hooks/useRaffleManagement";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const RaffleEditDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    afterOpenChange?.(false);
    setError(false);
  };

  const { raffleId } = searchParams;
  const { getRaffle, updateRaffle } = useRaffleManagement();
  const { data: row, isLoading, isError } = getRaffle(raffleId);

  const handleSubmit = (formData: Raffle) => {
    if (raffleId) {
      setLoading(true);
      setError(false);

      updateRaffle.mutate(
        { ...row, ...formData },
        {
          onSuccess: () => {
            const name = formData.name ?? row?.name;
            notify(`${name} updated successfully!`, "success");
            handleClose();
            setLoading(false);
          },
          onError: (err) => {
            notify(err?.message || `Failed to update raffle!`, "error");
            setError(true);
            setLoading(false);
          },
        },
      );
    }
  };

  return (
    <Drawer open={!!raffleId} onClose={handleClose} anchor="right">
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
          title="Edit Raffle"
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
            display: "flex",
            flexDirection: "column",
            justifyContent: isLoading || isError ? "center" : "flex-start",
            alignItems: "center",
            paddingBottom: 2,
          }}
        >
          {isLoading && (
            <Stack direction="column" alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography>Loading raffle...</Typography>
            </Stack>
          )}

          {isError && !isLoading && (
            <Alert severity="error" variant="outlined">
              Error loading raffle
            </Alert>
          )}

          {!isLoading && !isError && row && (
            <RaffleForm
              initialData={row}
              onSubmit={handleSubmit}
              isSubmitting={loading}
            />
          )}
        </CardContent>
      </Card>
    </Drawer>
  );
};

RaffleEditDrawer.requiredParams = {
  raffleId: true,
};
