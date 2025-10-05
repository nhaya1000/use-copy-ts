# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Clipboard clear functionality with `clear()` method
- Enhanced error handling for clipboard operations

### Changed
- Improved TypeScript type definitions
- Updated documentation with clear function examples

## [0.1.0] - 2025-10-04

### Added
- Initial release of use-copy-ts
- TypeScript support with comprehensive type definitions
- React hook for clipboard operations (`useCopy`)
- Auto-reset functionality with configurable timeout
- Error handling with detailed error information
- Clipboard API support detection (`isSupported`)
- Success and error callbacks (`onSuccess`, `onError`)
- Manual state reset functionality (`reset()`)
- Core features:
  - `copy(text)` - Copy text to clipboard
  - `copied` - Boolean state for copy status
  - `copiedText` - Last copied text value
  - `error` - Error object if copy failed
