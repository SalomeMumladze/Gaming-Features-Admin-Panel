import React from "react";
import { Chip } from "@mui/material";

type Statuses =
  | "draft"
  | "active"
  | "completed"
  | "inactive"
  | "drawn"
  | "cancelled";

export const statuses: Statuses[] = [
  "draft",
  "active",
  "completed",
  "cancelled",
  "inactive",
  "drawn",
];

type Props = {
  value?: Statuses;
};

export const StatusFormatter: React.FC<Props> = ({ value }) => {
  if (!value) return null;

  const statusColorMap: Record<
    Statuses,
    "default" | "success" | "warning" | "error" | "info"
  > = {
    draft: "warning",
    active: "success",
    completed: "default",
    inactive: "error",
    drawn: "info",
    cancelled: "error",
  };

  const color = statusColorMap[value];

  const displayLabel = value.charAt(0).toUpperCase() + value.slice(1);

  return <Chip label={displayLabel} color={color} size="small" />;
};
