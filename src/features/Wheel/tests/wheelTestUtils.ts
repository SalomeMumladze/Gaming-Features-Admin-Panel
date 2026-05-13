import type { z } from "zod";
import type { wheelSchema } from "../schema/wheel.schema";

export const baseSegments = [
  {
    id: "s1",
    label: "A",
    weight: 50,
    color: "#FF0000",
    prizeType: "coins",
    prizeAmount: 100,
    imageUrl: "https://example.com/img.png",
  },
  {
    id: "s2",
    label: "B",
    weight: 50,
    color: "#00FF00",
    prizeType: "bonus",
    prizeAmount: 50,
    imageUrl: "https://example.com/img.png",
  },
];
export const baseWheelData = (
  override: Partial<z.infer<typeof wheelSchema>> = {},
) => {
  return {
    name: "Lucky Wheel",
    description: "Test wheel",
    status: "draft" as const,
    spinCost: 10,
    maxSpinsPerUser: 5,
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    segments: [...baseSegments],
    ...override,
  };
};
