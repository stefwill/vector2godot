# 🚀 Building Vector2Godot

This guide explains how to build Vector2Godot for different platforms.

## ✅ Prerequisites

- Node.js (v18 or higher)
- npm
- Git

### For Linux builds:
- Standard Linux build tools
- ImageMagick (for icon conversion)

### For Windows builds:
- Wine (optional, for cross-compilation on Linux)

## 📦 Quick Build

### Build for your current platform:
```bash
npm run build
```

### Build for specific platforms:
```bash
# Linux AppImage
npm run build:linux

# Windows Portable
npm run build:win

# macOS DMG
npm run build:mac
```

### Build all platforms:
```bash
./build-all.sh
```

## 🎯 Build Outputs

All builds are created in the `release/` directory:

- **Linux**: `Vector2Godot-1.0.0.AppImage`
- **Windows**: `Vector2Godot 1.0.0.exe`
- **macOS**: `Vector2Godot-1.0.0.dmg`

## 🔧 Development

To run in development mode:
```bash
npm run dev
```

## 🧹 Clean Build

To clean all build artifacts:
```bash
npm run clean
```

## 📋 Build Configuration

The build configuration is defined in `package.json` under the `build` section:

- **Linux**: Creates AppImage with Graphics category
- **Windows**: Creates portable executable
- **macOS**: Creates DMG installer
- **Icons**: Automatically converted from SVG to PNG

## 🎨 Icon Generation

Icons are automatically generated from `assets/icon.svg` in multiple sizes:
- 512x512 (main icon)
- 256x256, 128x128, 64x64, 32x32 (various platform needs)

## 🏗️ Build Process

1. **Prepare**: Install dependencies
2. **Package**: Bundle the application with Electron
3. **Build**: Create platform-specific installers
4. **Output**: Generate final distributable files

## 📊 Build Sizes

Typical build sizes:
- **Linux AppImage**: ~100MB
- **Windows Portable**: ~67MB
- **macOS DMG**: ~70MB (estimated)

## 🛠️ Troubleshooting

### Common Issues:

1. **Missing ImageMagick**: Install with `sudo apt install imagemagick`
2. **Build fails**: Run `npm run clean` and try again
3. **Permission denied**: Run `chmod +x build-all.sh`

### Platform-specific Notes:

- **Linux**: Requires FUSE for AppImage support
- **Windows**: Built executable is portable (no installation needed)
- **macOS**: Requires macOS for native builds (or CI/CD)
