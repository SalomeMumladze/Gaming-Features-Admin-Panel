import React from "react";
import { Drawer, Card, CardHeader, CardContent } from "@mui/material";
import { useRaffleManagement } from "../hooks/useRaffleManagement";
import { useNotification } from "@/shared/hooks/useNotification";
import { RaffleForm } from "../components/RaffleForm";

interface Props {
  searchParams: Record<string, string>;
  afterOpenChange?: (open: boolean) => void;
}

export const CreateRaffleDrawer: React.FC<Props> & {
  requiredParams: Record<string, boolean>;
} = ({ searchParams, afterOpenChange }) => {
  const { notify } = useNotification();

  const handleClose = () => {
    afterOpenChange?.(false);
  };

  const { createRaffle } = searchParams;
  const { create } = useRaffleManagement();

  const handleSubmit = (data: any) => {
    console.log(data);
    create.mutate(data, {
      onSuccess: () => {
        const title = data.title;
        notify(`${title} created successfully!`, "success");
        handleClose();
      },
      onError: () => {
        notify("Failed to create raffle!", "error");
      },
    });
  };

  return (
    <Drawer open={!!createRaffle} onClose={handleClose} anchor="right">
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
          title={"Create Raffle"}
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
          <RaffleForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </Drawer>
  );
};

CreateRaffleDrawer.requiredParams = {
  createRaffle: true,
};
