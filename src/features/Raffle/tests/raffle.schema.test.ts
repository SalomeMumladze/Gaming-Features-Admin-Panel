import { raffleSchema } from "../schema/raffle.schema";

const baseValidData = {
  name: "test raffle",
  description: "Test raffle",
  startDate: "2026-01-02",
  endDate: "2026-01-10",
  drawDate: "2026-01-15",
  status: "draft",
  ticketPrice: 10,
  maxTicketsPerUser: 5,
  totalTicketLimit: null,
  prizes: [
    {
      id: "1",
      name: "First Prize",
      type: "coins",
      amount: 100,
      quantity: 1,
    },
  ],
};

const parse = (override = {}) =>
  raffleSchema.safeParse({
    ...baseValidData,
    ...override,
  });

describe("Raffle Schema - core validation", () => {
  it("should pass with valid data", () => {
    expect(parse().success).toBe(true);
  });

  describe("name validation", () => {
    it("should fail when name is too short", () => {
      expect(parse({ name: "12" }).success).toBe(false);
    });

    it("should fail when name is too long", () => {
      expect(parse({ name: "a".repeat(81) }).success).toBe(false);
    });
  });

  describe("date validation", () => {
    it("should fail when startDate is empty", () => {
      expect(parse({ startDate: "" }).success).toBe(false);
    });

    it("should fail when endDate is before startDate", () => {
      expect(
        parse({
          startDate: "2026-01-10",
          endDate: "2026-01-01",
        }).success,
      ).toBe(false);
    });

    it("should fail when drawDate is before endDate", () => {
      expect(
        parse({
          drawDate: "2026-01-01",
        }).success,
      ).toBe(false);
    });
  });

  describe("numeric validation", () => {
    it("should fail when ticketPrice is negative", () => {
      expect(parse({ ticketPrice: -5 }).success).toBe(false);
    });

    it("should fail when maxTicketsPerUser < 1", () => {
      expect(parse({ maxTicketsPerUser: 0 }).success).toBe(false);
    });
  });

  describe("optional fields", () => {
    it("should allow null totalTicketLimit", () => {
      expect(parse({ totalTicketLimit: null }).success).toBe(true);
    });
  });
});
