import { renderHook, act, waitFor } from "@testing-library/react";
import { useUpdateRaffleStatus } from "../useRaffleManagement";
import { raffleApi } from "@/features/Raffle/api/raffle.api";
import { createWrapper } from "@/shared/test/test-utils";

jest.mock("@/features/Raffle/api/raffle.api", () => ({
  raffleApi: {
    bulkUpdateStatus: jest.fn(),
  },
}));

describe("useUpdateRaffleStatus", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should bulk update status successfully", async () => {
    const mockResponse = { id: "1", status: "active" };

    (raffleApi.bulkUpdateStatus as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useUpdateRaffleStatus(), {
      wrapper,
    });

    const payload = {
      id: "1",
      status: "active" as const,
    };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(raffleApi.bulkUpdateStatus).toHaveBeenCalledWith(
      payload.id,
      payload.status,
    );
  });
  it("should handle error case", async () => {
    (raffleApi.bulkUpdateStatus as jest.Mock).mockRejectedValue(
      new Error("Bulk update failed"),
    );

    const { result } = renderHook(() => useUpdateRaffleStatus(), {
      wrapper,
    });

    const payload = {
      id: "1",
      status: "active" as const,
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
