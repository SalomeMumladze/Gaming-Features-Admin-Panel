import { raffleSchema } from "../raffle.schema";
import { baseRaffleData } from "@/features/Raffle/test-utils/raffleTestUtils";

describe("raffleSchema", () => {
  it("should fail when name is too short", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      name: "ab",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when name is too long", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      name: "a".repeat(100),
    });

    expect(result.success).toBe(false);
  });

  it("should fail when ticketPrice is negative", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      ticketPrice: -10,
    });

    expect(result.success).toBe(false);
  });

  it("should fail when maxTicketsPerUser < 1", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      maxTicketsPerUser: 0,
    });

    expect(result.success).toBe(false);
  });

  it("should fail when prizes array is empty", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      prizes: [],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when prize quantity is invalid", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      prizes: [
        {
          id: "1",
          name: "Prize",
          type: "coins",
          amount: 100,
          quantity: 0,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when endDate < startDate", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      endDate: "2025-01-01",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when drawDate <= endDate", () => {
    const result = raffleSchema.safeParse({
      ...baseRaffleData,
      drawDate: "2026-01-05",
    });

    expect(result.success).toBe(false);
  });
});
