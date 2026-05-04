import { leaderboardApi } from "../leaderboard.api";
import { apiGateway } from "@/shared/api/httpClient";

/**
 * Mocking the shared HTTP client so we can isolate API layer tests.
 * We do NOT want real network requests in unit tests.
 */
jest.mock("@/shared/api/httpClient", () => ({
  apiGateway: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("leaderboardApi", () => {
  /**
   * Clear all mock call history after each test
   * to avoid test pollution between test cases.
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getList calls correct endpoint", async () => {
    /**
     * Mock API response for GET request
     */
    (apiGateway.get as jest.Mock).mockResolvedValue({ data: [] });

    // Call API method
    await leaderboardApi.getList({ _page: 1 });

    /**
     * Assert correct endpoint and query parameters are used
     */
    expect(apiGateway.get).toHaveBeenCalledWith("/leaderboards", {
      params: { _page: 1 },
    });
  });

  it("create sends correct payload", async () => {
    /**
     * Mock POST response
     */
    (apiGateway.post as jest.Mock).mockResolvedValue({ data: {} });

    const payload = { name: "test" } as any;

    // Call create API
    await leaderboardApi.create(payload);

    /**
     * Ensure POST request sends correct body
     */
    expect(apiGateway.post).toHaveBeenCalledWith("/leaderboards", payload);
  });

  it("update sends correct request", async () => {
    /**
     * Mock PUT response
     */
    (apiGateway.put as jest.Mock).mockResolvedValue({ data: {} });

    // Call update API with id and payload
    await leaderboardApi.update("1", { name: "updated" } as any);

    /**
     * Verify correct URL and request body
     */
    expect(apiGateway.put).toHaveBeenCalledWith("/leaderboards/1", {
      name: "updated",
    });
  });

  it("delete sends correct id", async () => {
    /**
     * Mock DELETE response
     */
    (apiGateway.delete as jest.Mock).mockResolvedValue({});

    // Call delete API
    await leaderboardApi.delete("1");

    /**
     * Verify correct endpoint is called
     */
    expect(apiGateway.delete).toHaveBeenCalledWith("/leaderboards/1");
  });

  it("bulk update status sends patch", async () => {
    /**
     * Mock PATCH response
     */
    (apiGateway.patch as jest.Mock).mockResolvedValue({});

    // Call bulk update status API
    await leaderboardApi.bulkUpdateStatus("1", "active");

    /**
     * Ensure PATCH request sends correct status payload
     */
    expect(apiGateway.patch).toHaveBeenCalledWith("/leaderboards/1", {
      status: "active",
    });
  });
});
