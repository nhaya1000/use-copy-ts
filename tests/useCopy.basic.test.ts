import { renderHook, act } from "@testing-library/react";
import { useCopy } from "@/useCopy";
import {
  setupClipboardMock,
  mockClipboard,
  resetClipboardMock,
} from "./mocks/clipboard";

describe("useCopy - Basic Functionality", () => {
  beforeEach(() => {
    setupClipboardMock(true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetClipboardMock();
    jest.useRealTimers();
  });

  test("should initialize with default state", () => {
    const { result } = renderHook(() => useCopy());

    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isSupported).toBe(true);
  });

  test("should copy text successfully", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy("Hello World");
    });

    expect(copyResult).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith("Hello World");
  });

  test("should set copied flag to true after copy", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test text");
    });

    expect(result.current.copied).toBe(true);
  });

  test("should store copied text in copiedText state", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    const testText = "Stored text";
    await act(async () => {
      await result.current.copy(testText);
    });

    expect(result.current.copiedText).toBe(testText);
  });

  test("should reset copied flag after timeout", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 2000 }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBe("Test"); // copiedText should remain
  });

  test("should reset state manually with reset()", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe("Test");

    act(() => {
      result.current.reset();
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test("should clear clipboard with clear()", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    // First copy some text
    await act(async () => {
      await result.current.copy("Initial text");
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe("Initial text");

    // Then clear clipboard
    let clearResult: boolean = false;
    await act(async () => {
      clearResult = await result.current.clear();
    });

    expect(clearResult).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith("");
    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
  });
});
