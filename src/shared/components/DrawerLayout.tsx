import React from "react";
import type { ReactNode } from "react";
import {
  Drawer,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Stack,
  Alert,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface DrawerLayoutProps {
  open: boolean;
  title: string;
  loading?: boolean;
  error?: boolean | string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export const DrawerLayout: React.FC<DrawerLayoutProps> = ({
  open,
  title,
  loading = false,
  error = false,
  onClose,
  children,
}) => {
  return (
    <Drawer open={open} onClose={onClose} anchor="right">
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
          sx={{
            borderRadius: 0,
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          }}
          avatar={
            <IconButton onClick={onClose} color="inherit">
              <Close />
            </IconButton>
          }
          title={
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
          }
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
              <Typography>{title} loading...</Typography>
            </Stack>
          )}

          {error && !loading && (
            <Alert severity="error" variant="outlined">
              {typeof error === "string" ? error : `Something went wrong.`}
            </Alert>
          )}

          {!loading && !error && <Box width="100%">{children}</Box>}
        </CardContent>
      </Card>
    </Drawer>
  );
};
