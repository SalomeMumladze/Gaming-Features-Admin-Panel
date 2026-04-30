import { segmentSchema } from "../schema/wheel.schema";

describe("segmentSchema", () => {
  it("should validate correct segment", () => {
    const result = segmentSchema.safeParse({
      id: "s1",
      label: "A",
      weight: 50,
      color: "#FF0000",
      prizeType: "coins",
      prizeAmount: 100,
      imageUrl: "https://example.com/img.png",
    });

    expect(result.success).toBe(true);
  });

  it("should fail when label is empty", () => {
    const result = segmentSchema.safeParse({
      id: "s1",
      label: "",
      weight: 50,
      color: "#FF0000",
      prizeType: "coins",
      prizeAmount: 100,
    });

    expect(result.success).toBe(false);
  });

  it("should fail when color is invalid", () => {
    const result = segmentSchema.safeParse({
      id: "s1",
      label: "A",
      weight: 50,
      color: "red",
      prizeType: "coins",
      prizeAmount: 100,
    });

    expect(result.success).toBe(false);
  });

  it("should require prizeAmount = 0 when prizeType is nothing", () => {
    const result = segmentSchema.safeParse({
      id: "s1",
      label: "A",
      weight: 50,
      color: "#FF0000",
      prizeType: "nothing",
      prizeAmount: 10,
    });

    expect(result.success).toBe(false);
  });

  it("should require prizeAmount > 0 when prizeType is not nothing", () => {
    const result = segmentSchema.safeParse({
      id: "s1",
      label: "A",
      weight: 50,
      color: "#FF0000",
      prizeType: "coins",
      prizeAmount: 0,
    });

    expect(result.success).toBe(false);
  });
});
