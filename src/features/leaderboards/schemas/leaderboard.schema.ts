import { z } from "zod";

export const prizeSchema = z.object({
  id: z.string(),
  rank: z.number().int().min(1),
  name: z.string().min(1, "Prize name is required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z.number().positive("Amount must be positive"),
  imageUrl: z.string().optional(),
});

export const leaderboardSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().optional(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),

    status: z.enum(["draft", "active", "completed"]).nullable().optional(),
    scoringType: z.enum(["points", "wins", "wagered"]).nullable().optional(),

    maxParticipants: z.number().int().min(2),

    prizes: z.array(prizeSchema),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type LeaderboardFormValues = z.infer<typeof leaderboardSchema>;
