import { renderHook, act } from "@testing-library/react";
import { useCopy } from "@/useCopy";
import {
  setupClipboardMock,
  mockClipboard,
  resetClipboardMock,
} from "./mocks/clipboard";

declare var DOMException: {
  new (message?: string, name?: string): Error;
};

describe("useCopy - Error Handling", () => {
  beforeEach(() => {
    setupClipboardMock(true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetClipboardMock();
    jest.useRealTimers();
  });

  test("should catch clipboard API errors", async () => {
    const error = new Error("Clipboard error");
    mockClipboard.writeText.mockRejectedValue(error);
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.error).toBe(error);
  });

  test("should set error state on failure", async () => {
    const errorMessage = "Failed to write";
    mockClipboard.writeText.mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
  });

  test("should recover from error on next successful copy", async () => {
    // First copy fails
    mockClipboard.writeText.mockRejectedValueOnce(new Error("First error"));
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Failed text");
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.copied).toBe(false);

    // Second copy succeeds
    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    await act(async () => {
      await result.current.copy("Success text");
    });

    expect(result.current.error).toBeNull();
    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe("Success text");
  });

  test("should handle permission denied errors", async () => {
    const permissionError = new DOMException(
      "Permission denied",
      "NotAllowedError"
    );
    mockClipboard.writeText.mockRejectedValue(permissionError);
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.error).toBe(permissionError);
    expect(result.current.error?.name).toBe("NotAllowedError");
    expect(result.current.copied).toBe(false);
  });

  test("should handle non-Error exceptions", async () => {
    // Test with string error
    mockClipboard.writeText.mockRejectedValue("String error");
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      "Failed to copy text. String error"
    );
  });

  test("should handle clear operation errors", async () => {
    const clearError = new Error("Failed to clear");
    mockClipboard.writeText.mockRejectedValue(clearError);
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.clear();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Failed to clear");
  });

  test("should reset error state with reset()", async () => {
    mockClipboard.writeText.mockRejectedValue(new Error("Copy failed"));
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.error).toBeInstanceOf(Error);

    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
  });

  test("should handle consecutive errors", async () => {
    const error1 = new Error("First error");
    const error2 = new Error("Second error");

    mockClipboard.writeText.mockRejectedValueOnce(error1);
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test 1");
    });

    expect(result.current.error).toBe(error1);

    mockClipboard.writeText.mockRejectedValueOnce(error2);

    await act(async () => {
      await result.current.copy("Test 2");
    });

    expect(result.current.error).toBe(error2);
  });

  test("should return false from copy on error", async () => {
    mockClipboard.writeText.mockRejectedValue(new Error("Failed"));
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = true;
    await act(async () => {
      copyResult = await result.current.copy("Test");
    });

    expect(copyResult).toBe(false);
  });

  test("should return false from clear on error", async () => {
    mockClipboard.writeText.mockRejectedValue(new Error("Failed"));
    const { result } = renderHook(() => useCopy());

    let clearResult: boolean = true;
    await act(async () => {
      clearResult = await result.current.clear();
    });

    expect(clearResult).toBe(false);
  });

  test("should handle non-Error exceptions in clear()", async () => {
    // Test with string error in clear operation
    mockClipboard.writeText.mockRejectedValue("String error in clear");
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.clear();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      "Failed to clear clipboard. String error in clear"
    );
  });
});
