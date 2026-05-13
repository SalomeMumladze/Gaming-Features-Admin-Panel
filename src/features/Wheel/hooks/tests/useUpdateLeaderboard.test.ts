import { renderHook, act, waitFor } from "@testing-library/react";
import { useUpdateWheel } from "../useWheelManagement";
import { wheelApi } from "@/features/Wheel/api/wheel.api";
import { createWrapper } from "@/shared/test/test-utils";
import { baseWheelData } from "@/features/Wheel/tests/wheelTestUtils";

jest.mock("@/features/Wheel/api/Wheel.api", () => ({
  wheelApi: {
    update: jest.fn(),
  },
}));

describe("useUpdateWheel", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update raffle successfully", async () => {
    const mockResponse = { id: "1", title: "Test raffle" };

    (wheelApi.update as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useUpdateWheel(), {
      wrapper,
    });

    const payload = {
      id: "1",
      ...baseWheelData(),
    };

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(wheelApi.update).toHaveBeenCalled();
  });

  it("should handle error case", async () => {
    (wheelApi.update as jest.Mock).mockRejectedValue(
      new Error("Update failed"),
    );

    const { result } = renderHook(() => useUpdateWheel(), {
      wrapper,
    });

    const payload = {
      id: "1",
      ...baseWheelData(),
    };

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
