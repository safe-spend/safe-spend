# Metro Configuration for Safe Spend

This document explains the Metro configuration setup for the Safe Spend monorepo.

## Overview

The `metro.config.js` file in the root directory provides a shared Metro configuration that can be used by all React Native applications in the monorepo.

## Features

### 🏗️ **Monorepo Support**
- Watches the entire workspace for changes
- Resolves modules from workspace packages
- Supports `@safe-spend/common` and `@safe-spend/ui` packages

### 📱 **Platform Support**
- iOS and Android platforms
- Platform-specific file extensions (`.ios.js`, `.android.js`, etc.)
- Web support for potential future use

### 🔧 **TypeScript Support**
- Full TypeScript compilation
- Source map support
- Declaration file support

### 🎨 **Asset Support**
- Images: PNG, JPG, SVG, WebP
- Videos: MP4, MOV, AVI
- Audio: MP3, WAV, AAC
- Fonts: TTF, OTF, WOFF, WOFF2
- Documents: PDF

## Usage in Apps

### For Mobile Apps

In your `apps/mobile/metro.config.js`:

```javascript
const config = require('../../metro.config.js');
module.exports = config;
```

### Custom App Configuration

If you need app-specific Metro configuration:

```javascript
const { mergeConfig } = require('@react-native/metro-config');
const baseConfig = require('../../metro.config.js');

const customConfig = {
  // Your app-specific configuration
  resolver: {
    alias: {
      '@mobile': './src',
    },
  },
};

module.exports = mergeConfig(baseConfig, customConfig);
```

## Babel Configuration

The `babel.config.js` provides:

### Module Resolution
```javascript
import { formatCurrency } from '@safe-spend/common';
import { Button } from '@safe-spend/ui';
```

### Path Aliases
```javascript
import Component from '@/components/Component';
import image from '@assets/logo.png';
```

## Development

### Starting Metro
```bash
# From mobile app directory
pnpm start

# Or with specific options
pnpm start --port 8082 --reset-cache
```

### Clearing Cache
```bash
# Clear Metro cache
pnpm start --reset-cache

# Or using npx
npx react-native start --reset-cache
```

## Troubleshooting

### Module Resolution Issues
1. Clear Metro cache: `pnpm start --reset-cache`
2. Clear node_modules: `pnpm clean && pnpm install`
3. Restart Metro bundler

### TypeScript Issues
1. Rebuild packages: `pnpm build`
2. Check TypeScript configuration
3. Verify package references in workspace

### Performance Issues
1. Reduce `maxWorkers` in metro.config.js
2. Use `--reset-cache` flag
3. Check `watchFolders` configuration

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `projectRoot` | Root directory of the project | `__dirname` |
| `watchFolders` | Directories to watch for changes | `[workspaceRoot, packages]` |
| `maxWorkers` | Maximum number of worker processes | `2` |
| `server.port` | Metro server port | `8081` |
| `resetCache` | Reset cache on startup | `false` |

## Best Practices

1. **Keep the config minimal** - Only add what's necessary
2. **Use workspace packages** - Leverage the monorepo structure
3. **Platform-specific files** - Use `.ios.js` and `.android.js` when needed
4. **Cache management** - Clear cache when having issues
5. **Watch folders** - Only watch necessary directories for performance
