# Vector2Godot - Vector Drawing Tool for Game Development

![Version](https://img.shields.io/badge/version-1.3.5-blue.svg)

Vector2Godot is a powerful, modern vector drawing application specifically designed for game developers working with the Godot Engine. This intuitive tool bridges the gap between visual design and code implementation by allowing you to draw vector shapes with precision and automatically generating the corresponding Godot `_draw()` function code. Whether you're prototyping UI elements, creating simple graphics, or designing geometric patterns for your games, Vector2Godot streamlines your workflow by providing real-time code generation, eliminating the need to manually write complex drawing coordinates and function calls.

## Features

- **Comprehensive Drawing Tools**: 
  - **Select Tool**: Click to select and edit existing shapes
  - **Line Tool**: Draw connected lines with automatic closed shape detection
  - **Rectangle Tool**: Create rectangles and squares with precise dimensions
  - **Circle Tool**: Draw circles and ellipses with adjustable radius
  - **Polygon Tool**: Create complex polygons by clicking points
  - **Eraser Tool**: Remove vertices from shapes by clicking on them

- **Smart Shape Detection**: Automatically converts connected lines into filled polygons when you draw closed shapes

- **Real-time Code Generation**: Instantly generates optimized Godot `_draw()` function code as you draw

- **Advanced Canvas Controls**:
  - **Zoom & Pan**: Navigate large drawings with mouse wheel zoom and pan functionality
  - **Grid System**: Customizable grid with snap-to-grid functionality for precise alignment
  - **Flexible Canvas Size**: Adjustable canvas dimensions (default 256x256 with 10px grid)

- **Professional UI/UX**:
  - **Modern Interface**: Clean, responsive design with intuitive tool placement
  - **Splash Screen**: Professional loading experience with animated branding
  - **Dark/Light Mode**: Complete theme switching with persistent user preferences
  - **Collapsible Panels**: Bottom code panel can be collapsed for more drawing space

- **Customization Options**:
  - **Color Controls**: Full color picker for stroke and fill colors
  - **Stroke Width**: Adjustable line thickness from 1-10 pixels
  - **Fill Options**: Toggle fill on/off for shapes
  - **Settings Persistence**: All preferences saved to local storage

- **Developer-Friendly Features**:
  - **One-Click Copy**: Copy generated code directly to clipboard
  - **SVG Import**: Import SVG files and convert them to Godot drawing code
  - **Clean Code Output**: Properly formatted, commented Godot code
  - **Shape Properties**: View and modify shape properties in real-time
  - **Keyboard Shortcuts**: Efficient workflow with keyboard shortcuts

- **Cross-Platform Compatibility**:
  - **Desktop App**: Available as standalone Electron application for Windows and Linux

## How to Use

1. **Select a Drawing Tool**: Choose from the available tools in the left toolbar
2. **Draw Shapes**: 
   - **Line**: Click and drag to draw a line
   - **Rectangle**: Click and drag to create a rectangle
   - **Circle**: Click and drag to create a circle
   - **Polygon**: Click to add points, double-click to finish
3. **Import SVG**: Click the "Import SVG" button to load and convert SVG files
4. **Customize Properties**: Adjust colors, stroke width, and fill options
5. **View Generated Code**: The Godot `_draw()` code appears in the bottom panel
6. **Copy Code**: Click "Copy Code" to copy the generated code to your clipboard

## Generated Code

The app generates proper Godot code using these drawing functions:
- `draw_line()` for lines
- `draw_rect()` for rectangles  
- `draw_circle()` and `draw_arc()` for circles
- `draw_colored_polygon()` and `draw_line()` for polygons

## Download

Ready to use Vector2Godot? Download the latest version for your platform:

### Desktop Applications
- **Windows**: [Vector2Godot-1.3.5.exe](https://github.com/stefwill/vector2godot/releases/download/v1.3.5/Vector2Godot-1.3.5.exe)
- **Linux**: [Vector2Godot-1.3.5.AppImage](https://github.com/stefwill/vector2godot/releases/download/v1.3.5/Vector2Godot-1.3.5.AppImage)

### Installation Instructions

#### Windows
1. Download the `.exe` file
2. Double-click to run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

#### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x Vector2Godot-1.3.5.AppImage`
3. Run directly: `./Vector2Godot-1.3.5.AppImage`
4. Optional: Integrate with system using AppImageLauncher

### System Requirements
- **Operating System**: Windows 10+ or Linux (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 200MB available space
- **Graphics**: Hardware acceleration support recommended

## Development

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
vector-app/
├── index.html         # Main HTML file
├── main.js            # Application logic
├── style.css          # Styling
├── vite.config.js     # Vite configuration
├── package.json       # Project dependencies
└── .github/
    └── copilot-instructions.md
```

## Technologies Used

- **Vite**: Fast build tool and development server
- **HTML5 Canvas**: For drawing functionality
- **Vanilla JavaScript**: Application logic
- **CSS3**: Modern styling with gradients and animations

## License

This project is open source and available under the MIT License.
