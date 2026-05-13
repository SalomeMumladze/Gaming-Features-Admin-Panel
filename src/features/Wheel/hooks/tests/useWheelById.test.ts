import { renderHook, waitFor } from "@testing-library/react";
import { useWheelById } from "../useWheelManagement";
import { createWrapper } from "@/shared/test/test-utils";
import { wheelApi } from "@/features/Wheel/api/wheel.api";

jest.mock("@/features/wheel/api/wheel.api", () => ({
  wheelApi: {
    getById: jest.fn(),
  },
}));

describe("useWheelById", () => {
  const { wrapper } = createWrapper();

  it("should fetch wheel by id", async () => {
    const mockData = { id: "1" };

    (wheelApi.getById as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(() => useWheelById("1"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it("should not run if id is missing", () => {
    const { result } = renderHook(() => useWheelById(undefined), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});
