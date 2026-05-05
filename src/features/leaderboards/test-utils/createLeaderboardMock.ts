import type { LeaderboardFormData } from "../types/leaderboard.types";

export const createLeaderboardMock = (
  overrides?: Partial<LeaderboardFormData>,
): LeaderboardFormData => ({
  title: "Test",
  description: "desc",
  startDate: "2026-01-01",
  endDate: "2026-01-10",
  status: "draft",
  scoringType: "points",
  maxParticipants: 100,
  prizes: [
    {
      id: "1",
      name: "Prize 1",
      type: "coins",
      amount: 100,
      rank: 1,
    },
  ],
  ...overrides,
});
