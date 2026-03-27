import React from "react";
import { alpha, useTheme } from "@mui/material";
import { WorkspacePremium } from "@mui/icons-material";
import { RANK_COLORS } from "@/features/leaderboards/components/PrizeFields/Config";

interface Rank {
  id: string;
  rank: number;
  name: string;
  type: string;
  amount: number;
}

interface RankBadgeProps {
  rank: Rank;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const rankInfo =
    rank.rank <= 3
      ? RANK_COLORS[rank.rank - 1]
      : {
          base: "#3b6ef0",
          label: `#${rank.rank}`,
        };

  return (
    <div
      className="shrink-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center"
      style={{
        backgroundColor: alpha(rankInfo.base, isDark ? 0.12 : 0.1),
        border: `1px solid ${alpha(rankInfo.base, isDark ? 0.3 : 0.22)}`,
      }}
    >
      <WorkspacePremium
        sx={{
          color: rankInfo.base,
          fontSize: 18,
        }}
      />
      <span
        className="text-[10px] font-extrabold mt-1"
        style={{ color: rankInfo.base }}
      >
        {rankInfo.label}
      </span>
    </div>
  );
};
