import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateWheel } from "../useWheelManagement";
import { wheelApi } from "@/features/Wheel/api/wheel.api";
import { createWrapper } from "@/shared/test/test-utils";
import { baseWheelData } from "@/features/Wheel/tests/wheelTestUtils";

jest.mock("@/features/Wheel/api/Wheel.api", () => ({
  wheelApi: {
    create: jest.fn(),
  },
}));

describe("useCreateWheel", () => {
  const { wrapper } = createWrapper();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create raffle successfully", async () => {
    const mockResponse = { id: "1", title: "Test raffle" };

    (wheelApi.create as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const { result } = renderHook(() => useCreateWheel(), {
      wrapper,
    });

    const payload = baseWheelData();

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(wheelApi.create).toHaveBeenCalled();
  });

  it("should handle error case", async () => {
    (wheelApi.create as jest.Mock).mockRejectedValue(
      new Error("Create failed"),
    );

    const { result } = renderHook(() => useCreateWheel(), {
      wrapper,
    });

    const payload = baseWheelData();

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
