/**
 * Configuration options for the useCopy hook
 */
export interface UseCopyOptions {
  /**
   * Time in milliseconds before automatically resetting the copied state
   * @default 2000
   */
  timeout?: number;

  /**
   * Callback function called when copy operation succeeds
   * @param text - The text that was successfully copied
   */
  onSuccess?: (text: string) => void;

  /**
   * Callback function called when copy operation fails
   * @param error - The error that occurred during the copy operation
   */
  onError?: (error: Error) => void;
}

/**
 * Return value interface for the useCopy hook
 */
export interface UseCopyReturn {
  /**
   * Function to copy text to clipboard
   * @param text - The text to copy
   * @returns Promise that resolves to true if successful, false otherwise
   */
  copy: (text: string) => Promise<boolean>;

  /**
   * Boolean indicating if text was recently copied (auto-resets after timeout)
   */
  copied: boolean;

  /**
   * The most recently copied text, or null if nothing has been copied
   */
  copiedText: string | null;

  /**
   * Error object if the last copy operation failed, null otherwise
   */
  error: Error | null;

  /**
   * Boolean indicating if the Clipboard API is supported in the current environment
   */
  isSupported: boolean;

  /**
   * Function to manually reset the copied state and clear any errors
   */
  reset: () => void;

  /**
   * Function to clear the clipboard contents
   * @returns Promise that resolves to true if successful, false otherwise
   */
  clear: () => Promise<boolean>;
}
