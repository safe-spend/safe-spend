#!/bin/bash

# Android Development Environment Setup Script for Safe Spend Mobile App
# This script automates the installation of required tools for React Native Android development

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
fi

# Parse command line arguments
SKIP_NODEJS=false
SKIP_JDK=false
SKIP_ANDROID_STUDIO=false
SKIP_VSCODE=false
FORCE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-nodejs)
      SKIP_NODEJS=true
      shift
      ;;
    --skip-jdk)
      SKIP_JDK=true
      shift
      ;;
    --skip-android-studio)
      SKIP_ANDROID_STUDIO=true
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

echo -e "${CYAN}🤖 Setting up Android development environment for Safe Spend...${NC}"
echo -e "${BLUE}Detected OS: $OS${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Install Node.js
if [[ $SKIP_NODEJS == false ]]; then
    if ! command_exists node || [[ $FORCE == true ]]; then
        echo -e "${YELLOW}📦 Installing Node.js...${NC}"
        case $OS in
            "macos")
                if command_exists brew; then
                    brew install node
                else
                    echo -e "${RED}❌ Homebrew not found. Please install Homebrew first.${NC}"
                    exit 1
                fi
                ;;
            "linux")
                # Install via NodeSource repository
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                sudo apt-get install -y nodejs
                ;;
            "windows")
                echo -e "${YELLOW}⚠️ Please download Node.js from https://nodejs.org/ or use winget${NC}"
                ;;
        esac
        echo -e "${GREEN}✅ Node.js installed successfully${NC}"
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

# Install JDK
if [[ $SKIP_JDK == false ]]; then
    if ! command_exists java || [[ $FORCE == true ]]; then
        echo -e "${YELLOW}☕ Installing OpenJDK 17...${NC}"
        case $OS in
            "macos")
                if command_exists brew; then
                    brew install openjdk@17
                    # Link for system Java wrappers
                    sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
                fi
                ;;
            "linux")
                sudo apt-get update
                sudo apt-get install -y openjdk-17-jdk
                ;;
            "windows")
                echo -e "${YELLOW}⚠️ Please download OpenJDK 17 from https://adoptium.net/ or use winget${NC}"
                ;;
        esac
        echo -e "${GREEN}✅ OpenJDK installed successfully${NC}"
    else
        echo -e "${GREEN}✅ Java already installed${NC}"
    fi
fi

# Android Studio installation instructions
if [[ $SKIP_ANDROID_STUDIO == false ]]; then
    echo -e "${YELLOW}📱 Android Studio Setup Required${NC}"
    echo "Android Studio must be installed manually:"
    echo "1. Download from: https://developer.android.com/studio"
    echo "2. Install Android SDK (API level 34 recommended)"
    echo "3. Install Android SDK Build-Tools"
    echo "4. Create/configure Android Virtual Device (AVD)"
    echo ""
fi

# Set up environment variables
echo -e "${YELLOW}🔧 Setting up environment variables...${NC}"
case $OS in
    "macos")
        ANDROID_HOME="$HOME/Library/Android/sdk"
        ;;
    "linux")
        ANDROID_HOME="$HOME/Android/Sdk"
        ;;
    "windows")
        ANDROID_HOME="%LOCALAPPDATA%\\Android\\Sdk"
        ;;
esac

echo "Add the following to your shell profile (.bashrc, .zshrc, etc.):"
echo ""
echo "export ANDROID_HOME=$ANDROID_HOME"
echo "export PATH=\$PATH:\$ANDROID_HOME/emulator"
echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
echo ""

# TODO: Add React Native specific setup
echo -e "${YELLOW}🚧 TODO: React Native Android-specific setup${NC}"
echo "   - React Native CLI installation"
echo "   - Metro bundler configuration"
echo "   - Android SDK path validation"
echo "   - Emulator setup automation"
echo "   - VS Code extensions setup"

echo ""
echo -e "${GREEN}🎉 Android development environment setup initiated!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Install Android Studio manually from the link above"
echo "2. Configure Android SDK and create an AVD"
echo "3. Add environment variables to your shell profile"
echo "4. Restart your terminal"
echo "5. Run: npx react-native doctor (after React Native setup)"
echo "6. Navigate to apps/mobile and follow the Android README"
echo ""
echo -e "${CYAN}📖 For detailed setup instructions, see: apps/mobile/android/README.md${NC}"
