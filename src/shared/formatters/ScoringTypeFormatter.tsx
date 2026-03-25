import React from "react";
import { Chip } from "@mui/material";

type ScoringType = "points" | "wins" | "wagered";

type Props = {
  value?: ScoringType;
};

export const ScoringTypeFormatter: React.FC<Props> = ({ value }) => {
  if (!value) return null;

  const map: Record<
    ScoringType,
    { label: string; color: "default" | "primary" | "success" | "warning" }
  > = {
    points: { label: "Points", color: "primary" },
    wins: { label: "Wins", color: "success" },
    wagered: { label: "Wagered", color: "warning" },
  };

  const { label, color } = map[value];

  return <Chip label={label} color={color} size="small" />;
};
