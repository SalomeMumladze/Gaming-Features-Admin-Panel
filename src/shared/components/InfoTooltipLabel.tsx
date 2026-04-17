import React from "react";
import { Tooltip } from "@mui/material";
import { Help } from "@mui/icons-material";

export const TableCellWithTooltip = ({
  value,
  description,
}: {
  value: string;
  description?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <span>{value}</span>

      {description && (
        <Tooltip
          title={description}
          disableInteractive
          className="cursor-pointer"
        >
          <Help fontSize="small" color="info" />
        </Tooltip>
      )}
    </div>
  );
};
