import { renderHook, waitFor } from "@testing-library/react";
import { useLeaderboards } from "../useLeaderboard";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";
import { createWrapper } from "@/features/leaderboards/test-utils/test-utils";

jest.mock("@/features/leaderboards/api/leaderboard.api");

describe("useLeaderboards", () => {
  it("fetches leaderboard list successfully", async () => {
    const mockData = [{ id: "1", name: "test" }];
    const { wrapper } = createWrapper();

    (leaderboardApi.getList as jest.Mock).mockResolvedValue({
      data: mockData,
    });
    const { result } = renderHook(() => useLeaderboards(), {
      wrapper,
    });
    expect(leaderboardApi.getList).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
});
