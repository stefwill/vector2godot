# Architecture Documentation

## What's New in v1.4.0

### Major Architectural Transformation
The Vector2Godot application has been completely refactored from a monolithic architecture (single 3000+ line file) into a clean, modular architecture with 8 focused modules. This change improves maintainability, testability, and scalability while preserving all existing functionality.

### New Modular Architecture
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

### Key Improvements
- **Performance**: Increased Node.js memory limit to 4GB for better handling of large projects
- **Maintainability**: Each module has a single, focused responsibility
- **Testability**: Modules can be tested independently
- **Developer Experience**: Enhanced debugging and error isolation
- **Scalability**: Easy to add new features to specific modules

## Migration to Modular Architecture

### For Existing Users
The modular architecture is backward compatible. Your existing workflows will continue to work exactly as before.

#### Automatic Migration
Use the provided migration script:
```bash
./migrate-to-modular.sh
```

#### Manual Migration
Update your `index.html` to use the new entry point:
```html
<!-- Change this -->
<script type="module" src="/main-original.js"></script>

<!-- To this -->
<script type="module" src="/main.js"></script>
```

### For Developers
The new modular architecture provides:
- **Enhanced Debugging**: Better error isolation and stack traces
- **Independent Testing**: Each module can be tested separately
- **Easy Extension**: Add new features to specific modules
- **Better Documentation**: Each module is self-documenting

## Architecture Benefits

### Single Responsibility Principle
Each module has a clear, focused responsibility:
- **SplashScreen**: Loading screen management
- **SettingsManager**: Application settings and persistence
- **ShapeManager**: Shape operations and geometry
- **CanvasRenderer**: Drawing and visual rendering
- **EventHandler**: User input and interactions
- **ToolManager**: Drawing tools and properties
- **CodeGenerator**: Godot code generation and exports
- **UIManager**: User interface and modals

### Improved Maintainability
- Easier to locate and fix bugs
- Changes in one module don't affect others
- Clear separation of concerns
- Better code organization

### Enhanced Testability
- Each module can be tested independently
- Easier to mock dependencies
- Better unit test coverage
- Isolated testing environments

### Better Team Development
- Multiple developers can work on different modules
- Reduced merge conflicts
- Clear module boundaries
- Easier code reviews

### Performance Improvements
- Increased Node.js memory limit to 4GB
- Better memory management
- Optimized module loading
- Improved error handling

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

## Technologies Used

- **Vite**: Fast build tool and development server
- **HTML5 Canvas**: For drawing functionality
- **Vanilla JavaScript**: Application logic with ES6+ modules
- **CSS3**: Modern styling with gradients and animations
- **Electron**: Desktop application framework
