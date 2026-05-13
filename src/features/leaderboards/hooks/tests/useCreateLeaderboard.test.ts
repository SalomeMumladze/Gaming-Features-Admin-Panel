import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateLeaderboard } from "../useLeaderboard";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";
import { createWrapper } from "@/shared/test/test-utils";
import { createLeaderboardMock } from "@/features/leaderboards/test-utils/createLeaderboardMock";

jest.mock("@/features/leaderboards/api/leaderboard.api", () => ({
  leaderboardApi: {
    create: jest.fn(),
  },
}));

describe("useCreateLeaderboard", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create leaderboard successfully", async () => {
    const mockResponse = { id: "1", title: "Test leaderboard" };

    (leaderboardApi.create as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useCreateLeaderboard(), {
      wrapper,
    });

    const payload = createLeaderboardMock();

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(leaderboardApi.create).toHaveBeenCalled();
  });

  it("should handle error case", async () => {
    (leaderboardApi.create as jest.Mock).mockRejectedValue(
      new Error("Create failed"),
    );

    const { result } = renderHook(() => useCreateLeaderboard(), {
      wrapper,
    });

    const payload = createLeaderboardMock();

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
