#!/bin/bash

# Build script for Vector2Godot
# This script builds the application for different platforms

set -e

echo "🚀 Building Vector2Godot..."
echo "=============================="

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Prepare build environment
echo "📦 Preparing build environment..."
npm run build:prepare

# Build for Linux
echo "🐧 Building for Linux..."
npm run build:linux

# Build for Windows (if on Linux with wine)
if command -v wine &> /dev/null; then
    echo "🪟 Building for Windows..."
    npm run build:win
else
    echo "⚠️  Wine not available, skipping Windows build"
fi

# Show build results
echo ""
echo "✅ Build completed successfully!"
echo "📁 Build artifacts:"
ls -lh release/ | grep -E "\.(AppImage|exe|dmg)$" || echo "No build artifacts found"

echo ""
echo "🎯 To run the Linux AppImage:"
echo "   ./release/Vector2Godot-1.1.5.AppImage"
echo ""
echo "🎯 To run the Windows executable:"
echo "   wine release/Vector2Godot\\ 1.1.5.exe"
