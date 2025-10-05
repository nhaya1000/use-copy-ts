/**
 * Test helper functions for useCopy hook testing
 */

import { renderHook } from "@testing-library/react";
import type { RenderHookResult } from "@testing-library/react";
import { act } from "react";
import { useCopy } from "@/useCopy";
import type { UseCopyOptions, UseCopyReturn } from "@/types";

/**
 * Render useCopy hook with optional configuration
 * @param options - Hook options
 * @returns Rendered hook result
 */
export const renderUseCopy = (
  options?: UseCopyOptions
): RenderHookResult<UseCopyReturn, UseCopyOptions> => {
  return renderHook(() => useCopy(options));
};

/**
 * Wait for specified timeout using fake timers
 * @param ms - Milliseconds to advance
 */
export const waitForTimeout = (ms: number): void => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};

/**
 * Execute async function and wait for state updates
 * @param callback - Async callback to execute
 */
export const actAsync = async (
  callback: () => Promise<void>
): Promise<void> => {
  await act(async () => {
    await callback();
  });
};

/**
 * Create a long text string for testing
 * @param length - Length of the string
 * @returns Generated text
 */
export const createLongText = (length: number): string => {
  return "a".repeat(length);
};

/**
 * Test data for various scenarios
 */
export const testData = {
  simpleText: "Hello World",
  emptyText: "",
  longText: createLongText(10000),
  specialChars: "!@#$%^&*()_+-=[]{}|;:'\",.<>?/~`",
  emoji: "👋🌍✨🚀",
  multiline: "Line 1\nLine 2\nLine 3",
  url: "https://example.com/test?param=value",
};
