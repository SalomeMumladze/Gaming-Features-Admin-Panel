import React, { useState } from "react";
import {
  Drawer,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Stack,
  Alert,
  Typography,
} from "@mui/material";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import { RaffleForm } from "../components/RaffleForm";
import type { Raffle } from "../hooks/useRaffleManagement";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateRaffleDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    afterOpenChange?.(false);
    setError(false);
  };

  const { createRaffle } = searchParams;
  const { create } = useRaffleManagement();

  const handleSubmit = (data: Raffle) => {
    setLoading(true);
    setError(false);

    create.mutate(data, {
      onSuccess: () => {
        const title = data.name;
        notify(`${title} created successfully!`, "success");
        handleClose();
        setLoading(false);
      },
      onError: () => {
        notify("Failed to create raffle!", "error");
        setError(true);
        setLoading(false);
      },
    });
  };

  return (
    <Drawer open={!!createRaffle} onClose={handleClose} anchor="right">
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
          title="Create Raffle"
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
            justifyContent: loading || error ? "center" : "flex-start",
            alignItems: "center",
            paddingBottom: 2,
          }}
        >
          {loading && (
            <Stack direction="column" alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography>Creating raffle...</Typography>
            </Stack>
          )}

          {error && !loading && (
            <Alert severity="error" variant="outlined">
              Something went wrong while creating the raffle.
            </Alert>
          )}

          {!loading && !error && (
            <RaffleForm onSubmit={handleSubmit} isSubmitting={loading} />
          )}
        </CardContent>
      </Card>
    </Drawer>
  );
};

CreateRaffleDrawer.requiredParams = {
  createRaffle: true,
};
