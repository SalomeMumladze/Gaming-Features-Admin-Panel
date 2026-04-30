import type { z } from "zod";
import type { leaderboardSchema } from "../schemas/leaderboard.schema";

export const basePrize = {
  id: "1",
  rank: 1,
  name: "Prize",
  type: "coins" as const,
  amount: 100,
};

export const baseLeaderboardData = (
  override: Partial<z.infer<typeof leaderboardSchema>> = {},
) => {
  return {
    title: "Test leaderboard",
    description: "Test description",
    startDate: "2026-01-01",
    endDate: "2026-01-10",
    status: "draft" as const,
    scoringType: "points" as const,
    maxParticipants: 2,
    prizes: [basePrize],
    ...override,
  };
};
