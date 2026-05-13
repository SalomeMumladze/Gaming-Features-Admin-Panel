import { apiGateway } from "@/shared/api/httpClient";
import { raffleApi } from "../raffle.api";

jest.mock("@/shared/api/httpClient", () => ({
  apiGateway: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockedApiGateway = apiGateway as jest.Mocked<typeof apiGateway>;

describe("raffleApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getList", () => {
    it("should call GET /raffles with query params", async () => {
      mockedApiGateway.get.mockResolvedValue({
        data: [],
      });

      const params = {
        _page: 1,
        _per_page: 10,
      };

      await raffleApi.getList(params);

      expect(mockedApiGateway.get).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.get).toHaveBeenCalledWith("/raffles", {
        params,
      });
    });
  });

  describe("getById", () => {
    it("should call GET /raffles/:id", async () => {
      mockedApiGateway.get.mockResolvedValue({
        data: {},
      });

      await raffleApi.getById("123");

      expect(mockedApiGateway.get).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.get).toHaveBeenCalledWith("/raffles/123");
    });
  });

  describe("create", () => {
    it("should call POST /raffles with payload", async () => {
      mockedApiGateway.post.mockResolvedValue({
        data: {},
      });

      const payload = {
        name: "Summer Raffle",
      };

      await raffleApi.create(payload as any);

      expect(mockedApiGateway.post).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.post).toHaveBeenCalledWith("/raffles", payload);
    });
  });

  describe("update", () => {
    it("should call PUT /raffles/:id with payload", async () => {
      mockedApiGateway.put.mockResolvedValue({
        data: {},
      });

      const payload = {
        name: "Updated Raffle",
      };

      await raffleApi.update("1", payload as any);

      expect(mockedApiGateway.put).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.put).toHaveBeenCalledWith("/raffles/1", payload);
    });
  });

  describe("delete", () => {
    it("should call DELETE /raffles/:id", async () => {
      mockedApiGateway.delete.mockResolvedValue({
        data: {},
      });

      await raffleApi.delete("1");

      expect(mockedApiGateway.delete).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.delete).toHaveBeenCalledWith("/raffles/1");
    });
  });

  describe("bulkUpdateStatus", () => {
    it("should call PATCH /raffles/:id with status payload", async () => {
      mockedApiGateway.patch.mockResolvedValue({
        data: {},
      });

      await raffleApi.bulkUpdateStatus("1", "active");

      expect(mockedApiGateway.patch).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.patch).toHaveBeenCalledWith("/raffles/1", {
        status: "active",
      });
    });
  });
});
