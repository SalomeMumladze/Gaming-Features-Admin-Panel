import { renderHook, act, waitFor } from "@testing-library/react";
import { useUpdateLeaderboardStatus } from "../useLeaderboard";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";
import { createWrapper } from "@/features/leaderboards/test-utils/test-utils";

jest.mock("@/features/leaderboards/api/leaderboard.api", () => ({
  leaderboardApi: {
    bulkUpdateStatus: jest.fn(),
  },
}));

describe("useUpdateLeaderboardStatus", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should bulk update status successfully", async () => {
    const mockResponse = { id: "1", status: "active" };

    (leaderboardApi.bulkUpdateStatus as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useUpdateLeaderboardStatus(), {
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

    expect(leaderboardApi.bulkUpdateStatus).toHaveBeenCalledWith(
      payload.id,
      payload.status,
    );
  });
  it("should handle error case", async () => {
    (leaderboardApi.bulkUpdateStatus as jest.Mock).mockRejectedValue(
      new Error("Bulk update failed"),
    );

    const { result } = renderHook(() => useUpdateLeaderboardStatus(), {
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
