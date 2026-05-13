import { renderHook, waitFor } from "@testing-library/react";
import { useWheels } from "../useWheelManagement";
import { wheelApi } from "@/features/Wheel/api/wheel.api";
import { createWrapper } from "@/shared/test/test-utils";

jest.mock("@/features/wheel/api/wheel.api", () => ({
  wheelApi: {
    getList: jest.fn(),
  },
}));

describe("useWheels", () => {
  const { wrapper } = createWrapper();

  it("should fetch wheels", async () => {
    const mockData = { data: [], total: 0 };

    (wheelApi.getList as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(() => useWheels(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
});
