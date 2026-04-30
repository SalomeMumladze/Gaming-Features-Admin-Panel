import { raffleSchema } from "../schema/raffle.schema";
import { baseRaffleData } from "./raffleTestUtils";

const parse = (override = {}) =>
  raffleSchema.safeParse(baseRaffleData(override));

describe("Raffle Schema - core validation", () => {
  it("should pass with valid data", () => {
    const result = parse();

    if (!result.success) {
      throw new Error(
        result.error.issues
          .map((e) => `${e.path.join(".")} -> ${e.message}`)
          .join("\n"),
      );
    }

    expect(result.success).toBe(true);
  });

  it("should fail when name is too short", () => {
    const res = parse({ name: "ab" });
    expect(res.success).toBe(false);
  });

  it("should fail when endDate is before startDate", () => {
    const res = parse({
      startDate: "2026-01-10",
      endDate: "2026-01-01",
    });

    expect(res.success).toBe(false);
  });

  it("should fail when drawDate is before endDate", () => {
    const res = parse({
      endDate: "2026-01-10",
      drawDate: "2026-01-01",
    });

    expect(res.success).toBe(false);
  });

  it("should fail when ticketPrice is negative", () => {
    const res = parse({ ticketPrice: -1 });
    expect(res.success).toBe(false);
  });

  it("should fail when maxTicketsPerUser is less than 1", () => {
    const res = parse({ maxTicketsPerUser: 0 });
    expect(res.success).toBe(false);
  });

  it("should fail when prizes empty", () => {
    const res = parse({ prizes: [] });
    expect(res.success).toBe(false);
  });
});