# Safe Spend 💰

A monorepo for personal finance management applications across multiple platforms.

## Architecture

```
safe-spend/
├── apps/
│   ├── desktop/          # Cross-platform React Native desktop app
│   │   ├── windows/      # Windows-specific native code & setup
│   │   ├── macos/        # macOS-specific native code & setup (future)
│   │   └── [common files] # Shared app code (App.tsx, metro.config.js, etc.)
│   └── mobile/           # Future mobile apps
├── packages/
│   ├── core/             # Business logic & types
│   ├── parsers/          # Transaction parsers
│   ├── email-adapters/   # Email integrations
│   ├── storage/          # Data layer
│   ├── native-modules/   # Platform APIs
│   └── shared-ui/        # Shared components
└── scripts/              # Build & utility scripts
```

## Quick Start

### Prerequisites

**All Platforms:**
- Node.js 18+
- PNPM 8+ (install with `npm install -g pnpm`)

**Windows:**
- Visual Studio 2022 with UWP and C++ workloads
- Windows 10/11 SDK

**macOS (Future):**
- Xcode 14+
- macOS 12+

### Platform Setup

#### Windows Desktop
For automated setup, run the Windows setup script:
```powershell
# From workspace root, run as Administrator
Set-ExecutionPolicy Unrestricted -Scope Process -Force
.\apps\desktop\windows\setup-windows.ps1
```

#### Manual Setup (All Platforms)
```bash
# Install all dependencies
pnpm install

# Start desktop app development
pnpm desktop:start    # Terminal 1: Metro bundler
pnpm desktop          # Terminal 2: Platform app (Windows/macOS)
```

## Development

### Desktop App

**Cross-platform commands (from apps/desktop):**
```bash
cd apps/desktop
pnpm start          # Metro bundler
pnpm windows        # Windows app
pnpm macos          # macOS app (future)
```

**From workspace root:**
```bash
pnpm desktop:start  # Metro bundler
pnpm desktop        # Platform app (Windows/macOS)
```

**Platform-specific setup:**
- Windows: `apps/desktop/windows/setup-windows.ps1`
- macOS: `apps/desktop/macos/setup-macos.sh` (future)

### Package Development
Each package in `/packages` contains shared logic that can be used across apps.

## Platform Support

| Platform | Status | Setup Script | Requirements |
|----------|---------|--------------|-------------|
| Windows Desktop | ✅ Active | `windows/setup-windows.ps1` | VS 2022, Windows SDK |
| macOS Desktop | 🔄 Planned | `macos/setup-macos.sh` | Xcode 14+, macOS 12+ |
| iOS | 📋 Future | TBD | Xcode, iOS SDK |
| Android | 📋 Future | TBD | Android Studio |

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Dependencies | Delete `node_modules`, run `pnpm install` |
| Metro cache | `pnpm --filter @safe-spend/desktop exec react-native start --reset-cache` |

### Windows-Specific

| Issue | Solution |
|-------|----------|
| Build fails | Ensure VS 2022 has UWP + C++ workloads installed |
| Setup script fails | Run PowerShell as Administrator |
| Visual Studio not detected | Install VS 2022 Community with required workloads |

### macOS-Specific (Future)

| Issue | Solution |
|-------|----------|
| Build fails | Ensure Xcode Command Line Tools are installed |
| Simulator issues | Reset iOS Simulator |
| Pod install fails | `cd ios && pod install --repo-update` |

Ready to build your finance suite! 🚀
