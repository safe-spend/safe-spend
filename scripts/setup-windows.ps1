#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Sets up Windows development environment for Safe Spend desktop app (Tauri)

.DESCRIPTION
    This script automates the installation and configuration of required tools
    for developing the Safe Spend Tauri desktop application on Windows.

.EXAMPLE
    .\setup-windows.ps1
#>

param(
    [switch]$SkipRust,
    [switch]$SkipNodejs,
    [switch]$SkipVSCode,
    [switch]$Force
)

Write-Host "🪟 Setting up Windows development environment for Safe Spend..." -ForegroundColor Cyan
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

Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue

# Check for winget
if (-not (Test-Command "winget")) {
    Write-Host "❌ winget is required but not installed. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://github.com/microsoft/winget-cli/releases" -ForegroundColor Yellow
    exit 1
}

# Install Rust and Cargo
if (-not $SkipRust) {
    if (-not (Test-Command "rustc") -or $Force) {
        Write-Host "🦀 Installing Rust..." -ForegroundColor Yellow
        Install-Package "Rustlang.Rustup" "Rust"
        
        # Refresh environment
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
    }
    else {
        Write-Host "✅ Rust already installed" -ForegroundColor Green
    }
}

# Install Node.js
if (-not $SkipNodejs) {
    if (-not (Test-Command "node") -or $Force) {
        Install-Package "OpenJS.NodeJS.LTS" "Node.js LTS"
    }
    else {
        Write-Host "✅ Node.js already installed" -ForegroundColor Green
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

# Install Windows Build Tools
Write-Host "🔧 Installing Windows Build Tools..." -ForegroundColor Yellow
Install-Package "Microsoft.VisualStudio.2022.BuildTools" "Visual Studio Build Tools 2022"

# TODO: Add Tauri-specific dependencies
Write-Host ""
Write-Host "🚧 TODO: Tauri-specific setup" -ForegroundColor Yellow
Write-Host "   - WebView2 runtime installation"
Write-Host "   - Windows SDK configuration"
Write-Host "   - Tauri CLI installation"
Write-Host "   - VS Code extensions setup"

Write-Host ""
Write-Host "🎉 Windows development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Blue
Write-Host "1. Restart your terminal to refresh PATH"
Write-Host "2. Run: cargo install tauri-cli"
Write-Host "3. Navigate to apps/desktop and follow the Windows README"
Write-Host "4. Open the project in VS Code"
Write-Host ""
Write-Host "📖 For detailed setup instructions, see: apps/desktop/windows/README.md" -ForegroundColor Cyan
