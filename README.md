# use-copy-ts



[![npm version](https://badge.fury.io/js/use-copy-ts.svg)](https://badge.fury.io/js/use-copy-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)


Type-safe React hook for clipboard operations with enhanced features.```bash

## Features```

- 🔒 **Type-safe**: Full TypeScript support with comprehensive type definitions## Quick Start
- 📋 **Modern Clipboard API**: Uses the latest Clipboard API for secure operations```typescript
- ⏱️ **Auto-reset**: Configurable timeout to automatically reset copied stateimport { useCopy } from 'use-copy-ts';
- 🎯 **Error Handling**: Detailed error information with custom error callbacks
- 🔍 **Support Detection**: Automatic detection of Clipboard API supportfunction MyComponent() {
- 🎨 **Flexible**: Success and error callbacks for custom handling  const { copy, copied } = useCopy();
- 🧹 **Clean**: Manual state reset functionality


## Installation   

```bash 
npm install use-copy-ts
```


## Quick Start

```typescript
import { useCopy } from 'use-copy-ts';

function MyComponent() {
  const { copy, copied } = useCopy();

  return (
    <button onClick={() => copy('Hello World')}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

## API Reference

### `useCopy(options?)`

#### Parameters

- `options` (optional): Configuration object

```typescript
interface UseCopyOptions {
  timeout?: number; // Auto-reset timeout in milliseconds (default: 2000)
  onSuccess?: (text: string) => void; // Success callback
  onError?: (error: Error) => void; // Error callback
}
```

#### Returns

```typescript
interface UseCopyReturn {
  copy: (text: string) => Promise<boolean>; // Copy function
  copied: boolean; // Whether text was recently copied
  copiedText: string | null; // Most recently copied text
  error: Error | null; // Last error, if any
  isSupported: boolean; // Whether Clipboard API is supported
  reset: () => void; // Manual reset function
  clear: () => Promise<boolean>; // Clear clipboard contents
}
```



## Examples

### Basic Usage

```typescript
import { useCopy } from 'use-copy-ts';

function CopyButton() {
  const { copy, copied, error } = useCopy();

  const handleCopy = () => {
    copy('Text to copy');
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <button onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy Text'}
    </button>
  );
}
```

### Advanced Usage with Callbacks

```typescript
import { useCopy } from 'use-copy-ts';

function AdvancedCopyButton() {
  const { copy, copied, copiedText, isSupported } = useCopy({
    timeout: 3000, // Reset after 3 seconds
    onSuccess: (text) => {
      console.log('Successfully copied:', text);
    },
    onError: (error) => {
      console.error('Copy failed:', error);
    }
  });

  if (!isSupported) {
    return <div>Clipboard not supported in this browser</div>;
  }

  return (
    <div>
      <button onClick={() => copy('Hello World')}>
        Copy Text
      </button>
      {copied && <p>Copied: {copiedText}</p>}
    </div>
  );
}
```

### Copy Code Snippet

```typescript
import { useCopy } from 'use-copy-ts';

function CodeBlock({ code }: { code: string }) {
  const { copy, copied, reset } = useCopy({
    timeout: 2000,
    onSuccess: () => {
      // Show toast notification
    }
  });

  return (
    <div className="code-block">
      <pre>{code}</pre>
      <div className="code-actions">
        <button onClick={() => copy(code)}>
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
```

### Share URL

```typescript
import { useCopy } from 'use-copy-ts';

function ShareButton() {
  const { copy, copied } = useCopy({
    onSuccess: () => {
      // Analytics tracking
      analytics.track('url_shared');
    }
  });

  const shareCurrentPage = () => {
    copy(window.location.href);
  };

  return (
    <button onClick={shareCurrentPage}>
      {copied ? 'URL Copied!' : 'Share Page'}
    </button>
  );
}
```

### Clear Clipboard

```typescript
import { useCopy } from 'use-copy-ts';

function SecureNoteEditor() {
  const { copy, clear, copied } = useCopy({
    onSuccess: () => {
      // Auto-clear clipboard after 30 seconds for security
      setTimeout(() => {
        clear();
      }, 30000);
    }
  });

  return (
    <div>
      <button onClick={() => copy('Sensitive information')}>
        Copy Note
      </button>
      <button onClick={clear}>
        Clear Clipboard
      </button>
      {copied && <p>Copied! Will auto-clear in 30s</p>}
    </div>
  );
}
```

## Browser Support

This hook uses the modern [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard) which requires:

- **HTTPS** (or localhost for development)
- **Modern browsers** that support the Clipboard API

### Supported Browsers

- Chrome 66+
- Firefox 63+
- Safari 13.1+
- Edge 79+

The hook automatically detects support via the `isSupported` property.

## Requirements

- React 16.8+ (hooks support)
- TypeScript 4.0+ (if using TypeScript)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [nhaya1000](https://github.com/nhaya1000)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about changes in each version.
