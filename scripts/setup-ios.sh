#!/bin/bash

# iOS Development Environment Setup Script for Safe Spend Mobile App
# This script automates the installation of required tools for React Native iOS development
# NOTE: This script only works on macOS as iOS development requires Xcode

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ iOS development requires macOS. This script can only run on macOS.${NC}"
    echo -e "${YELLOW}For cross-platform development, consider using:${NC}"
    echo "  - React Native for Web"
    echo "  - Expo (with limitations)"
    echo "  - Cloud-based macOS solutions"
    exit 1
fi

# Parse command line arguments
SKIP_NODEJS=false
SKIP_XCODE=false
SKIP_COCOAPODS=false
SKIP_VSCODE=false
FORCE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-nodejs)
      SKIP_NODEJS=true
      shift
      ;;
    --skip-xcode)
      SKIP_XCODE=true
      shift
      ;;
    --skip-cocoapods)
      SKIP_COCOAPODS=true
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

echo -e "${CYAN}🍎 Setting up iOS development environment for Safe Spend...${NC}"
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

# Check for Xcode
if [[ $SKIP_XCODE == false ]]; then
    if ! command_exists xcodebuild || [[ $FORCE == true ]]; then
        echo -e "${YELLOW}📱 Xcode Installation Required${NC}"
        echo "Xcode must be installed from the Mac App Store:"
        echo "1. Open Mac App Store"
        echo "2. Search for 'Xcode'"
        echo "3. Install Xcode (this may take a while - it's a large download)"
        echo "4. Launch Xcode and accept the license agreement"
        echo "5. Install additional components when prompted"
        echo ""
        echo -e "${BLUE}Alternatively, install via command line:${NC}"
        echo "xcode-select --install"
        echo ""
    else
        echo -e "${GREEN}✅ Xcode already installed${NC}"
    fi
fi

# Install Xcode Command Line Tools
echo -e "${YELLOW}🛠️ Installing Xcode Command Line Tools...${NC}"
if ! xcode-select -p &> /dev/null; then
    xcode-select --install
    echo "Please complete the Xcode Command Line Tools installation and re-run this script."
    read -p "Press Enter after installation is complete..."
else
    echo -e "${GREEN}✅ Xcode Command Line Tools already installed${NC}"
fi

# Install CocoaPods
if [[ $SKIP_COCOAPODS == false ]]; then
    if ! command_exists pod || [[ $FORCE == true ]]; then
        echo -e "${YELLOW}🍫 Installing CocoaPods...${NC}"
        sudo gem install cocoapods
        echo -e "${GREEN}✅ CocoaPods installed successfully${NC}"
    else
        echo -e "${GREEN}✅ CocoaPods already installed${NC}"
    fi
fi

# Install Visual Studio Code
if [[ $SKIP_VSCODE == false ]]; then
    if ! command_exists code || [[ $FORCE == true ]]; then
        install_brew_package "visual-studio-code" "Visual Studio Code"
    else
        echo -e "${GREEN}✅ Visual Studio Code already installed${NC}"
    fi
fi

# Install iOS Simulator (comes with Xcode)
echo -e "${BLUE}📱 iOS Simulator Setup${NC}"
echo "iOS Simulator is included with Xcode. To verify installation:"
echo "1. Open Xcode"
echo "2. Go to Xcode -> Open Developer Tool -> Simulator"
echo "3. Choose an iOS device to simulate"
echo ""

# Install Watchman (recommended for React Native)
if ! command_exists watchman || [[ $FORCE == true ]]; then
    echo -e "${YELLOW}👁️ Installing Watchman (recommended for React Native)...${NC}"
    install_brew_package "watchman" "Watchman"
else
    echo -e "${GREEN}✅ Watchman already installed${NC}"
fi

# TODO: Add React Native iOS specific setup
echo -e "${YELLOW}🚧 TODO: React Native iOS-specific setup${NC}"
echo "   - React Native CLI installation"
echo "   - iOS deployment target configuration"
echo "   - Code signing setup"
echo "   - Flipper configuration"
echo "   - VS Code extensions setup"

echo ""
echo -e "${GREEN}🎉 iOS development environment setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Complete Xcode installation if not done already"
echo "2. Open Xcode and accept license agreements"
echo "3. Install a iOS Simulator device"
echo "4. Set up Apple Developer account (for device testing)"
echo "5. Run: npx react-native doctor (after React Native setup)"
echo "6. Navigate to apps/mobile and follow the iOS README"
echo ""
echo -e "${CYAN}📖 For detailed setup instructions, see: apps/mobile/ios/README.md${NC}"

echo ""
echo -e "${BLUE}🔧 Verify Installation:${NC}"
echo "Run these commands to verify your setup:"
echo "  node --version"
echo "  pnpm --version"
echo "  xcodebuild -version"
echo "  pod --version"
echo "  xcrun simctl list devices"
