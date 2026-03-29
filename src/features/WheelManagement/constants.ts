export const WHEEL_STATUSES = [
  "draft",
  "active",
  "drawn",
  "cancelled",
] as const;

export type WheelStatus = (typeof WHEEL_STATUSES)[number];
