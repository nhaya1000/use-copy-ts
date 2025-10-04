# Contributing to use-copy-ts

We welcome contributions to use-copy-ts! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a new branch for your feature/fix: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install dependencies
npm install

# Run development mode (watch TypeScript compilation)
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run all checks (recommended before committing)
npm run check
```

## Code Style

- Use TypeScript for all code
- Follow the existing code style (enforced by ESLint and Prettier)
- Add appropriate JSDoc comments for public APIs
- Write tests for new functionality
- Ensure all tests pass before submitting

## Testing

- Write unit tests for new features using Jest
- Ensure all existing tests continue to pass
- Aim for good test coverage

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Make sure all checks pass: `npm run check`
5. Create a clear, descriptive pull request

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `test: add tests`
- `refactor: improve code structure`

## Issues

When reporting issues, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (browser, React version, etc.)

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

Thank you for contributing!