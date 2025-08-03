#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Sets up Windows development environment for Safe Spend Android app (React Native)

.DESCRIPTION
    This script automates the installation and configuration of required tools
    for developing the Safe Spend React Native Android application on Windows.

.EXAMPLE
    .\setup-android.ps1

.EXAMPLE
    .\setup-android.ps1 -SkipNodejs -Force
#>

param(
    [switch]$SkipNodejs,
    [switch]$SkipJDK,
    [switch]$SkipAndroidStudio,
    [switch]$SkipVSCode,
    [switch]$Force
)

Write-Host "🤖 Setting up Windows Android development environment for Safe Spend..." -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to install via winget
function Install-Package {
    param([string]$PackageId, [string]$Name)
    
    Write-Host "📦 Installing $Name..." -ForegroundColor Yellow
    try {
        winget install $PackageId --accept-package-agreements --accept-source-agreements
        Write-Host "✅ $Name installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install $Name" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

# Function to check if Java is installed and get version
function Test-JavaVersion {
    try {
        $javaVersion = java -version 2>&1 | Select-String "version"
        if ($javaVersion -match '"(\d+)\.') {
            return [int]$matches[1]
        }
        elseif ($javaVersion -match '"(\d+)"') {
            return [int]$matches[1]
        }
    }
    catch {
        return 0
    }
    return 0
}

Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue

# Check for winget
if (-not (Test-Command "winget")) {
    Write-Host "❌ winget is required but not installed. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://github.com/microsoft/winget-cli/releases" -ForegroundColor Yellow
    exit 1
}

# Install Node.js
if (-not $SkipNodejs) {
    if (-not (Test-Command "node") -or $Force) {
        Install-Package "OpenJS.NodeJS.LTS" "Node.js LTS"
        
        # Refresh environment
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
    }
    else {
        $nodeVersion = node --version
        Write-Host "✅ Node.js already installed ($nodeVersion)" -ForegroundColor Green
    }
}

# Install pnpm
if (-not (Test-Command "pnpm") -or $Force) {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Yellow
    try {
        npm install -g pnpm
        Write-Host "✅ pnpm installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install pnpm" -ForegroundColor Red
    }
}
else {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm already installed ($pnpmVersion)" -ForegroundColor Green
}

# Install OpenJDK 17
if (-not $SkipJDK) {
    $javaVersion = Test-JavaVersion
    if ($javaVersion -lt 17 -or $Force) {
        Write-Host "☕ Installing OpenJDK 17..." -ForegroundColor Yellow
        Install-Package "EclipseAdoptium.Temurin.17.JDK" "OpenJDK 17"
        
        # Set JAVA_HOME environment variable
        $actualJavaHome = Get-ChildItem -Path "${env:ProgramFiles}\Eclipse Adoptium\" -Directory -Name "jdk-17*" | Select-Object -First 1
        if ($actualJavaHome) {
            $javaHomePath = "${env:ProgramFiles}\Eclipse Adoptium\$actualJavaHome"
            [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHomePath, "User")
            Write-Host "✅ JAVA_HOME set to: $javaHomePath" -ForegroundColor Green
        }
    }
    else {
        Write-Host "✅ Java already installed (version $javaVersion)" -ForegroundColor Green
    }
}

# Install Visual Studio Code
if (-not $SkipVSCode) {
    if (-not (Test-Command "code") -or $Force) {
        Install-Package "Microsoft.VisualStudioCode" "Visual Studio Code"
    }
    else {
        Write-Host "✅ Visual Studio Code already installed" -ForegroundColor Green
    }
}

# Install Git (if not present)
if (-not (Test-Command "git") -or $Force) {
    Install-Package "Git.Git" "Git"
}
else {
    Write-Host "✅ Git already installed" -ForegroundColor Green
}

# Android Studio setup instructions
if (-not $SkipAndroidStudio) {
    Write-Host ""
    Write-Host "📱 Android Studio Setup Required" -ForegroundColor Yellow
    Write-Host "Android Studio must be installed manually:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://developer.android.com/studio" -ForegroundColor Cyan
    Write-Host "2. Install Android SDK (API level 34 recommended)" -ForegroundColor Cyan
    Write-Host "3. Install Android SDK Build-Tools 34.0.0" -ForegroundColor Cyan
    Write-Host "4. Install Android SDK Platform-Tools" -ForegroundColor Cyan
    Write-Host "5. Create/configure Android Virtual Device (AVD)" -ForegroundColor Cyan
    Write-Host ""
}

# Set up environment variables
Write-Host "🔧 Environment Variables Setup" -ForegroundColor Yellow
$androidHome = "$env:LOCALAPPDATA\Android\Sdk"
Write-Host "Add the following environment variables:" -ForegroundColor Cyan
Write-Host "ANDROID_HOME = $androidHome" -ForegroundColor White
Write-Host "Add to PATH:" -ForegroundColor Cyan
Write-Host "  - %ANDROID_HOME%\emulator" -ForegroundColor White
Write-Host "  - %ANDROID_HOME%\platform-tools" -ForegroundColor White
Write-Host "  - %ANDROID_HOME%\tools" -ForegroundColor White
Write-Host ""

# Attempt to set ANDROID_HOME if Android SDK exists
if (Test-Path $androidHome) {
    [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, "User")
    Write-Host "✅ ANDROID_HOME environment variable set" -ForegroundColor Green
    
    # Add Android tools to PATH
    $currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    $androidPaths = @(
        "$androidHome\emulator",
        "$androidHome\platform-tools",
        "$androidHome\tools"
    )
    
    $pathsToAdd = @()
    foreach ($path in $androidPaths) {
        if ($currentPath -notlike "*$path*") {
            $pathsToAdd += $path
        }
    }
    
    if ($pathsToAdd.Count -gt 0) {
        $newPath = $currentPath + ";" + ($pathsToAdd -join ";")
        [System.Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
        Write-Host "✅ Android tools added to PATH" -ForegroundColor Green
    }
}
else {
    Write-Host "⚠️ Android SDK not found at expected location" -ForegroundColor Yellow
    Write-Host "Please set ANDROID_HOME manually after installing Android Studio" -ForegroundColor Yellow
}

# TODO: Add React Native specific setup
Write-Host ""
Write-Host "🚧 TODO: React Native Android-specific setup" -ForegroundColor Yellow
Write-Host "   - React Native CLI installation" -ForegroundColor Gray
Write-Host "   - Metro bundler configuration" -ForegroundColor Gray
Write-Host "   - Android SDK path validation" -ForegroundColor Gray
Write-Host "   - Emulator setup automation" -ForegroundColor Gray
Write-Host "   - VS Code extensions setup" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 Windows Android development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Blue
Write-Host "1. Install Android Studio manually from the link above" -ForegroundColor White
Write-Host "2. Configure Android SDK and create an AVD" -ForegroundColor White
Write-Host "3. Restart your terminal to refresh environment variables" -ForegroundColor White
Write-Host "4. Run: npx react-native doctor (after React Native setup)" -ForegroundColor White
Write-Host "5. Navigate to apps/mobile and follow the Android README" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Verify Installation:" -ForegroundColor Blue
Write-Host "Run these commands to verify your setup:" -ForegroundColor Cyan
Write-Host "  node --version" -ForegroundColor White
Write-Host "  pnpm --version" -ForegroundColor White
Write-Host "  java -version" -ForegroundColor White
Write-Host "  echo `$env:ANDROID_HOME" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed setup instructions, see: apps/mobile/android/README.md" -ForegroundColor Cyan
