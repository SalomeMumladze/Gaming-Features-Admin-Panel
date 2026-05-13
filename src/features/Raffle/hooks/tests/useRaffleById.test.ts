import { renderHook, waitFor } from "@testing-library/react";
import { useRaffleById } from "../useRaffleManagement";
import { createWrapper } from "@/shared/test/test-utils";
import { raffleApi } from "@/features/Raffle/api/raffle.api";

jest.mock("@/features/raffle/api/raffle.api", () => ({
  raffleApi: {
    getById: jest.fn(),
  },
}));

describe("useRaffleById", () => {
  const { wrapper } = createWrapper();

  it("should fetch raffle by id", async () => {
    const mockData = { id: "1" };

    (raffleApi.getById as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(() => useRaffleById("1"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it("should not run if id is missing", () => {
    const { result } = renderHook(() => useRaffleById(undefined), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});
