import { raffleSchema } from "../raffle.schema";
import { basePrize } from "@/features/Raffle/test-utils/raffleTestUtils";

describe("rafflePrizeSchema", () => {
  it("should fail when name is empty", () => {
    const result = raffleSchema.safeParse({
      ...basePrize,
      name: "",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when type is invalid", () => {
    const result = raffleSchema.safeParse({
      ...basePrize,
      type: "invalid",
    });

    expect(result.success).toBe(false);
  });

  it("should fail when amount is negative", () => {
    const result = raffleSchema.safeParse({
      ...basePrize,
      amount: -10,
    });

    expect(result.success).toBe(false);
  });

  it("should fail when quantity is less than 1", () => {
    const result = raffleSchema.safeParse({
      ...basePrize,
      quantity: 0,
    });

    expect(result.success).toBe(false);
  });

  it("should fail when imageUrl is invalid", () => {
    const result = raffleSchema.safeParse({
      ...basePrize,
      imageUrl: "not-a-url",
    });

    expect(result.success).toBe(false);
  });
});
