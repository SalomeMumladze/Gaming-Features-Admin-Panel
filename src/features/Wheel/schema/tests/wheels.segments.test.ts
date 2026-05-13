import { wheelSchema } from "../wheel.schema";
import { baseSegments, baseWheelData } from "../../tests/wheelTestUtils";

describe("wheelSegmentsSchema", () => {
  it("should fail when total segment weight is not 100", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      segments: [
        {
          ...baseSegments[0],
          weight: 20,
        },
        {
          ...baseSegments[1],
          weight: 20,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when prizeType is nothing and prizeAmount is not 0", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      segments: [
        {
          ...baseSegments[0],
        },
        {
          ...baseSegments[1],
          prizeAmount: 10,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should fail when prizeType is not nothing and amount <= 0", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      segments: [
        {
          ...baseSegments[0],
          prizeAmount: 0,
        },
        {
          ...baseSegments[1],
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should fail with invalid segment color", () => {
    const result = wheelSchema.safeParse({
      ...baseWheelData,
      segments: [
        {
          ...baseSegments[0],
          color: "blue",
        },
        baseSegments[1],
      ],
    });

    expect(result.success).toBe(false);
  });
});
