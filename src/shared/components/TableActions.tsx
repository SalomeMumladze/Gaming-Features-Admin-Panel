import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit, Info, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useQueryParams from "@/shared/hooks/useQueryParams";

interface TableActionsProps {
  id: string;
  onDelete: (id: string) => void;
  confirmText?: string;
}

export const TableActions: React.FC<TableActionsProps> = ({
  id,
  onDelete,
  confirmText = "Are you sure you want to delete this leaderboard?",
}) => {
  const navigate = useNavigate();
  const { setUrlParams } = useQueryParams();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(id);
    setOpenConfirm(false);
  };

  return (
    <>
      <div className="flex h-full gap-1 items-center">
        <Tooltip title="Edit Leaderboard" className="h-fit m-auto">
          <IconButton
            color="primary"
            size="small"
            onClick={() => setUrlParams({ leaderboardId: id })}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="View Leaderboard Info" className="h-fit m-auto">
          <IconButton
            color="warning"
            size="small"
            onClick={() => navigate(`/leaderboard/${id}`)}
          >
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Leaderboard">
          <IconButton
            color="error"
            size="small"
            className="h-fit m-auto"
            onClick={() => setOpenConfirm(true)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>{confirmText}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
