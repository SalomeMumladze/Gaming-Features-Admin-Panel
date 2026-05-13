import { apiGateway } from "@/shared/api/httpClient";
import { wheelApi } from "../wheel.api";

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

describe("wheelApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getList", () => {
    it("should call GET /wheels with query params", async () => {
      mockedApiGateway.get.mockResolvedValue({
        data: [],
      });

      const params = {
        _page: 1,
        _per_page: 10,
      };

      await wheelApi.getList(params);

      expect(mockedApiGateway.get).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.get).toHaveBeenCalledWith("/wheels", {
        params,
      });
    });
  });

  describe("getById", () => {
    it("should call GET /wheels/:id", async () => {
      mockedApiGateway.get.mockResolvedValue({
        data: {},
      });

      await wheelApi.getById("123");

      expect(mockedApiGateway.get).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.get).toHaveBeenCalledWith("/wheels/123");
    });
  });

  describe("create", () => {
    it("should call POST /wheels with payload", async () => {
      mockedApiGateway.post.mockResolvedValue({
        data: {},
      });

      const payload = {
        name: "Summer Raffle",
      };

      await wheelApi.create(payload as any);

      expect(mockedApiGateway.post).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.post).toHaveBeenCalledWith("/wheels", payload);
    });
  });

  describe("update", () => {
    it("should call PUT /wheels/:id with payload", async () => {
      mockedApiGateway.put.mockResolvedValue({
        data: {},
      });

      const payload = {
        name: "Updated Raffle",
      };

      await wheelApi.update("1", payload as any);

      expect(mockedApiGateway.put).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.put).toHaveBeenCalledWith("/wheels/1", payload);
    });
  });

  describe("delete", () => {
    it("should call DELETE /wheels/:id", async () => {
      mockedApiGateway.delete.mockResolvedValue({
        data: {},
      });

      await wheelApi.delete("1");

      expect(mockedApiGateway.delete).toHaveBeenCalledTimes(1);

      expect(mockedApiGateway.delete).toHaveBeenCalledWith("/wheels/1");
    });
  });
});
