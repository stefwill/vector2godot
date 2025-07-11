# Vector2Godot - Vector Drawing Tool for Game Development

![Version](https://img.shields.io/badge/version-1.3.9-blue.svg)

Vector2Godot is a powerful, modern vector drawing application specifically designed for game developers working with the Godot Engine. This intuitive tool bridges the gap between visual design and code implementation by allowing you to draw vector shapes with precision and automatically generating the corresponding Godot `_draw()` function code. Whether you're prototyping UI elements, creating simple graphics, or designing geometric patterns for your games, Vector2Godot streamlines your workflow by providing real-time code generation, eliminating the need to manually write complex drawing coordinates and function calls.

## What's New in v1.3.9

### **Major Architectural Transformation**
The Vector2Godot application has been completely refactored from a monolithic architecture (single 3000+ line file) into a clean, modular architecture with 8 focused modules. This change improves maintainability, testability, and scalability while preserving all existing functionality.

### **New Modular Architecture**
```
src/
├── core/                      # Core application logic
│   ├── SplashScreen.js       # Loading screen management
│   ├── SettingsManager.js    # Settings and persistence
│   ├── ShapeManager.js       # Shape operations
│   ├── CanvasRenderer.js     # Canvas rendering
│   ├── EventHandler.js       # User input handling
│   ├── ToolManager.js        # Drawing tools
│   └── CodeGenerator.js      # Code generation
├── ui/
│   └── UIManager.js          # UI components
└── VectorDrawingApp.js       # Main coordinator
```

### **Key Improvements**
- **Performance**: Increased Node.js memory limit to 4GB for better handling of large projects
- **Maintainability**: Each module has a single, focused responsibility
- **Testability**: Modules can be tested independently
- **Developer Experience**: Enhanced debugging and error isolation
- **Scalability**: Easy to add new features to specific modules

## Features

### **Comprehensive Drawing Tools**
- **Select Tool**: Click to select and edit existing shapes with control points
- **Line Tool**: Draw connected lines with automatic closed shape detection
- **Rectangle Tool**: Create rectangles and squares with precise dimensions
- **Circle Tool**: Draw circles and ellipses with adjustable radius
- **Polygon Tool**: Create complex polygons by clicking points
- **Eraser Tool**: Remove vertices from shapes by clicking on them

### **Smart Shape Detection**
- Automatically converts connected lines into filled polygons when you draw closed shapes
- Dynamic tolerance based on grid settings for precise shape closure
- Visual feedback when shapes are automatically closed

### **Real-time Code Generation**
- Instantly generates optimized Godot `_draw()` function code as you draw
- Supports all Godot drawing functions: `draw_line()`, `draw_rect()`, `draw_circle()`, `draw_arc()`, `draw_colored_polygon()`
- Responsive scaling with viewport size calculations
- Common color optimization (converts hex to Godot color constants)

### **Advanced Canvas Controls**
- **Zoom & Pan**: Navigate large drawings with mouse wheel zoom and pan functionality
- **Grid System**: Customizable grid with snap-to-grid functionality for precise alignment
- **Flexible Canvas Size**: Adjustable canvas dimensions (default 256x256 with 10px grid)
- **Responsive Design**: Canvas automatically fits to container size

### **Professional UI/UX**
- **Modern Interface**: Clean, responsive design with intuitive tool placement
- **Splash Screen**: Professional loading experience with animated branding
- **Dark/Light Mode**: Complete theme switching with persistent user preferences
- **Collapsible Panels**: Bottom code panel can be collapsed for more drawing space
- **Notification System**: User-friendly feedback for actions and errors

### **Customization Options**
- **Color Controls**: Full color picker for stroke and fill colors
- **Stroke Width**: Adjustable line thickness from 1-10 pixels
- **Fill Options**: Toggle fill on/off for shapes
- **Settings Persistence**: All preferences saved to local storage
- **Keyboard Shortcuts**: Efficient workflow with customizable shortcuts

### **Developer-Friendly Features**
- **One-Click Copy**: Copy generated code directly to clipboard
- **SVG Import**: Import SVG files and convert them to Godot drawing code
- **Multiple Export Formats**: Export to Godot code, SVG, CSV, and PNG
- **Project Save/Load**: Save and load complete projects as JSON files
- **Clean Code Output**: Properly formatted, commented Godot code

### **Cross-Platform Compatibility**
- **Desktop App**: Available as standalone Electron application for Windows and Linux
- **Web Version**: Runs in modern browsers with full functionality
- **Responsive Design**: Works on different screen sizes and resolutions

## How to Use

### **Basic Usage**
1. **Select a Drawing Tool**: Choose from the available tools in the left toolbar
2. **Draw Shapes**: 
   - **Line**: Click and drag to draw a line
   - **Rectangle**: Click and drag to create a rectangle
   - **Circle**: Click and drag to create a circle
   - **Polygon**: Click to add points, double-click to finish
3. **Edit Shapes**: Use the Select tool to move shapes and edit control points
4. **Customize Properties**: Adjust colors, stroke width, and fill options
5. **View Generated Code**: The Godot `_draw()` code appears in the bottom panel
6. **Copy Code**: Click "Copy Code" to copy the generated code to your clipboard

### **Advanced Features**
- **Import SVG**: Click the "Import SVG" button to load and convert SVG files
- **Save Projects**: Use Ctrl+S to save your work as a JSON project file
- **Export Options**: Access multiple export formats through the File menu
- **Keyboard Shortcuts**: Use number keys (1-6) to quickly switch between tools

### **Keyboard Shortcuts**
- **1**: Select Tool
- **2**: Line Tool
- **3**: Rectangle Tool
- **4**: Circle Tool
- **5**: Polygon Tool
- **6**: Eraser Tool
- **Delete**: Delete selected shape
- **Ctrl+C**: Copy selected shape
- **Ctrl+V**: Paste shape
- **Ctrl+D**: Duplicate selected shape
- **Ctrl+S**: Save project
- **Ctrl+O**: Open project
- **Ctrl+N**: New project
- **Escape**: Cancel current action

## Generated Code

The app generates proper Godot code using these drawing functions:
- `draw_line()` for lines
- `draw_rect()` for rectangles with optional fill
- `draw_circle()` and `draw_arc()` for circles
- `draw_colored_polygon()` and `draw_polyline()` for polygons
- Automatic scaling with viewport size for responsive design
- Optimized color constants for common colors

### **Example Generated Code**
```gdscript
func _draw():
    # Generated by Vector2Godot
    # Canvas size: 256x256
    
    # Scale factor for responsive design
    var scale_factor = get_viewport().get_visible_rect().size.x / 256.0
    var center_offset = Vector2(0, 0)  # Adjust as needed
    
    # Shape 1: rectangle
    draw_rect(
        Rect2(
            Vector2(50, 50) * scale_factor + center_offset,
            Vector2(100, 100) * scale_factor
        ),
        Color.WHITE
    )
    draw_rect(
        Rect2(
            Vector2(50, 50) * scale_factor + center_offset,
            Vector2(100, 100) * scale_factor
        ),
        Color.BLACK,
        false,
        2.0 * scale_factor
    )
```

## Migration to Modular Architecture

### **For Existing Users**
The modular architecture is backward compatible. Your existing workflows will continue to work exactly as before.

#### **Automatic Migration**
Use the provided migration script:
```bash
./migrate-to-modular.sh
```

#### **Manual Migration**
Update your `index.html` to use the new entry point:
```html
<!-- Change this -->
<script type="module" src="/main.js"></script>

<!-- To this -->
<script type="module" src="/main-new.js"></script>
```

### **For Developers**
The new modular architecture provides:
- **Enhanced Debugging**: Better error isolation and stack traces
- **Independent Testing**: Each module can be tested separately
- **Easy Extension**: Add new features to specific modules
- **Better Documentation**: Each module is self-documenting

## Architecture Benefits

### **Single Responsibility Principle**
Each module has a clear, focused responsibility:
- **SplashScreen**: Loading screen management
- **SettingsManager**: Application settings and persistence
- **ShapeManager**: Shape operations and geometry
- **CanvasRenderer**: Drawing and visual rendering
- **EventHandler**: User input and interactions
- **ToolManager**: Drawing tools and properties
- **CodeGenerator**: Godot code generation and exports
- **UIManager**: User interface and modals

### **Improved Maintainability**
- Easier to locate and fix bugs
- Changes in one module don't affect others
- Clear separation of concerns
- Better code organization

### **Enhanced Testability**
- Each module can be tested independently
- Easier to mock dependencies
- Better unit test coverage
- Isolated testing environments

### **Better Team Development**
- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear module boundaries
- Easier code reviews

### **Performance Improvements**
- Increased Node.js memory limit to 4GB
- Better memory management
- Optimized module loading
- Improved error handling

## Download

Ready to use Vector2Godot? Download the latest version for your platform:

### Desktop Applications
- **Windows**: [Vector2Godot-1.3.9.exe](https://github.com/stefwill/vector2godot/releases/download/v1.3.9/Vector2Godot-1.3.9.exe)
- **Linux**: [Vector2Godot-1.3.9.AppImage](https://github.com/stefwill/vector2godot/releases/download/v1.3.9/Vector2Godot-1.3.9.AppImage)

### Installation Instructions

#### Windows
1. Download the `.exe` file
2. Double-click to run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

#### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x Vector2Godot-1.3.9.AppImage`
3. Run directly: `./Vector2Godot-1.3.9.AppImage`
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
vector2godot/
├── index.html              # Main HTML file
├── main.js                 # Original monolithic file (preserved)
├── main-new.js             # New modular entry point
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

## Quality Assurance

### Code Quality
- **Consistent Style**: 2-space indentation, ES6+ features
- **Error Handling**: Comprehensive try-catch blocks
- **Documentation**: Extensive JSDoc comments
- **Best Practices**: Modern JavaScript patterns

### Testing Strategy
- **Unit Tests**: Each module can be tested independently
- **Integration Tests**: Module interactions are testable
- **End-to-End Tests**: Full application workflow testing
- **Error Scenarios**: Edge cases and error conditions

## Future Roadmap

### Short Term (Next Release)
- [ ] Add unit tests for all modules
- [ ] Implement undo/redo functionality
- [ ] Add more export formats
- [ ] Enhance SVG import capabilities

### Medium Term
- [ ] Plugin system for custom tools
- [ ] Advanced shape operations (union, intersection, etc.)
- [ ] Collaborative editing features
- [ ] Version control integration

### Long Term
- [ ] Web-based collaborative platform
- [ ] Mobile app version
- [ ] Cloud storage integration
- [ ] AI-powered drawing assistance

## Technical Specifications

### Dependencies
- **ES6 Modules**: Modern JavaScript module system
- **Canvas API**: HTML5 Canvas for rendering
- **File API**: For import/export functionality
- **Local Storage**: For settings persistence

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Development Tools
- **Vite**: Development server and build tool
- **Electron**: Desktop application framework
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Follow the modular architecture patterns
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## Technologies Used

- **Vite**: Fast build tool and development server
- **HTML5 Canvas**: For drawing functionality
- **Vanilla JavaScript**: Application logic with ES6+ modules
- **CSS3**: Modern styling with gradients and animations
- **Electron**: Desktop application framework

## License

This project is open source and available under the MIT License.

## Changelog

### [1.3.9] - 2025-07-11

#### Added
- **Major**: Modular architecture implementation - broke down the monolithic main.js into discrete modules
- New module structure with separate concerns for better maintainability
- Increased Node.js memory limit with --max-old-space-size=4096 for better performance
- Comprehensive module documentation

#### Changed
- **Breaking**: Restructured codebase into modular components
- Created main-new.js as the new entry point (main.js preserved for reference)
- Separated application logic into 8 focused modules
- Improved error handling and debugging capabilities
- Enhanced project structure for better team development

#### Technical
- Improved separation of concerns for better testability
- Enhanced maintainability through modular design
- Better memory management for large projects
- Preserved backward compatibility with existing API

### [1.3.8] - 2025-07-11

#### Fixed
- Fixed corrupted DOCTYPE declaration in index.html causing internal server error
- Resolved HTML parsing issues that prevented the application from starting
- Updated version numbers across all files to maintain consistency

---

**Created by Stefan Willoughby**  
**For the Godot game development community**  
**Vector2Godot - Bridging design and code**
