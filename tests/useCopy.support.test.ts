import { renderHook, act } from "@testing-library/react";
import { useCopy } from "@/useCopy";
import {
  setupClipboardMock,
  mockClipboard,
  resetClipboardMock,
} from "./mocks/clipboard";

describe("useCopy - Clipboard API Support", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetClipboardMock();
    jest.useRealTimers();
  });

  test("should detect Clipboard API support", () => {
    setupClipboardMock(true);
    const { result } = renderHook(() => useCopy());

    expect(result.current.isSupported).toBe(true);
  });

  test("should set isSupported to false when API unavailable", () => {
    setupClipboardMock(false);
    const { result } = renderHook(() => useCopy());

    expect(result.current.isSupported).toBe(false);
  });

  test("should handle non-secure context (HTTP)", () => {
    // Simulate non-secure context
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
    Object.assign(window, {
      isSecureContext: false,
    });

    const { result } = renderHook(() => useCopy());

    expect(result.current.isSupported).toBe(false);
  });

  test("should return error when copying without support", async () => {
    setupClipboardMock(false);
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy("Test text");
    });

    expect(copyResult).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      "Clipboard API is not supported"
    );
    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
  });

  test("should return error when clearing without support", async () => {
    setupClipboardMock(false);
    const { result } = renderHook(() => useCopy());

    let clearResult: boolean = false;
    await act(async () => {
      clearResult = await result.current.clear();
    });

    expect(clearResult).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      "Clipboard API is not supported"
    );
  });

  test("should handle missing navigator.clipboard", () => {
    // Remove clipboard from navigator
    Object.assign(navigator, {
      clipboard: undefined,
    });
    Object.assign(window, {
      isSecureContext: true,
    });

    const { result } = renderHook(() => useCopy());

    expect(result.current.isSupported).toBe(false);
  });
});
