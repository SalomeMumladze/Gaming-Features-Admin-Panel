import React, { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type ConfirmOptions = {
  title?: string;
  description?: string;
};

type ConfirmContextType = {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (options?: ConfirmOptions) => {
    setOptions(options || {});
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleClose = (result: boolean) => {
    setOpen(false);
    resolver?.(result);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>{options.title || "Are you sure?"}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            {options.description ||
              "This action cannot be undone."}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleClose(true)}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};