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

describe("Raffle Schema - prizes validation", () => {
  it("should fail when prizes array is empty", () => {
    expect(parse({ prizes: [] }).success).toBe(false);
  });

  it("should fail when prize name is empty", () => {
    const result = parse({
      prizes: [
        {
          ...baseValidData.prizes[0],
          name: "",
        },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.format().prizes?.[0]?.name?._errors).toContain(
        "Name is required",
      );
    }
  });

  it("should fail when prize quantity is less than 1", () => {
    const result = parse({
      prizes: [
        {
          ...baseValidData.prizes[0],
          quantity: 0,
        },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.format().prizes?.[0]?.quantity?._errors).toContain(
        "Must be at least 1",
      );
    }
  });

  it("should fail when one of multiple prizes is invalid", () => {
    expect(
      parse({
        prizes: [
          baseValidData.prizes[0],
          {
            id: "2",
            name: "",
            type: "coins",
            amount: 50,
            quantity: 1,
          },
        ],
      }).success,
    ).toBe(false);
  });
});
