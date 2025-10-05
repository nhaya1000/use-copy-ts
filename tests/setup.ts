// Test setup file
// This file runs before each test suite

import "@testing-library/jest-dom";

// Custom matchers for clipboard testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWithText(text: string): R;
    }
  }
}

expect.extend({
  toHaveBeenCalledWithText(
    received: jest.Mock,
    text: string
  ): jest.CustomMatcherResult {
    const pass = received.mock.calls.some((call) => call[0] === text);
    return {
      pass,
      message: () =>
        pass
          ? `Expected mock not to be called with "${text}"`
          : `Expected mock to be called with "${text}", but it was called with: ${JSON.stringify(
              received.mock.calls
            )}`,
    };
  },
});

// Global cleanup
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

export {};
