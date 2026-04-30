import { wheelSchema } from "../schema/wheel.schema";
import { baseWheelData } from "./wheelTestUtils";

describe("wheelSchema", () => {
  it("should validate correct wheel data", () => {
    const data = baseWheelData();

    const result = wheelSchema.safeParse(data);

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
    const data = baseWheelData({ name: "ab" });

    const result = wheelSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail when segments are less than 2", () => {
    const data = baseWheelData({
      segments: [
        {
          id: "s1",
          label: "A",
          weight: 100,
          color: "#FF0000",
          prizeType: "coins",
          prizeAmount: 100,
        },
      ],
    });

    const result = wheelSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail when segments are more than 12", () => {
    const data = baseWheelData({
      segments: Array.from({ length: 13 }).map((_, i) => ({
        id: `s${i}`,
        label: `S${i}`,
        weight: 10,
        color: "#FF0000",
        prizeType: "coins",
        prizeAmount: 10,
      })),
    });

    const result = wheelSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail when segments weight != 100", () => {
    const data = baseWheelData({
      segments: [
        {
          id: "s1",
          label: "A",
          weight: 30,
          color: "#FF0000",
          prizeType: "coins",
          prizeAmount: 100,
        },
        {
          id: "s2",
          label: "B",
          weight: 30,
          color: "#00FF00",
          prizeType: "coins",
          prizeAmount: 100,
        },
      ],
    });

    const result = wheelSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail when spinCost is negative", () => {
    const data = baseWheelData({
      spinCost: -5,
    });

    const result = wheelSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should fail when maxSpinsPerUser is less than 1", () => {
    const data = baseWheelData({
      maxSpinsPerUser: 0,
    });

    const result = wheelSchema.safeParse(data);

    expect(result.success).toBe(false);
  });
});
