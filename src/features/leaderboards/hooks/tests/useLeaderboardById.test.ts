import { renderHook, waitFor } from "@testing-library/react";
import { useLeaderboardById } from "../useLeaderboard";
import { leaderboardApi } from "@/features/leaderboards/api/leaderboard.api";
import { createWrapper } from "@/features/leaderboards/test-utils/test-utils";

jest.mock("@/features/leaderboards/api/leaderboard.api");

describe("useLeaderboardById", () => {
  it("fetches by id", async () => {
    const mockData = { id: "1", name: "test" };
    (leaderboardApi.getById as jest.Mock).mockResolvedValue({ data: mockData });

    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useLeaderboardById("1"), {
      wrapper,
    });

    expect(leaderboardApi.getById).toHaveBeenCalledWith("1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("does not run without id", () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useLeaderboardById(undefined), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});
