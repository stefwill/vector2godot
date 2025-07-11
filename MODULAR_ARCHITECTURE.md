# Vector2Godot - Modular Architecture

This document describes the new modular architecture of Vector2Godot.

## File Structure

```
src/
├── core/                      # Core application logic
│   ├── SplashScreen.js       # Splash screen management
│   ├── SettingsManager.js    # Settings persistence and management
│   ├── ShapeManager.js       # Shape operations and geometric calculations
│   ├── CanvasRenderer.js     # Canvas drawing and rendering
│   ├── EventHandler.js       # User input and event management
│   ├── ToolManager.js        # Drawing tools and properties
│   └── CodeGenerator.js      # Godot code generation
├── ui/                       # User interface components
│   └── UIManager.js          # UI controls, modals, and notifications
└── VectorDrawingApp.js       # Main application coordinator

main-new.js                   # New modular entry point
main.js                       # Original monolithic file (kept for reference)
```

## Module Responsibilities

### Core Modules

**SplashScreen.js**
- Manages the loading screen
- Controls app initialization flow
- Handles loading text updates

**SettingsManager.js**
- Manages application settings
- Handles persistence to localStorage
- Provides default settings
- Theme management

**ShapeManager.js**
- Manages shape collection
- Handles shape creation, modification, and deletion
- Provides geometric calculations
- Shape selection and manipulation

**CanvasRenderer.js**
- Handles all canvas drawing operations
- Manages zoom, pan, and grid display
- Renders shapes and control points
- Canvas sizing and fitting

**EventHandler.js**
- Processes all user input events
- Manages mouse and keyboard interactions
- Handles drawing operations
- Coordinates between tools and canvas

**ToolManager.js**
- Manages drawing tools and tool state
- Handles tool properties (colors, stroke width, etc.)
- Provides tool-specific behavior
- Manages tool UI updates

**CodeGenerator.js**
- Generates Godot _draw() function code
- Handles different export formats (SVG, CSV, PNG)
- Optimizes code output
- Color conversion utilities

### UI Modules

**UIManager.js**
- Manages UI components and interactions
- Handles modals and notifications
- Manages dropdowns and menus
- Theme switching
- Settings dialogs

**VectorDrawingApp.js**
- Main application coordinator
- Initializes and connects all modules
- Handles application lifecycle
- Provides public API
- Manages project save/load

## Benefits of Modular Architecture

1. **Maintainability**: Each module has a single responsibility
2. **Testability**: Modules can be tested independently
3. **Reusability**: Modules can be reused in other projects
4. **Scalability**: Easy to add new features or modify existing ones
5. **Debugging**: Issues can be isolated to specific modules
6. **Team Development**: Multiple developers can work on different modules

## Migration Guide

To use the new modular version:

1. Replace the import in `index.html`:
   ```html
   <!-- Old -->
   <script type="module" src="/main.js"></script>
   
   <!-- New -->
   <script type="module" src="/main-new.js"></script>
   ```

2. The API remains the same - `window.app` is still available
3. All existing functionality is preserved
4. New modular structure allows for easier customization

## Development

When developing new features:

1. Identify which module the feature belongs to
2. Add the feature to the appropriate module
3. Update the module's public API if needed
4. Test the module independently
5. Update the main application if coordination is needed

## Testing

Each module can be tested independently:

```javascript
// Example: Testing ShapeManager
import { ShapeManager } from './src/core/ShapeManager.js';

const shapeManager = new ShapeManager();
const shape = shapeManager.addShape({
  type: 'rectangle',
  startX: 0,
  startY: 0,
  endX: 100,
  endY: 100,
  strokeColor: '#000000',
  fillColor: '#ffffff',
  strokeWidth: 2,
  fillEnabled: true
});

console.assert(shapeManager.getShapes().length === 1, 'Shape should be added');
```

## Future Enhancements

The modular architecture makes it easy to add:

- Plugin system
- Additional export formats
- New drawing tools
- Advanced shape operations
- Collaborative features
- Version control integration

## Backward Compatibility

The original `main.js` file is preserved for reference and backward compatibility. The new modular system provides the same API surface, ensuring existing integrations continue to work.
