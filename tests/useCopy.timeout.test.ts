import { renderHook, act } from "@testing-library/react";
import { useCopy } from "@/useCopy";
import {
  setupClipboardMock,
  mockClipboard,
  resetClipboardMock,
} from "./mocks/clipboard";

describe("useCopy - Timeout Functionality", () => {
  beforeEach(() => {
    setupClipboardMock(true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetClipboardMock();
    jest.useRealTimers();
  });

  test("should apply custom timeout value", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const customTimeout = 3000;
    const { result } = renderHook(() => useCopy({ timeout: customTimeout }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);

    // Advance by less than timeout
    act(() => {
      jest.advanceTimersByTime(2999);
    });

    expect(result.current.copied).toBe(true);

    // Advance to complete timeout
    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.copied).toBe(false);
  });

  test("should disable auto-reset when timeout is 0", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 0 }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);

    // Advance time significantly
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Should still be copied (no auto-reset)
    expect(result.current.copied).toBe(true);
  });

  test("should clear existing timer on consecutive copies", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const timeout = 2000;
    const { result } = renderHook(() => useCopy({ timeout }));

    // First copy
    await act(async () => {
      await result.current.copy("First");
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe("First");

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Second copy before first timeout completes
    await act(async () => {
      await result.current.copy("Second");
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe("Second");

    // Advance by remaining time from first copy (should not reset)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(true); // Still copied

    // Advance by full timeout from second copy
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false); // Now reset
  });

  test("should cleanup timer on unmount", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result, unmount } = renderHook(() => useCopy({ timeout: 2000 }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);

    // Unmount before timeout
    unmount();

    // Advance time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // No errors should occur (timer was cleaned up)
  });

  test("should handle reset() clearing active timeout", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 2000 }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);

    // Reset before timeout
    act(() => {
      result.current.reset();
    });

    expect(result.current.copied).toBe(false);

    // Advance time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should remain false (timeout was cleared)
    expect(result.current.copied).toBe(false);
  });

  test("should handle clear() clearing active timeout", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 2000 }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);

    // Clear before timeout
    await act(async () => {
      await result.current.clear();
    });

    expect(result.current.copied).toBe(false);

    // Advance time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should remain false (timeout was cleared)
    expect(result.current.copied).toBe(false);
  });

  test("should handle rapid consecutive copies with timeout", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 1000 }));

    // Rapid fire 5 copies
    await act(async () => {
      await result.current.copy("Copy 1");
    });
    await act(async () => {
      await result.current.copy("Copy 2");
    });
    await act(async () => {
      await result.current.copy("Copy 3");
    });
    await act(async () => {
      await result.current.copy("Copy 4");
    });
    await act(async () => {
      await result.current.copy("Copy 5");
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe("Copy 5");

    // Advance by timeout duration
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
  });

  test("should preserve copiedText after timeout reset", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 1000 }));

    const testText = "Persistent text";
    await act(async () => {
      await result.current.copy(testText);
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe(testText);

    // Advance time to trigger auto-reset
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBe(testText); // Should still be present
  });
});
