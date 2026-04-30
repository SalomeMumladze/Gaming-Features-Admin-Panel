import { raffleSchema } from "../schema/raffle.schema";
import { baseRaffleData, basePrize } from "./raffleTestUtils";

const parse = (override = {}) =>
  raffleSchema.safeParse(baseRaffleData(override));

describe("Raffle Schema - prizes", () => {
  it("should fail when prize name is empty", () => {
    const res = parse({
      prizes: [{ ...basePrize, name: "   " }],
    });

    expect(res.success).toBe(false);
  });

  it("should fail when quantity is less than 1", () => {
    const res = parse({ prizes: [{ ...basePrize, quantity: 0 }] });

    expect(res.success).toBe(false);
  });

  it("should fail when amount is negative", () => {
    const res = parse({ prizes: [{ ...basePrize, amount: -10 }] });

    expect(res.success).toBe(false);
  });

  it("should pass when type is valid", () => {
    const res = parse({ prizes: [{ ...basePrize, type: "coins" }] });

    expect(res.success).toBe(true);
  });
});
