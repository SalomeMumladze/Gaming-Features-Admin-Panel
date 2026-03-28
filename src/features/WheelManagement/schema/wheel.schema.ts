import { z } from "zod";

export const segmentSchema = z.object({
  label: z.string().min(1, "Segment label is required"),
  weight: z.number("Weight Is required").min(0, "Weight must be ≥ 0"),
  color: z.string().regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i, "Invalid hex color"),
});

export const wheelSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be 3–80 characters")
    .max(80, "Name must be 3–80 characters"),
  segments: z
    .array(segmentSchema)
    .min(2, "At least 2 segments required")
    .max(12, "Maximum 12 segments allowed")
    .refine((segments) => {
      const total = segments.reduce((acc, seg) => acc + seg.weight, 0);
      return total === 100;
    }, "Segment weights must sum to 100"),
  spinCost: z.number("Is required").min(0, "Spin cost must be ≥ 0"),
  maxSpinsPerUser: z
    .number("Is required")
    .min(1, "Must allow at least 1 spin per user"),
  status: z.enum(["draft", "active", "inactive"]),

  prizes: z
    .array(
      z.object({
        name: z.string().min(1, "Prize name required"),
        prizeType: z.enum(["coins", "item", "nothing"]),
        prizeAmount: z.number(),
      }),
    )
    .refine(
      (prizes) =>
        prizes.every(
          (p) =>
            (p.prizeType === "nothing" && p.prizeAmount === 0) ||
            (p.prizeType !== "nothing" && p.prizeAmount > 0),
        ),
      "Prize amounts must be 0 for 'nothing' or > 0 otherwise",
    ),
});

export type WheelFormValues = z.infer<typeof wheelSchema>;
