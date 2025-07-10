# Vector Drawing App for Godot

![Version](https://img.shields.io/badge/version-1.0.9-blue.svg)

A modern web-based vector drawing application that allows users to draw simple shapes and generates the corresponding Godot `_draw()` function code.

## Features

- **Drawing Tools**: Select, Line, Rectangle, Circle, and Polygon tools
- **Real-time Code Generation**: Automatically generates Godot-compatible `_draw()` function code
- **Property Controls**: Customize stroke color, fill color, stroke width, and fill options
- **Modern UI**: Clean, responsive interface with a beautiful gradient background
- **Copy Functionality**: One-click copy of generated code to clipboard

## How to Use

1. **Select a Drawing Tool**: Choose from the available tools in the left toolbar
2. **Draw Shapes**: 
   - **Line**: Click and drag to draw a line
   - **Rectangle**: Click and drag to create a rectangle
   - **Circle**: Click and drag to create a circle
   - **Polygon**: Click to add points, double-click to finish
3. **Customize Properties**: Adjust colors, stroke width, and fill options
4. **View Generated Code**: The Godot `_draw()` code appears in the bottom panel
5. **Copy Code**: Click "Copy Code" to copy the generated code to your clipboard

## Generated Code

The app generates proper Godot code using these drawing functions:
- `draw_line()` for lines
- `draw_rect()` for rectangles  
- `draw_circle()` and `draw_arc()` for circles
- `draw_colored_polygon()` and `draw_line()` for polygons

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
npm run dist:mac      # macOS only
```

### Project Structure
```
vector-app/
├── index.html          # Main HTML file
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
