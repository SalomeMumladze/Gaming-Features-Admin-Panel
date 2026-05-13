import { renderHook, waitFor } from "@testing-library/react";
import { useRaffles } from "../useRaffleManagement";
import { raffleApi } from "@/features/Raffle/api/raffle.api";
import { createWrapper } from "@/shared/test/test-utils";

jest.mock("@/features/raffle/api/raffle.api", () => ({
  raffleApi: {
    getList: jest.fn(),
  },
}));

describe("useRaffles", () => {
  const { wrapper } = createWrapper();

  it("should fetch raffles", async () => {
    const mockData = { data: [], total: 0 };

    (raffleApi.getList as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(() => useRaffles(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
});
