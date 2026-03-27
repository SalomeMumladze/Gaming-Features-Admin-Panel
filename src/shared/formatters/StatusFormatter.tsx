import React from "react";
import { Chip } from "@mui/material";

type Statuses = "draft" | "active" | "completed" | "inactive" | "drawn";

export const statuses: Statuses[] = [
  "draft",
  "active",
  "completed",
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
  };

  const color = statusColorMap[value];

  const displayLabel = value.charAt(0).toUpperCase() + value.slice(1);

  return <Chip label={displayLabel} color={color} size="small" />;
};
