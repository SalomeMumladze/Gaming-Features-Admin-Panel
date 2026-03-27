import { z } from "zod";

export const rafflePrizeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Prize name is required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z.number().nonnegative("Amount must be 0 or more"),
  quantity: z.number("Quantity is required").int().min(1, "Must be at least 1"),
  imageUrl: z.string().optional(),
});

export const raffleSchema = z
  .object({
    name: z
      .string()
      .min(3, "Raffle name must be at least 3 characters")
      .max(80, "Raffle name must be at most 80 characters"),
    description: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    drawDate: z.string().min(1, "Draw date is required"),
    status: z.enum(["draft", "active", "drawn", "cancelled"]),
    ticketPrice: z.number().positive("Ticket price must be positive"),
    maxTicketsPerUser: z
      .number("Max tickets is required")
      .int("")
      .min(1, "Max tickets per user must be at least 1"),
    totalTicketLimit: z.number().int().nullable().optional(),
    prizes: z.array(rafflePrizeSchema).min(1, "At least 1 prize is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.drawDate) > new Date(data.endDate), {
    message: "Draw date must be after end date",
    path: ["drawDate"],
  });

export type RaffleFormValues = z.infer<typeof raffleSchema>;
