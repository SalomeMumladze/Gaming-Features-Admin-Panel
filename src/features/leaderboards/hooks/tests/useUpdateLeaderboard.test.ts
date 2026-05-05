import { renderHook, act, waitFor } from "@testing-library/react";
import { useUpdateLeaderboard } from "../useLeaderboard";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";
import { createWrapper } from "@/features/leaderboards/test-utils/test-utils";
import { createLeaderboardMock } from "@/features/leaderboards/test-utils/createLeaderboardMock";

jest.mock("@/features/leaderboards/api/leaderboard.api", () => ({
  leaderboardApi: {
    update: jest.fn(),
  },
}));

describe("useUpdateLeaderboard", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update leaderboard successfully", async () => {
    const mockResponse = { id: "1", title: "Test leaderboard" };

    (leaderboardApi.update as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useUpdateLeaderboard(), {
      wrapper,
    });

    const payload = {
      id: "1",
      ...createLeaderboardMock(),
    };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(leaderboardApi.update).toHaveBeenCalled();
  });

  it("should handle error case", async () => {
    (leaderboardApi.update as jest.Mock).mockRejectedValue(
      new Error("Update failed"),
    );

    const { result } = renderHook(() => useUpdateLeaderboard(), {
      wrapper,
    });

    const payload = {
      id: "1",
      ...createLeaderboardMock(),
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
