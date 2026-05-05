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
  prizes: [],
  maxParticipants: 100,
  ...overrides,
});
