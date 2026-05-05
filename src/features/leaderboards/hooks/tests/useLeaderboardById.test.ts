import { renderHook, waitFor } from "@testing-library/react";
import { useLeaderboardById } from "../useLeaderboard";
import { createWrapper } from "@/features/leaderboards/test-utils/test-utils";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";

jest.mock("@/features/leaderboards/api/leaderboard.api", () => ({
  leaderboardApi: {
    getById: jest.fn(),
  },
}));

describe("useLeaderboardById", () => {
  const { wrapper } = createWrapper();

  it("should fetch leaderboard by id", async () => {
    const mockData = { id: "1" };

    (leaderboardApi.getById as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(() => useLeaderboardById("1"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it("should not run if id is missing", () => {
    const { result } = renderHook(() => useLeaderboardById(undefined), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});
