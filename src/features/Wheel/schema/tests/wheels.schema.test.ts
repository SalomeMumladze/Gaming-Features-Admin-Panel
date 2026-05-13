import { wheelSchema } from "../wheel.schema";
import { baseWheelData, baseSegments } from "../../tests/wheelTestUtils";

describe("wheelSchema", () => {
  it("should fail when name is too short", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      name: "ab",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when name is too long", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      name: "a".repeat(100),
    });

    expect(result.success).toBe(false);
  });

  it("should fail when segments are less than 2", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      segments: [baseSegments[0]],
    });

    expect(result.success).toBe(false);
  });

  it("should fail with invalid backgroundColor", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      backgroundColor: "red",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when maxSpinsPerUser < 1", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      maxSpinsPerUser: 0,
    });

    expect(result.success).toBe(false);
  });

  it("should fail when spinCost is negative", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      spinCost: -1,
    });

    expect(result.success).toBe(false);
  });
});
