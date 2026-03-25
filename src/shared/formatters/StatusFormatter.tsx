import React from "react";
import { Chip } from "@mui/material";

type Status = "draft" | "active" | "completed";

type Props = {
  value?: Status;
};

export const StatusFormatter: React.FC<Props> = ({ value }) => {
  if (!value) return null;

  let color: "default" | "success" | "warning" | "error" = "default";

  switch (value) {
    case "draft":
      color = "warning";
      break;
    case "active":
      color = "success";
      break;
    case "completed":
      color = "default";
      break;
  }

  const displayLabel = value.charAt(0).toUpperCase() + value.slice(1);

  return <Chip label={displayLabel} color={color} size="small" />;
};
