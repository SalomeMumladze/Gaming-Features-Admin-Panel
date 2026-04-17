export const WHEEL_STATUSES = ["draft", "active", "inactive"] as const;

export type WheelStatus = (typeof WHEEL_STATUSES)[number];
