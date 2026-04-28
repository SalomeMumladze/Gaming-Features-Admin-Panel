import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit, Delete, RemoveRedEye } from "@mui/icons-material";

interface TableActionsFormatterProps {
  id: string | number;
  showEdit?: boolean;
  showInfo?: boolean;
  showDelete?: boolean;
  editTooltip?: string;
  infoTooltip?: string;
  deleteTooltip?: string;
  onEditClick?: (id: string | number) => void;
  onInfoClick?: (id: string | number) => void;
  onDeleteClick?: (id: string | number) => void;
  confirmText?: string;
}

export const TableActionsFormatter: React.FC<TableActionsFormatterProps> = ({
  id,
  showEdit = true,
  showInfo = true,
  showDelete = true,
  editTooltip = "Edit",
  infoTooltip = "View info",
  deleteTooltip = "Delete",
  onEditClick,
  onInfoClick,
  onDeleteClick,
  confirmText = "Are you sure you want to delete this?",
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDeleteConfirm = () => {
    onDeleteClick?.(id);
    setOpenConfirm(false);
  };

  return (
    <>
      <div className="flex h-full gap-1 items-center justify-end">
        {showInfo && (
          <Tooltip title={infoTooltip} className="h-fit m-auto">
            <IconButton
              color="warning"
              size="small"
              onClick={() => onInfoClick?.(id)}
            >
              <RemoveRedEye fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {showEdit && (
          <Tooltip title={editTooltip} className="h-fit m-auto">
            <IconButton
              color="primary"
              size="small"
              onClick={() => onEditClick?.(id)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {showDelete && (
          <Tooltip title={deleteTooltip} className="h-fit m-auto">
            <IconButton
              size="small"
              onClick={() => setOpenConfirm(true)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>{confirmText}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
