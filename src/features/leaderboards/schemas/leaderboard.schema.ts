import { z } from "zod";

export const prizeSchema = z.object({
  id: z.string(),
  rank: z.number().int().min(1),
  name: z.string().trim().min(1, "Prize name is required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z.number().positive("Amount must be positive"),
  imageUrl: z.string().url().optional(),
});

const validatePrizeRanks = (prizes: { rank: number }[]) => {
  const ranks = prizes.map((p) => p.rank);

  const sorted = [...ranks].sort((a, b) => a - b);

  return (
    new Set(ranks).size === ranks.length && sorted.every((r, i) => r === i + 1)
  );
};

export const leaderboardSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title is required, 3–100 characters")
      .max(100, "Title is required, 3–100 characters"),

    description: z.string().optional(),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),

    status: z.enum(["draft", "active", "completed"]).optional(),

    scoringType: z.enum(["points", "wins", "wagered"]).optional(),

    maxParticipants: z
      .int("maxParticipants must be a positive integer, minimum 2")
      .min(2, "maxParticipants must be a positive integer, minimum 2"),

    prizes: z.array(prizeSchema).min(1, "At least 1 prize required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "endDate must be after startDate",
    path: ["endDate"],
  })
  .refine((data) => validatePrizeRanks(data.prizes), {
    message: "Prize ranks must be unique, sequential starting from 1",
    path: ["prizes"],
  });

export type LeaderboardFormValues = z.infer<typeof leaderboardSchema>;
