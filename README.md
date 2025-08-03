# 💸 Safe Spend – Monorepo Setup Guide

**Safe Spend** is a privacy-first, cross-platform personal finance manager for mobile and desktop, built using React Native (CLI) and Tauri. This monorepo is structured for long-term maintainability, modularity, and performance.

---

## 🛠️ Quick Setup Scripts

Automated setup scripts are available to help configure your development environment:

```powershell
# Windows Desktop (Tauri)
.\scripts\setup-windows.ps1

# Windows Android (React Native)
.\scripts\setup-android.ps1
```

```bash
# macOS Desktop (Tauri) 
./scripts/setup-macos.sh

# Android Mobile (React Native - Linux/macOS)
./scripts/setup-android.sh

# iOS Mobile (React Native - macOS only)
./scripts/setup-ios.sh
```

---

## 📁 Project Structure

The monorepo uses [`pnpm`](https://pnpm.io) Workspaces with [`Turborepo`](https://turbo.build/repo) for orchestrating builds.

```
safe-spend/
├── apps/
│   ├── mobile/         # React Native CLI app for Android & iOS
│   │   ├── android/    # Android-specific code & config
│   │   ├── ios/        # iOS-specific code & config
│   │   └── metro.config.js  # Metro bundler config for mobile
│   └── desktop/        # Tauri + React frontend app for Windows & macOS
│       ├── windows/    # Windows-specific code & config
│       └── macos/      # macOS-specific code & config
├── packages/
│   ├── common/         # Shared models, utils, types
│   └── ui/             # (Planned) Shared UI components across apps
├── scripts/            # Setup scripts for each platform
├── node_modules/
├── package.json        # Root workspace entry
├── tsconfig.json       # Base TypeScript config
├── turbo.json          # Turborepo pipeline config
└── pnpm-workspace.yaml # Defines the workspace boundaries
```

---

## ✅ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/safe-spend.git
cd safe-spend
```

### 2. Install Dependencies

```bash
npm install -g pnpm
pnpm install
```

### 3. Platform-Specific Setup

Choose your target platform(s) and follow the respective setup guides:

#### 📱 Mobile Development
- **[Android Setup](apps/mobile/android/README.md)** - React Native Android app
- **[iOS Setup](apps/mobile/ios/README.md)** - React Native iOS app

#### 🖥️ Desktop Development  
- **[Windows Setup](apps/desktop/windows/README.md)** - Tauri Windows app
- **[macOS Setup](apps/desktop/macos/README.md)** - Tauri macOS app

### 4. Development Commands

```bash
# Run both apps in parallel using turborepo
pnpm dev

# Run only mobile or desktop (when available)
pnpm --filter @safe-spend/mobile dev
pnpm --filter @safe-spend/desktop dev

# Build common package
pnpm --filter @safe-spend/common build

# Clean all build artifacts
pnpm clean
```

#### Mobile Development
```bash
cd apps/mobile
pnpm start
```

Ensure you've set up Android Studio or Xcode + CocoaPods depending on your platform.

### 5. Metro Configuration

Each app has its own Metro configuration optimized for its specific needs:

- **`apps/mobile/metro.config.js`** - React Native mobile app configuration
  - Supports workspace package resolution
  - Watches shared packages for hot reloading
  - Configured for TypeScript and modern JS features
  - Resolves modules from workspace root `node_modules`

This approach allows each app to have its own bundling strategy while maintaining workspace package support.

#### Desktop Development
```bash
cd apps/desktop
pnpm tauri dev
```

You must have Rust, Cargo, and the Tauri prerequisites installed:

```bash
# Install Rust
curl https://sh.rustup.rs -sSf | sh

# Install Tauri deps (macOS example)
brew install libwebkit2gtk-4.0
```

---

## 🔧 Tooling Decisions

| Area                   | Decision                                   |
| ---------------------- | ------------------------------------------ |
| Mobile Stack           | **React Native CLI**                       |
| Desktop Stack          | **Tauri CLI**                              |
| Monorepo Tooling       | **pnpm** + **Turborepo**                   |
| Folder Structure       | `apps/`, `packages/` (workspace-based)     |
| Code Sharing Strategy  | Shared `@common` package                   |
| Metro Config           | **Individual metro configs** per app        |
| TypeScript Config      | Root + per-package overrides               |
| Cloud Storage Strategy | Support **multiple user-chosen** providers |

---

## ⏳ Pending Tech Decisions

| Area                         | Status                                       |
| ---------------------------- | -------------------------------------------- |
| Navigation Library           | ❓ React Navigation / RN Navigation / Screens |
| State Management             | ❓ Zustand / Redux Toolkit / Jotai            |
| Local DB / Storage           | ❓ SQLite (WatermelonDB), Realm, MMKV         |
| UI Kit / Styling             | ❓ Tailwind / NativeBase / RN Paper           |
| Email & PDF Parsing          | ❓ mailparser / imap / pdfjs / tika           |
| Mobile Release Strategy      | ❓ Manual / Fastlane / EAS                    |
| App Versioning / OTA Updates | ❓ CodePush / Tauri auto-updater / manual     |
| Subscriptions & Billing      | ❓ RevenueCat / Stripe / SDKs                 |
| Encryption Strategy          | ❓ AES / libsodium / Secure Storage           |
| Device Authentication        | ❓ Biometric / PIN / Keystore                 |
| Secure Local Storage         | ❓ MMKV / SQLite / Keychain                   |

---

## ✨ Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Use `pnpm` commands to run builds, tests, and scripts
4. Submit a PR

---

## 📌 Goals

* ⛔ No mandatory cloud login
* 🔐 Strong encryption & biometric/PIN security
* 📊 Financial summary from bank statements
* 🔄 Multi-platform sync (optional)
* 🧩 Modular design for extensions (e.g., plugins for budget, tax, etc.)

---

## 📅 Roadmap

* [x] Decide cross-platform stack
* [x] Setup monorepo tooling
* [ ] Finalize DB + State + UI libraries
* [ ] Implement file-based import and categorization
* [ ] Add optional encrypted sync layer

---

## 📬 Questions or Suggestions?

Open an issue or discussion in this repo.