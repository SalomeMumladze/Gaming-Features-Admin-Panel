import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

interface FieldRowProps {
  index: number;
  onRemove: () => void;
  removeDisabled?: boolean;
  removeTooltip?: string;
  children: React.ReactNode;
}

export const FieldRow: React.FC<FieldRowProps> = ({
  index,
  onRemove,
  removeDisabled,
  removeTooltip,
  children,
}) => (
  <Box className="flex items-start gap-3 p-3 py-5 rounded-xl bg-gray-50 border border-gray-100 group transition-all hover:border-indigo-200 hover:bg-indigo-50/30">
    <Box className="flex items-center justify-center min-w-[24px] h-6 mt-2">
      <Typography
        variant="caption"
        className="!font-mono !font-bold text-gray-400"
      >
        {String(index + 1).padStart(2, "0")}
      </Typography>
    </Box>
    <Box className="flex-1 flex flex-wrap gap-3">{children}</Box>
    <Tooltip title={removeTooltip ?? "Remove"}>
      <span>
        <IconButton color="error" onClick={onRemove} disabled={removeDisabled}>
          <Delete />
        </IconButton>
      </span>
    </Tooltip>
  </Box>
);
