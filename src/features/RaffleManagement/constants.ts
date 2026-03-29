export const RAFFLE_STATUSES = [
  "draft",
  "active",
  "drawn",
  "cancelled",
] as const;

export type RaffleStatus = (typeof RAFFLE_STATUSES)[number];
