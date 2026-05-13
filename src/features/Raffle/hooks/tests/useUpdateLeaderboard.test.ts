import { renderHook, act, waitFor } from "@testing-library/react";
import { useUpdateRaffle } from "../useRaffleManagement";
import { raffleApi } from "@/features/Raffle/api/raffle.api";
import { createWrapper } from "@/shared/test/test-utils";
import { baseRaffleData } from "@/features/Raffle//test-utils/raffleTestUtils";

jest.mock("@/features/Raffle/api/raffle.api", () => ({
  raffleApi: {
    update: jest.fn(),
  },
}));

describe("useUpdateRaffle", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update raffle successfully", async () => {
    const mockResponse = { id: "1", title: "Test raffle" };

    (raffleApi.update as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useUpdateRaffle(), {
      wrapper,
    });

    const payload = {
      id: "1",
      ...baseRaffleData(),
    };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(raffleApi.update).toHaveBeenCalled();
  });

  it("should handle error case", async () => {
    (raffleApi.update as jest.Mock).mockRejectedValue(
      new Error("Update failed"),
    );

    const { result } = renderHook(() => useUpdateRaffle(), {
      wrapper,
    });

    const payload = {
      id: "1",
      ...baseRaffleData(),
    };

    await act(async () => {
      try {
        await result.current.mutateAsync(payload);
      } catch {}
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
