import { leaderboardSchema } from "../leaderboard.schema";
import { baseLeaderboardData, basePrize } from "./leaderboardTestUtils";

const parse = (override = {}) =>
  leaderboardSchema.safeParse(baseLeaderboardData(override));

describe("Leaderboard Schema - prizes", () => {
  it("should fail when prize name is empty", () => {
    const res = parse({
      prizes: [{ ...basePrize, name: "   " }],
    });

    expect(res.success).toBe(false);
  });

  it("should fail when prize amount is negative", () => {
    const res = parse({
      prizes: [{ ...basePrize, amount: -10 }],
    });

    expect(res.success).toBe(false);
  });

  it("should fail when ranks are duplicated", () => {
    const res = parse({
      prizes: [
        { ...basePrize, rank: 1 },
        { ...basePrize, id: "2", rank: 1 },
      ],
    });

    expect(res.success).toBe(false);
  });

  it("should fail when ranks are not sequential", () => {
    const res = parse({
      prizes: [
        { ...basePrize, rank: 1 },
        { ...basePrize, id: "2", rank: 3 },
      ],
    });

    expect(res.success).toBe(false);
  });
});
