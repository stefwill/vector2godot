# Installation Guide

## Download

Ready to use Vector2Godot? Download the latest version for your platform:

### Desktop Applications
- **Windows**: [Vector2Godot-1.4.0.exe](https://github.com/stefwill/vector2godot/releases/download/v1.4.0/Vector2Godot-1.4.0.exe)
- **Linux**: [Vector2Godot-1.4.0.AppImage](https://github.com/stefwill/vector2godot/releases/download/v1.4.0/Vector2Godot-1.4.0.AppImage)

### Installation Instructions

#### Windows
1. Download the `.exe` file
2. Double-click to run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

#### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x Vector2Godot-1.4.0.AppImage`
3. Run directly: `./Vector2Godot-1.4.0.AppImage`
4. Optional: Integrate with system using AppImageLauncher

### System Requirements
- **Operating System**: Windows 10+ or Linux (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 200MB available space
- **Graphics**: Hardware acceleration support recommended

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Desktop app development
npm run electron-dev

# Build desktop apps
npm run dist          # All platforms
npm run dist:win      # Windows only
npm run dist:linux    # Linux only
```

### Project Structure
```
vector2godot/
├── index.html              # Main HTML file
├── main.js                 # New modular entry point
├── style.css               # Styling
├── vite.config.js          # Vite configuration
├── package.json            # Project dependencies
├── migrate-to-modular.sh   # Migration script
├── src/                    # Modular source code
│   ├── core/              # Core application logic
│   ├── ui/                # User interface components
│   └── VectorDrawingApp.js # Main coordinator
└── .github/
    └── instructions/
        └── claude.instructions.md
```
