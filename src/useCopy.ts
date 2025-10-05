/**
 * @fileoverview React hook for clipboard operations with TypeScript support
 * @author nhaya1000
 * @license MIT
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { UseCopyOptions, UseCopyReturn } from "./types";

/**
 * React hook for copying text to clipboard with enhanced features
 *
 * Features:
 * - Type-safe clipboard operations
 * - Auto-reset copied state after configurable timeout
 * - Error handling with detailed error information
 * - Success/error callbacks
 * - Clipboard API support detection
 * - Manual state reset functionality
 * - Clipboard clear functionality
 *
 * @param options - Configuration options for the hook
 * @param options.timeout - Time in milliseconds before auto-reset (default: 2000)
 * @param options.onSuccess - Callback called on successful copy
 * @param options.onError - Callback called on copy error
 *
 * @returns Object containing copy function and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { copy, copied, error, isSupported, clear } = useCopy({
 *     timeout: 3000,
 *     onSuccess: (text) => console.log('Copied:', text),
 *     onError: (err) => console.error('Copy failed:', err)
 *   });
 *
 *   if (!isSupported) {
 *     return <div>Clipboard not supported</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={() => copy('Hello World')}>
 *         {copied ? 'Copied!' : 'Copy Text'}
 *       </button>
 *       <button onClick={() => clear()}>
 *         Clear Clipboard
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCopy(options: UseCopyOptions = {}): UseCopyReturn {
  const { timeout = 2000, onSuccess, onError } = options;

  // State to track if text was recently copied
  const [copied, setCopied] = useState(false);
  // Store the most recently copied text
  const [copiedText, setCopiedText] = useState<string | null>(null);
  // Store any error that occurred during copy operation
  const [error, setError] = useState<Error | null>(null);
  // Reference to timeout for auto-reset functionality
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Check if Clipboard API is supported in the current environment
  // Requires: navigator.clipboard and secure context (HTTPS or localhost)
  const isSupported =
    typeof navigator !== "undefined" &&
    !!navigator.clipboard &&
    !!window.isSecureContext;

  // Function to reset all state and clear any pending timeouts
  const reset = useCallback(() => {
    setCopied(false);
    setCopiedText(null);
    setError(null);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  // Function to clear clipboard contents
  const clear = useCallback(async (): Promise<boolean> => {
    // Early return if Clipboard API is not supported
    if (!isSupported) {
      const err = new Error("Clipboard API is not supported");
      setError(err);
      onError?.(err);
      return false;
    }

    try {
      // Clear clipboard by writing empty string
      await navigator.clipboard.writeText("");

      // Reset all state
      reset();

      return true;
    } catch (err) {
      // Handle clear operation errors
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to clear clipboard. " + String(err));
      setError(error);
      onError?.(error);
      return false;
    }
  }, [isSupported, onError, reset]);

  // Main copy function that handles clipboard operations
  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Early return if Clipboard API is not supported
      if (!isSupported) {
        const err = new Error("Clipboard API is not supported");
        setError(err);
        onError?.(err);
        return false;
      }

      try {
        // Attempt to write text to clipboard
        await navigator.clipboard.writeText(text);

        // Update state on successful copy
        setCopied(true);
        setCopiedText(text);
        setError(null);
        onSuccess?.(text);

        // Set timeout to auto-reset copied state
        if (timeout > 0) {
          if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
          }
          timeoutIdRef.current = setTimeout(() => {
            setCopied(false);
          }, timeout);
        }

        return true;
      } catch (err) {
        // Handle copy operation errors
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to copy text. " + String(err));
        setError(error);
        setCopied(false);
        setCopiedText(null);
        onError?.(error);
        return false;
      }
    },
    [isSupported, timeout, onSuccess, onError]
  );

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return {
    copy,
    copied,
    copiedText,
    error,
    isSupported,
    reset,
    clear,
  };
}
