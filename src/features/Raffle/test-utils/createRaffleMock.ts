import type { RaffleFormData } from "../types/raffle.types";

export const createRaffleMock = (
  overrides?: Partial<RaffleFormData>,
): RaffleFormData => ({
  name: "Test",
  description: "desc",
  startDate: "2026-01-01",
  endDate: "2026-01-10",
  drawDate: "2026-01-12",
  status: "draft",
  ticketPrice: 23,
  maxTicketsPerUser: 4,
  totalTicketLimit: 4,
  prizes: [
    {
      id: "1",
      name: "Prize 1",
      type: "coins",
      amount: 100,
      quantity: 10,
    },
  ],
  ...overrides,
});
