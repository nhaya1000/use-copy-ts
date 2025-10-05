import { renderHook, act } from "@testing-library/react";
import { useCopy } from "@/useCopy";
import {
  setupClipboardMock,
  mockClipboard,
  resetClipboardMock,
} from "./mocks/clipboard";

describe("useCopy - Edge Cases", () => {
  beforeEach(() => {
    setupClipboardMock(true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetClipboardMock();
    jest.useRealTimers();
  });

  test("should handle empty string copy", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy("");
    });

    expect(copyResult).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith("");
    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe("");
  });

  test("should handle very long text copy", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const longText = "A".repeat(10000);
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy(longText);
    });

    expect(copyResult).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith(longText);
    expect(result.current.copiedText).toBe(longText);
  });

  test("should handle special characters and emojis", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const specialText =
      '🚀 Special chars: @#$%^&*()_+{}|:"<>? 日本語 中文 한국어';
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy(specialText);
    });

    expect(copyResult).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith(specialText);
    expect(result.current.copiedText).toBe(specialText);
  });

  test("should handle rapid consecutive copies", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 0 }));

    // Rapid fire 10 consecutive copies
    const copies = Array.from({ length: 10 }, (_, i) => `Copy ${i}`);

    for (const text of copies) {
      await act(async () => {
        await result.current.copy(text);
      });
    }

    expect(result.current.copiedText).toBe("Copy 9");
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(10);
  });

  test("should handle clear() when nothing is copied", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    let clearResult: boolean = false;
    await act(async () => {
      clearResult = await result.current.clear();
    });

    expect(clearResult).toBe(true);
    expect(mockClipboard.writeText).toHaveBeenCalledWith("");
  });

  test("should handle multiline text", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const multilineText = `Line 1
Line 2
Line 3
Line 4`;
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy(multilineText);
    });

    expect(copyResult).toBe(true);
    expect(result.current.copiedText).toBe(multilineText);
  });

  test("should handle text with only whitespace", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const whitespaceText = "   \t\n   ";
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy(whitespaceText);
    });

    expect(copyResult).toBe(true);
    expect(result.current.copiedText).toBe(whitespaceText);
  });

  test("should handle HTML-like strings", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const htmlText = '<div class="test">Hello <strong>World</strong></div>';
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy(htmlText);
    });

    expect(copyResult).toBe(true);
    expect(result.current.copiedText).toBe(htmlText);
  });

  test("should handle JSON strings", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const jsonText = JSON.stringify({
      key: "value",
      nested: { data: [1, 2, 3] },
    });
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy(jsonText);
    });

    expect(copyResult).toBe(true);
    expect(result.current.copiedText).toBe(jsonText);
  });

  test("should handle text with escape sequences", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const escapeText = "Line1\\nLine2\\tTabbed\\r\\nWindows";
    const { result } = renderHook(() => useCopy());

    let copyResult: boolean = false;
    await act(async () => {
      copyResult = await result.current.copy(escapeText);
    });

    expect(copyResult).toBe(true);
    expect(result.current.copiedText).toBe(escapeText);
  });

  test("should handle null-ish coercion to string", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy());

    // TypeScript won't allow this directly, but testing runtime behavior
    const undefinedAsString = String(undefined);
    const nullAsString = String(null);

    await act(async () => {
      await result.current.copy(undefinedAsString);
    });

    expect(result.current.copiedText).toBe("undefined");

    await act(async () => {
      await result.current.copy(nullAsString);
    });

    expect(result.current.copiedText).toBe("null");
  });

  test("should handle very rapid copy and clear operations", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopy({ timeout: 0 }));

    // Alternate between copy and clear rapidly
    await act(async () => {
      await result.current.copy("Text 1");
    });

    await act(async () => {
      await result.current.clear();
    });

    await act(async () => {
      await result.current.copy("Text 2");
    });

    await act(async () => {
      await result.current.clear();
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
  });

  test("should handle copy with negative timeout as default", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    // Negative timeout should be treated as 0 or use default behavior
    const { result } = renderHook(() => useCopy({ timeout: -1 }));

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);
  });

  test("should handle extremely large timeout values", async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCopy({ timeout: Number.MAX_SAFE_INTEGER })
    );

    await act(async () => {
      await result.current.copy("Test");
    });

    expect(result.current.copied).toBe(true);
  });
});
