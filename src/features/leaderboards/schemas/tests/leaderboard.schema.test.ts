import { leaderboardSchema } from "../leaderboard.schema";
import { baseLeaderboardData } from "./leaderboardTestUtils";

const parse = (override = {}) =>
  leaderboardSchema.safeParse(baseLeaderboardData(override));

describe("Leaderboard Schema - general", () => {
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

  it("should fail when title is too short", () => {
    const res = parse({ title: "ab" });
    expect(res.success).toBe(false);
  });

  it("should fail when endDate is before startDate", () => {
    const res = parse({
      startDate: "2026-01-10",
      endDate: "2026-01-01",
    });

    expect(res.success).toBe(false);
  });

  it("should fail when maxParticipants < 2", () => {
    const res = parse({ maxParticipants: 1 });
    expect(res.success).toBe(false);
  });

  it("should fail when prizes empty", () => {
    const res = parse({ prizes: [] });
    expect(res.success).toBe(false);
  });
});
