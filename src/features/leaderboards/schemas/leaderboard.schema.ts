import { z } from "zod";

export const prizeSchema = z.object({
  rank: z.number().int().min(1),
  name: z.string().min(1, "Prize name is required"),
  type: z
    .string()
    .nonempty({ message: "Type is required" })
    .refine(() => ["coins", "freeSpin", "bonus"]),
  amount: z.number("Invalid input").positive("Amount must be positive"),
  imageUrl: z.string().optional(),
});

export const leaderboardSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    status: z.enum(["draft", "active", "completed"]).nullable().optional(),
    scoringType: z.enum(["points", "wins", "wagered"]).nullable().optional(),
    maxParticipants: z
      .number("Max participants must be a number")
      .int({ message: "Max participants must be an integer" })
      .min(2, "Minimum 2 participants required"),
    prizes: z.array(prizeSchema).min(1, "At least 1 prize is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const ranks = data.prizes.map((p) => p.rank);
      const unique = new Set(ranks);
      if (unique.size !== ranks.length) return false;

      const sorted = [...ranks].sort((a, b) => a - b);
      return sorted.every((rank, i) => rank === i + 1);
    },
    {
      message: "Prize ranks must be sequential starting from 1",
      path: ["prizes"],
    },
  );

export type LeaderboardFormValues = z.infer<typeof leaderboardSchema>;
