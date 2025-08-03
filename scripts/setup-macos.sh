#!/bin/bash

# macOS Development Environment Setup Script for Safe Spend Desktop App (Tauri)
# This script automates the installation of required tools for Tauri development on macOS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parse command line arguments
SKIP_RUST=false
SKIP_NODEJS=false
SKIP_VSCODE=false
FORCE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-rust)
      SKIP_RUST=true
      shift
      ;;
    --skip-nodejs)
      SKIP_NODEJS=true
      shift
      ;;
    --skip-vscode)
      SKIP_VSCODE=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo -e "${CYAN}🍎 Setting up macOS development environment for Safe Spend...${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install via Homebrew
install_brew_package() {
    local package=$1
    local name=$2
    
    echo -e "${YELLOW}📦 Installing $name...${NC}"
    if brew install "$package"; then
        echo -e "${GREEN}✅ $name installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install $name${NC}"
        return 1
    fi
}

echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check for Homebrew
if ! command_exists brew; then
    echo -e "${YELLOW}🍺 Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo -e "${GREEN}✅ Homebrew already installed${NC}"
fi

# Install Rust and Cargo
if [[ $SKIP_RUST == false ]]; then
    if ! command_exists rustc || [[ $FORCE == true ]]; then
        echo -e "${YELLOW}🦀 Installing Rust...${NC}"
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source ~/.cargo/env
        echo -e "${GREEN}✅ Rust installed successfully${NC}"
    else
        echo -e "${GREEN}✅ Rust already installed${NC}"
    fi
fi

# Install Node.js
if [[ $SKIP_NODEJS == false ]]; then
    if ! command_exists node || [[ $FORCE == true ]]; then
        install_brew_package "node" "Node.js"
    else
        echo -e "${GREEN}✅ Node.js already installed${NC}"
    fi
fi

# Install pnpm
if ! command_exists pnpm || [[ $FORCE == true ]]; then
    echo -e "${YELLOW}📦 Installing pnpm...${NC}"
    npm install -g pnpm
    echo -e "${GREEN}✅ pnpm installed successfully${NC}"
else
    echo -e "${GREEN}✅ pnpm already installed${NC}"
fi

# Install Visual Studio Code
if [[ $SKIP_VSCODE == false ]]; then
    if ! command_exists code || [[ $FORCE == true ]]; then
        install_brew_package "visual-studio-code" "Visual Studio Code"
    else
        echo -e "${GREEN}✅ Visual Studio Code already installed${NC}"
    fi
fi

# Install Git (usually pre-installed on macOS)
if ! command_exists git || [[ $FORCE == true ]]; then
    install_brew_package "git" "Git"
else
    echo -e "${GREEN}✅ Git already installed${NC}"
fi

# Install Xcode Command Line Tools
echo -e "${YELLOW}🛠️ Installing Xcode Command Line Tools...${NC}"
if ! xcode-select -p &> /dev/null; then
    xcode-select --install
    echo "Please complete the Xcode Command Line Tools installation and re-run this script."
    exit 1
else
    echo -e "${GREEN}✅ Xcode Command Line Tools already installed${NC}"
fi

# Install macOS-specific dependencies for Tauri
echo -e "${YELLOW}🔧 Installing macOS dependencies for Tauri...${NC}"
# TODO: Add actual Tauri dependencies here

echo ""
echo -e "${YELLOW}🚧 TODO: Tauri-specific setup${NC}"
echo "   - Tauri CLI installation"
echo "   - macOS WebKit dependencies"
echo "   - VS Code extensions setup"
echo "   - macOS code signing setup"

echo ""
echo -e "${GREEN}🎉 macOS development environment setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Restart your terminal to refresh PATH"
echo "2. Run: cargo install tauri-cli"
echo "3. Navigate to apps/desktop and follow the macOS README"
echo "4. Open the project in VS Code"
echo ""
echo -e "${CYAN}📖 For detailed setup instructions, see: apps/desktop/macos/README.md${NC}"
