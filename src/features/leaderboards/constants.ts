export const LEADERBOARD_STATUSES = ["draft", "active", "completed"] as const;

export type LeaderboardStatus = (typeof LEADERBOARD_STATUSES)[number];
