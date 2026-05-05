import { renderHook, waitFor } from "@testing-library/react";
import { useLeaderboards } from "../useLeaderboard";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";
import { createWrapper } from "@/features/leaderboards/test-utils/test-utils";

jest.mock("@/features/leaderboards/api/leaderboard.api", () => ({
  leaderboardApi: {
    getList: jest.fn(),
  },
}));

describe("useLeaderboards", () => {
  const { wrapper } = createWrapper();

  it("should fetch leaderboards", async () => {
    const mockData = { data: [], total: 0 };

    (leaderboardApi.getList as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(() => useLeaderboards(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
});
