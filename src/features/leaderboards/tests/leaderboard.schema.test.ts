import { leaderboardSchema } from "../schemas/leaderboard.schema";

const baseValidData = {
  title: "test",
  description: "Test leaderboard",
  startDate: "2026-01-01",
  endDate: "2026-01-10",
  status: "draft",
  scoringType: "points",
  maxParticipants: 10,
  prizes: [
    {
      id: "1",
      rank: 1,
      name: "First Prize",
      type: "coins",
      amount: 100,
    },
  ],
};

describe("Leaderboard Schema Validation", () => {
  it("should pass with valid data", () => {
    const result = leaderboardSchema.safeParse(baseValidData);

    expect(result.success).toBe(true);
  });

  it("should fail when title is too short", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      title: "ab",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when title is too long", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      title: "a".repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it("should fail when endDate is before startDate", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      startDate: "2026-01-10",
      endDate: "2026-01-01",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when maxParticipants is less than 2", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      maxParticipants: 1,
    });

    expect(result.success).toBe(false);
  });

  it("should fail when prizes array is empty", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      prizes: [],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when prize amount is negative", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      prizes: [
        {
          id: "1",
          rank: 1,
          name: "Prize",
          type: "coins",
          amount: -10,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when endDate equals startDate", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      startDate: "2026-01-01",
      endDate: "2026-01-01",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when maxParticipants is not integer", () => {
    const result = leaderboardSchema.safeParse({
      ...baseValidData,
      maxParticipants: 2.5,
    });

    expect(result.success).toBe(false);
  });
});