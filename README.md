# Safe Spend

A cross-platform financial management application built with React Native and Tauri.

## 🗂️ Project Structure

```
safe-spend/
├── apps/
│   ├── mobile/         # React Native app (iOS & Android)
│   └── desktop/        # Tauri app (Windows & macOS)
│
├── packages/
│   ├── core-ui/        # Shared UI components (React Native Web + React Native + Tauri UI bindings)
│   └── framework/      # Shared business logic, constants, data models, etc.
```

## 📦 Package Information

| Folder | Package Name | Description |
|--------|--------------|-------------|
| `apps/mobile` | `@safe-spend/mobile` | React Native mobile application |
| `apps/desktop` | `@safe-spend/desktop` | Tauri desktop application |
| `packages/core-ui` | `@safe-spend/core-ui` | Shared UI components |
| `packages/framework` | `@safe-spend/framework` | Shared business logic and utilities |

## 🔗 Local Development Setup

Each folder is an independent Node.js project with its own `package.json` and `node_modules`. The packages use local file dependencies for internal linking.

### Installation

```bash
# Install dependencies for all packages
npm run install:all
```

### Development

```bash
# Run all packages in development mode
npm run dev

# Or run individual packages
cd apps/mobile && npm start
cd apps/desktop && npm run dev
cd packages/core-ui && npm run dev
cd packages/framework && npm run dev
```

### Building

```bash
# Build all packages
npm run build
```

## 🏗️ Architecture

- **Framework Package**: Contains shared business logic, data models, constants, and utilities
- **Core UI Package**: Cross-platform UI components that work with React Native, React Native Web, and Tauri
- **Mobile App**: React Native application for iOS and Android
- **Desktop App**: Tauri application for Windows and macOS

## 📱 Platform Support

- **Mobile**: iOS, Android (React Native)
- **Desktop**: Windows, macOS (Tauri)