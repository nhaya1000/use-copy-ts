/**
 * Mock utilities for Clipboard API testing
 */

export const mockClipboard = {
  writeText: jest.fn(),
  readText: jest.fn(),
};

/**
 * Setup Clipboard API mock for testing
 * @param supported - Whether Clipboard API should be supported
 */
export const setupClipboardMock = (supported = true): void => {
  if (supported) {
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "isSecureContext", {
      value: true,
      writable: true,
      configurable: true,
    });
  } else {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "isSecureContext", {
      value: false,
      writable: true,
      configurable: true,
    });
  }
};

/**
 * Reset all clipboard mock functions
 */
export const resetClipboardMock = (): void => {
  mockClipboard.writeText.mockClear();
  mockClipboard.readText.mockClear();
};

/**
 * Mock successful clipboard write
 */
export const mockClipboardSuccess = (): void => {
  mockClipboard.writeText.mockResolvedValue(undefined);
};

/**
 * Mock clipboard write failure
 * @param error - Error message or Error object
 */
export const mockClipboardError = (
  error: string | Error = "Failed to write to clipboard"
): void => {
  const errorObj = typeof error === "string" ? new Error(error) : error;
  mockClipboard.writeText.mockRejectedValue(errorObj);
};
