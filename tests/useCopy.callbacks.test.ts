import { renderHook, act } from "@testing-library/react";
import { useCopy } from "@/useCopy";
import {
  setupClipboardMock,
  mockClipboard,
  resetClipboardMock,
} from "./mocks/clipboard";

describe("useCopy - Callbacks", () => {
  beforeEach(() => {
    setupClipboardMock(true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetClipboardMock();
    jest.useRealTimers();
  });

  test("should call onSuccess callback with correct text", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCopy({ onSuccess }));

    const testText = "Callback test";
    await act(async () => {
      await result.current.copy(testText);
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(testText);
  });

  test("should call onError callback on failure", async () => {
    const error = new Error("Copy failed");
    mockClipboard.writeText.mockRejectedValue(error);
    const onError = jest.fn();
    const { result } = renderHook(() => useCopy({ onError }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(error);
  });

  test("should not crash when callbacks are undefined", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    // Should not throw when callbacks are undefined
    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);
  });

  test("should handle async callbacks properly", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const asyncOnSuccess = jest.fn(async (text: string) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return text;
    });
    const { result } = renderHook(() => useCopy({ onSuccess: asyncOnSuccess }));

    await act(async () => {
      await result.current.copy("Async test");
    });

    expect(asyncOnSuccess).toHaveBeenCalledWith("Async test");
    expect(result.current.copied).toBe(true);
  });

  test("should call onError callback when API is not supported", async () => {
    setupClipboardMock(false);
    const onError = jest.fn();
    const { result } = renderHook(() => useCopy({ onError }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(onError.mock.calls[0][0].message).toBe(
      "Clipboard API is not supported"
    );
  });

  test("should call onError callback when clear fails", async () => {
    setupClipboardMock(true);
    const error = new Error("Clear failed");
    mockClipboard.writeText.mockRejectedValue(error);
    const onError = jest.fn();
    const { result } = renderHook(() => useCopy({ onError }));

    await act(async () => {
      await result.current.clear();
    });

    expect(onError).toHaveBeenCalledTimes(1);
    const receivedError = onError.mock.calls[0][0];
    expect(receivedError).toBeInstanceOf(Error);
    expect(receivedError.message).toBe("Clear failed");
  });

  test("should handle multiple callbacks in sequence", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCopy({ onSuccess }));

    await act(async () => {
      await result.current.copy("First");
    });

    await act(async () => {
      await result.current.copy("Second");
    });

    expect(onSuccess).toHaveBeenCalledTimes(2);
    expect(onSuccess).toHaveBeenNthCalledWith(1, "First");
    expect(onSuccess).toHaveBeenNthCalledWith(2, "Second");
  });

  test("should not call onSuccess when copy fails", async () => {
    mockClipboard.writeText.mockRejectedValue(new Error("Failed"));
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() => useCopy({ onSuccess, onError }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
