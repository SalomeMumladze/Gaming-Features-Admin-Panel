import React from "react";
import { Chip } from "@mui/material";
import type { LeaderboardScoringType } from "../types/leaderboard.types";

type Props = {
  value?: LeaderboardScoringType;
};

export const ScoringTypeFormatter: React.FC<Props> = ({ value }) => {
  if (!value) return null;

  const map: Record<
    LeaderboardScoringType,
    { label: string; color: "default" | "primary" | "success" | "warning" }
  > = {
    points: { label: "Points", color: "primary" },
    wins: { label: "Wins", color: "success" },
    wagered: { label: "Wagered", color: "warning" },
  };

  const { label, color } = map[value];

  return <Chip label={label} color={color} size="small" />;
};
