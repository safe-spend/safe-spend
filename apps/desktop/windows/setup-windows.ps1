# Safe Spend Desktop App - Windows Setup Script
# This script helps set up the development environment for the React Native Windows desktop app

Write-Host "Safe Spend Desktop - React Native Windows Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if PNPM is installed
Write-Host "Checking PNPM installation..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "✓ PNPM is installed: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ PNPM is not installed. Installing PNPM..." -ForegroundColor Yellow
    try {
        npm install -g pnpm
        Write-Host "✓ PNPM installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to install PNPM. Please install manually: npm install -g pnpm" -ForegroundColor Red
        exit 1
    }
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Navigate to workspace root and install dependencies
Write-Host "Installing monorepo dependencies..." -ForegroundColor Yellow
Set-Location "../.."
pnpm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check for Visual Studio and required components
Write-Host "Checking for Visual Studio 2022..." -ForegroundColor Yellow
$vsInstances = Get-ChildItem -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall" -Recurse -ErrorAction SilentlyContinue | 
    Get-ItemProperty | Where-Object { $_.DisplayName -like "*Visual Studio*2022*" }

if ($vsInstances) {
    Write-Host "✓ Visual Studio 2022 found" -ForegroundColor Green
} else {
    Write-Host "⚠ Visual Studio 2022 not detected. You may need to install it with:" -ForegroundColor Yellow
    Write-Host "  - Universal Windows Platform development workload" -ForegroundColor Yellow
    Write-Host "  - Desktop development with C++ workload" -ForegroundColor Yellow
}

# Install React Native Windows dependencies
Write-Host "Installing React Native Windows development dependencies..." -ForegroundColor Yellow
Write-Host "This will install Visual Studio components and Windows SDK if needed..." -ForegroundColor Cyan

$scriptPath = ".\node_modules\react-native-windows\scripts\rnw-dependencies.ps1"
if (Test-Path $scriptPath) {
    Write-Host "Running dependency installation script..." -ForegroundColor Yellow
    Write-Host "Note: This may require elevated permissions and will take several minutes" -ForegroundColor Cyan
    
    # Check if running as administrator
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    $isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Host "⚠ This script should be run as Administrator for dependency installation" -ForegroundColor Yellow
        Write-Host "Please run PowerShell as Administrator and execute:" -ForegroundColor Yellow
        Write-Host "  Set-ExecutionPolicy Unrestricted -Scope Process -Force" -ForegroundColor Cyan
        Write-Host "  .\apps\desktop\setup-windows.ps1" -ForegroundColor Cyan
    } else {
        try {
            Set-ExecutionPolicy Unrestricted -Scope Process -Force
            & $scriptPath
            Write-Host "✓ React Native Windows dependencies installed" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Could not automatically install dependencies. Please run manually:" -ForegroundColor Yellow
            Write-Host "  $scriptPath" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠ Dependency script not found. Make sure react-native-windows is installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host ""
Write-Host "To run the desktop app:" -ForegroundColor Cyan
Write-Host "From workspace root:" -ForegroundColor White
Write-Host "  pnpm desktop:start    # Start Metro bundler" -ForegroundColor White
Write-Host "  pnpm desktop          # Run Windows app" -ForegroundColor White
Write-Host ""
Write-Host "Or from apps/desktop directory:" -ForegroundColor White
Write-Host "  pnpm start            # Start Metro bundler" -ForegroundColor White
Write-Host "  pnpm windows          # Run Windows app" -ForegroundColor White
Write-Host ""
Write-Host "If you encounter build issues:" -ForegroundColor Yellow
Write-Host "- Ensure Visual Studio 2022 is installed with UWP and C++ workloads" -ForegroundColor White
Write-Host "- Run the dependency script manually in elevated PowerShell" -ForegroundColor White
Write-Host "- Check the README.md for detailed troubleshooting steps" -ForegroundColor White
