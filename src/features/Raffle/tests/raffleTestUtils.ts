import type { z } from "zod";
import type { raffleSchema } from "../schema/raffle.schema";

export const basePrize = {
  id: "1",
  name: "First Prize",
  type: "coins" as const,
  amount: 100,
  quantity: 1,
};

export const baseRaffleData = (
  override: Partial<z.infer<typeof raffleSchema>> = {},
) => {
  return {
    name: "Test raffle",
    description: "Test raffle",
    startDate: "2026-01-02",
    endDate: "2026-01-10",
    drawDate: "2026-01-15",
    status: "draft" as const,
    ticketPrice: 10,
    maxTicketsPerUser: 5,
    totalTicketLimit: null,
    prizes: [basePrize],

    ...override,
  };
};
