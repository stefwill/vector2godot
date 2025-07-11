# Install### Installation Instructions

#### Windows
1. Build from source using `npm run build:win`
2. Extract the generated ZIP file to your desired location
3. Run `Vector2Godot.exe` from the extracted folder
4. Optional: Create a desktop shortcut for easy access

#### Linux
1. Build from source using `npm run build:linux`
2. Make the AppImage executable: `chmod +x Vector2Godot-1.4.1.AppImage`
3. Run directly: `./Vector2Godot-1.4.1.AppImage`
4. Optional: Integrate with system using AppImageLauncher## Download

Ready to use Vector2Godot? Download the latest version for your platform:

### Desktop Applications
Desktop applications are available for Windows and Linux platforms. Please build from source using the instructions below.

### Installation Instructions

#### Windows
1. Download the `.zip` file
2. Extract the contents to your desired location
3. Run `Vector2Godot.exe` from the extracted folder
4. Optional: Create a desktop shortcut for easy access

#### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x Vector2Godot-1.4.1.AppImage`
3. Run directly: `./Vector2Godot-1.4.1.AppImage`
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
