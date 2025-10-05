# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`use-copy-ts` is a type-safe React hook library for clipboard operations. The library provides a single hook (`useCopy`) that wraps the browser Clipboard API with TypeScript support, auto-reset functionality, error handling, and callbacks.

## Core Architecture

### Source Structure
- **`src/useCopy.ts`**: Main hook implementation containing all clipboard logic
- **`src/types.ts`**: TypeScript type definitions for hook options and return values
- **`src/index.ts`**: Public API exports

### Key Design Patterns
- **Single Hook Pattern**: All functionality exposed through one `useCopy` hook
- **State Management**: Uses React's `useState` for `copied`, `copiedText`, and `error` states
- **Ref-based Cleanup**: `useRef` manages timeout IDs for auto-reset functionality to prevent memory leaks
- **Callback System**: Optional `onSuccess` and `onError` callbacks for custom handling
- **API Support Detection**: Checks `navigator.clipboard` and `window.isSecureContext` before operations

### Hook Return Interface
The hook returns an object with:
- `copy(text: string)`: Async function to copy text (returns Promise<boolean>)
- `clear()`: Async function to clear clipboard (returns Promise<boolean>)
- `reset()`: Sync function to manually reset all state
- `copied`: Boolean flag (auto-resets after timeout)
- `copiedText`: String of last copied text (or null)
- `error`: Error object (or null)
- `isSupported`: Boolean indicating Clipboard API availability

## Development Commands

### Build & Development
```bash
npm run dev          # Watch mode TypeScript compilation
npm run build        # Production build using Vite (outputs ESM and CJS to dist/)
npm run typecheck    # TypeScript type checking without emitting files
```

### Code Quality
```bash
npm run lint         # ESLint check on src/ and tests/
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
npm run check        # Run typecheck + lint + format:check (pre-commit validation)
```

### Testing
```bash
npm run test              # Run Jest test suite
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

### Publishing
```bash
npm run prepublishOnly   # Runs automatically before publish: check + build + test
```

## Build Configuration

### Vite Build (vite.config.ts)
- **Library Mode**: Builds as library with dual format output
- **Entry Point**: `src/index.ts`
- **Formats**: ES modules (`index.esm.js`) and CommonJS (`index.js`)
- **Type Declarations**: Generated via `vite-plugin-dts` with rollup types
- **External**: React is marked as external (peer dependency)

### TypeScript (tsconfig.json)
- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx transform (React 17+ automatic runtime)
- **Strict Mode**: Enabled for type safety
- **Path Alias**: `@/*` maps to `src/*` (use for imports if needed)
- **Declaration**: Enabled with source maps and declaration maps

## Testing Strategy

Tests should be placed in `tests/` directory. Currently the test infrastructure is set up (`tests/setup.ts`) but no test files exist yet.

When adding tests:
- Use Jest as the test runner
- Test clipboard API availability detection (`isSupported`)
- Mock `navigator.clipboard.writeText()` for copy operations
- Test auto-reset timeout functionality with Jest fake timers
- Test error handling when Clipboard API is unavailable
- Test callback invocation (`onSuccess`, `onError`)

## Browser Requirements

The hook requires:
- **Secure Context**: HTTPS or localhost (enforced by `window.isSecureContext` check)
- **Clipboard API**: Modern browsers (Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+)
- Always check `isSupported` before showing clipboard UI to users

## Publishing Notes

- **Dual Package**: Exports both ESM and CJS formats
- **Peer Dependency**: React 16.8+ (hooks support) to 19.x
- **Type Definitions**: Bundled `.d.ts` files generated from source
- **Package Exports**: Modern `exports` field in package.json for proper module resolution
- **Pre-publish Validation**: `prepublishOnly` script runs all checks before npm publish

## Code Style

- **ESLint**: Flat config format (`eslint.config.mjs`) with TypeScript, React, and React Hooks plugins
- **Prettier**: Used for formatting, integrated with ESLint via `eslint-config-prettier`
- **Import Organization**: All imports at top, React imports first, then types, then utilities
- **Naming**: camelCase for functions/variables, PascalCase for types/interfaces
- **Documentation**: JSDoc comments on all exported functions and types
