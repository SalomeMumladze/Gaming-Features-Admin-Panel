import { z } from "zod";

export const segmentSchema = z
  .object({
    id: z.string(),
    label: z.string().trim().min(1, "Each segment must have a label"),
    weight: z.number().min(0, "Weight must be ≥ 0"),
    color: z
      .string()
      .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color"),
    prizeType: z.enum(["coins", "freeSpin", "bonus", "nothing"]),
    prizeAmount: z.number().min(0),
    imageUrl: z.string().url().optional(),
  })
  .superRefine((seg, ctx) => {
    if (seg.prizeType === "nothing" && seg.prizeAmount !== 0) {
      ctx.addIssue({
        code: "custom",
        message: "prizeAmount must be 0 when prizeType is nothing",
        path: ["prizeAmount"],
      });
    }

    if (seg.prizeType !== "nothing" && seg.prizeAmount <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "prizeAmount must be > 0 when prizeType is not nothing",
        path: ["prizeAmount"],
      });
    }
  });

export const wheelSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(3, "Name must be 3–80 characters")
    .max(80, "Name must be 3–80 characters"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "inactive"]),
  segments: z
    .array(segmentSchema)
    .min(2, "Minimum 2 segments required")
    .max(12, "Maximum 12 segments allowed")
    .superRefine((segments, ctx) => {
      const total = segments.reduce((sum, s) => sum + s.weight, 0);

      if (total !== 100) {
        ctx.addIssue({
          code: "custom",
          message: "All segment weight values must sum to 100",
          path: ["segments"],
        });
      }
    }),
  spinCost: z.number().min(0, "spinCost must be a non-negative number"),
  maxSpinsPerUser: z
    .number()
    .int()
    .min(1, "maxSpinsPerUser must be at least 1"),
  backgroundColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color"),
  borderColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type WheelFormValues = z.infer<typeof wheelSchema>;
