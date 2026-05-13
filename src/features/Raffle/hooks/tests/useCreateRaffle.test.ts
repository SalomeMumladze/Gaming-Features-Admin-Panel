import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateRaffle } from "../useRaffleManagement";
import { raffleApi } from "@/features/Raffle/api/raffle.api";
import { createWrapper } from "@/shared/test/test-utils";
import { baseRaffleData } from "@/features/Raffle//test-utils/raffleTestUtils";

jest.mock("@/features/raffle/api/raffle.api", () => ({
  raffleApi: {
    create: jest.fn(),
  },
}));

describe("useCreateRaffle", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create raffle successfully", async () => {
    const mockResponse = { id: "1", title: "Test raffle" };

    (raffleApi.create as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useCreateRaffle(), {
      wrapper,
    });

    const payload = baseRaffleData();

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(raffleApi.create).toHaveBeenCalled();
  });

  it("should handle error case", async () => {
    (raffleApi.create as jest.Mock).mockRejectedValue(
      new Error("Create failed"),
    );

    const { result } = renderHook(() => useCreateRaffle(), {
      wrapper,
    });

    const payload = baseRaffleData();

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
