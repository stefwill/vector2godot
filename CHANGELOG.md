# Changelog

All notable changes to the Vector2Godot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2025-07-11

### Fixed
- Fixed Windows build failing with NSIS installer creation errors when building from Linux
- Changed Windows build target from "portable" to "zip" format for better cross-platform compatibility
- Updated documentation to reflect new ZIP-based Windows distribution format

### Changed
- Windows distribution now uses ZIP archive format instead of executable installer
- Improved cross-platform build reliability
- Updated installation instructions for Windows users

### Documentation
- Refactored README.md into smaller, focused documentation files
- Created separate docs for Features, User Guide, Architecture, Installation, Contributing, and Roadmap
- Moved CURRENT_STATUS.md to docs/ directory for better organization
- Updated WINDOWS_BUILD.md with fixed build configuration

## [1.4.0] - 2025-07-11

### Added
- **Major**: Modular architecture implementation - broke down the monolithic main.js into discrete modules
- New module structure with separate concerns for better maintainability
- Increased Node.js memory limit with --max-old-space-size=4096 for better performance
- Comprehensive module documentation in MODULAR_ARCHITECTURE.md

### Changed
- **Breaking**: Restructured codebase into modular components
- Renamed main-new.js to main.js as the primary entry point
- Separated application logic into 8 focused modules:
  - SplashScreen.js - Loading screen management
  - SettingsManager.js - Settings persistence and theme management
  - ShapeManager.js - Shape operations and geometric calculations
  - CanvasRenderer.js - Canvas drawing and rendering
  - EventHandler.js - User input and event management
  - ToolManager.js - Drawing tools and properties management
  - CodeGenerator.js - Godot code generation and export formats
  - UIManager.js - UI controls, modals, and notifications
- Improved error handling and debugging capabilities
- Enhanced project structure for better team development

### Technical
- Improved separation of concerns for better testability
- Enhanced maintainability through modular design
- Better memory management for large projects
- Preserved backward compatibility with existing API

## [1.3.8] - 2025-07-11

### Fixed
- Fixed corrupted DOCTYPE declaration in index.html causing internal server error
- Resolved HTML parsing issues that prevented the application from starting
- Updated version numbers across all files to maintain consistency

## [1.3.7] - 2025-07-11

### Fixed
- Enhanced SVG path parsing to better handle complex shapes like shields
- Improved handling of move commands in SVG paths that contain multiple coordinate pairs
- Added support for cubic and quadratic Bezier curves in SVG paths (approximated as line segments)
- Fixed duplicate point removal in SVG polygon creation
- Added debugging output for SVG import troubleshooting

### Removed
- Cleaned up unused syntax highlighting code

## [1.3.6] - 2025-07-11

### Fixed
- **Code Output Display**: Fixed syntax highlighting to properly display HTML instead of showing raw HTML tags
- **Number Formatting**: Rounded coordinate values to whole numbers for cleaner, more readable code
- **Syntax Highlighting**: Enhanced GDScript syntax highlighting with proper HTML escaping
- **Code Formatting**: Improved code readability with better spacing and line breaks

### Enhanced
- **Cleaner Coordinates**: All Vector2 coordinates now display as whole numbers (e.g., `Vector2(45, 163)` instead of `Vector2(45.478625923518344, 162.79559822851883)`)
- **Better HTML Rendering**: Fixed HTML entity escaping in syntax highlighting to prevent display issues
- **Improved Keywords**: Added more GDScript keywords to syntax highlighting (in, range, size, PackedVector2Array)
- **Professional Output**: Code output now matches the requested clean, professional format

### Technical
- Updated `highlightGDScript()` method with proper HTML escaping and formatting
- Fixed coordinate precision in `updateCodeOutput()` to use `.toFixed(0)` for whole numbers
- Enhanced syntax highlighting regex patterns for better keyword recognition

## [1.3.5] - 2025-07-11

### Enhanced
- **Professional Code Output**: Completely redesigned Godot code generation with proper scaling and centering
- **Automatic Scaling**: Generated code now includes dynamic scale_factor calculation for appropriate sizing
- **Smart Centering**: Automatically centers shapes at origin with calculated center_offset
- **Improved Formatting**: Enhanced code structure with better comments and organized sections
- **Polygon Enhancement**: Updated polygon code to use PackedVector2Array with proper point formatting
- **Better Variable Names**: Uses descriptive variable names (rect_pos, rect_size, circle_center, etc.)

### Technical
- Added `calculateBounds()` method to determine shape boundaries
- Added `calculateScaleFactor()` method for automatic scaling based on shape dimensions
- Added `calculateCenterOffset()` method for centering shapes at origin
- Updated `updateCodeOutput()` to generate production-ready Godot code with proper scaling

### Code Output Features
- **Scale Factor**: Automatically calculates appropriate scaling (targets ~150px for largest dimension)
- **Center Offset**: Centers scaled shapes at Vector2.ZERO for easy positioning
- **Clean Comments**: Descriptive comments explaining each section of generated code
- **Polygon Arrays**: Uses PackedVector2Array format for better performance
- **Outline Drawing**: Proper polygon outline drawing with loop closure

## [1.3.4] - 2025-07-11

### Fixed
- Fixed HTML DOCTYPE declaration corruption that was preventing builds from completing
- Improved archive script to properly handle filenames with spaces and special characters
- Fixed Windows executable filename format to use hyphens instead of spaces

### Changed
- **Windows Build**: Updated Windows executable naming from "Vector2Godot 1.3.4.exe" to "Vector2Godot-1.3.4.exe"
- **Archive System**: Simplified archive script to store all archived builds directly in `archive/` folder (no timestamped subfolders)
- **Build Process**: Enhanced archive functionality to properly handle both old and new filename formats

### Technical
- Added `artifactName` configuration to Windows build settings in package.json
- Updated archive script to use robust file iteration instead of problematic glob patterns
- Improved error handling in archive script for files with spaces in names

## [1.3.3] - 2025-07-11

### Added
- Build script improvements: old *.exe and *.AppImage files are now archived instead of deleted
- New npm scripts: `archive` (moves old builds to timestamped folders), `clean:current` (cleans only current build dirs)
- Archive functionality preserves build history in `archive/` folder with timestamps

### Changed
- Updated build scripts (`build-all.sh`, `build.sh`) to call archive function before building
- Updated `.gitignore` to exclude `archive/` folder from version control
- Build process now provides better feedback about archiving previous builds

## [1.3.2] - 2025-07-11

### Fixed
- Updated download links format to use correct GitHub releases URL structure
- Changed from `/latest/download/` to `/download/v{version}/` format
- Fixed corrupted README.md formatting and duplicated content
- Restored proper document structure and version consistency

### Documentation
- Corrected all download links to use the proper versioned release URLs
- Updated installation instructions with correct file names
- Ensured version consistency across all documentation

## [1.3.1] - 2025-07-11

### Documentation
- Confirmed SVG import feature is fully implemented and functional
- SVG import button available in toolbar with upload icon
- Supports comprehensive SVG element parsing including paths, rectangles, circles, lines, polygons, and polylines
- Automatic scaling to fit canvas dimensions
- Real-time Godot code generation for imported SVG elements
- User feedback with success/error notifications

### Technical
- Verified all SVG import functionality is properly connected and working
- Event listeners correctly configured for import button
- Complete SVG parsing and shape conversion pipeline operational

## [1.2.5] - 2025-07-11

### Changed
- Removed macOS as a supported platform
- Updated cross-platform compatibility to focus on Windows and Linux only
- Removed macOS download link and installation instructions
- Updated system requirements to exclude macOS

### Documentation
- Streamlined supported platforms to Windows and Linux
- Updated development build scripts to remove macOS references
- Clarified platform availability in all documentation

## [1.2.4] - 2025-07-11

### Changed
- Removed web application references from documentation
- Updated README.md to focus exclusively on desktop executables
- Removed browser launch link and web app installation instructions
- Enhanced cross-platform compatibility description to include macOS

### Documentation
- Streamlined download section to show only desktop applications
- Updated installation instructions to focus on executable downloads
- Clarified that the application is desktop-only (no web version)

## [1.2.2] - 2025-07-11

### Added
- Download section with direct links to desktop applications for all platforms
- Installation instructions for Windows, Linux, and macOS
- System requirements specifications
- Detailed step-by-step installation guides for each platform

### Documentation
- Enhanced README.md with comprehensive download and installation information
- Added platform-specific executable download links
- Included system requirements and hardware recommendations

## [1.2.1] - 2025-07-11

### Changed
- Updated README.md with comprehensive introduction paragraph
- Enhanced features list with detailed descriptions of all current capabilities
- Improved documentation to better reflect the application's full functionality
- Added descriptions for smart shape detection, canvas controls, and cross-platform compatibility

### Documentation
- Expanded feature descriptions to include all drawing tools and their capabilities
- Added information about zoom, pan, grid system, and canvas controls
- Documented theme switching, settings persistence, and keyboard shortcuts
- Clarified cross-platform compatibility and deployment options

## [1.2.0] - 2025-07-10

### Changed
- Removed all debug console messages for production readiness
- Cleaned up console.log statements throughout the codebase
- Improved code maintainability and performance
- Set default canvas size to 256x256 with 10px grid for better precision

### Fixed
- Eliminated excessive debugging output that was cluttering the browser console
- Streamlined mouse event handling without debug logging

## [1.1.9] - 2025-07-10

### Fixed
- Improved closed shape detection algorithm to properly detect and convert closed shapes drawn with the line tool
- Fixed path building logic to check all available lines instead of just initially connected ones
- Enhanced connection tolerance calculation based on grid size and snap settings
- Cleaned up debug logging for better production readiness

### Changed
- Streamlined closed shape detection code for better performance and maintainability
- Removed excessive debug logging while keeping essential debugging information

## [1.1.8] - 2025-07-10

### Fixed
- **Closed Shape Detection**: Successfully fixed the line-to-polygon conversion feature
  - Refactored buildClosedPath function to check ALL lines in the shapes array instead of just initial connected lines
  - Improved connection detection algorithm to properly build complete closed paths
  - Fixed path building logic to correctly identify and connect line endpoints
  - Closed shapes (triangles, squares, etc.) drawn with the line tool now automatically convert to filled polygons
  - Cleaned up debug logging while maintaining essential feedback

## [1.1.7] - 2025-07-10

### Fixed
- **Closed Shape Detection Bug**: Attempted to fix issues with line-to-polygon conversion
  - Made tolerance dynamic based on grid size and snap-to-grid settings
  - Enhanced connected line finding algorithm to build complete connection graphs
  - Added redrawCanvas() and updateCodeOutput() calls to convertLinesToPolygon method
  - Improved debugging output with enhanced console logging
  - Issue still requires further investigation as conversion is not working properly

## [1.1.6] - 2025-07-10

### Changed
- **UI Layout Reorganization**: Moved drawing tools from floating toolbar to main toolbar
  - Relocated all drawing tools (select, line, rectangle, circle, polygon, eraser) from floating toolbar to right-side tool bar
  - Removed the floating toolbar completely for a cleaner, more organized interface
  - Consolidated all tools in the main toolbar for better accessibility and organization

## [1.1.5] - 2025-07-10

### Fixed
- **Shape Closure Detection**: Enhanced debugging and fixed issues with automatic line-to-polygon conversion
  - Added comprehensive console logging for troubleshooting shape closure detection
  - Increased tolerance from 10 to 25 pixels to better handle grid snapping
  - Improved connection detection logic with detailed distance calculations
  - Enhanced path building algorithm with step-by-step debugging
  - Fixed validation of closed path points and line counting
  - Better handling of endpoint matching for connected lines

### Changed
- **Debug Output**: Added extensive logging to help identify and resolve shape closure issues
- **Tolerance Settings**: Increased connection tolerance to accommodate grid snapping behavior

## [1.1.4] - 2025-07-10

### Added
- **Automatic Shape Closure**: Intelligent detection and conversion of closed line shapes to filled polygons
  - Automatically detects when lines form a closed shape (triangle, square, pentagon, etc.)
  - Converts connected line segments into a single filled polygon
  - Uses 10-pixel tolerance for endpoint connection detection
  - Preserves original stroke color, fill color, and stroke width
  - Automatically enables fill for closed shapes
  - Provides user feedback when shape closure is detected
  - Removes original line segments to avoid duplication
  - Supports complex polygons with multiple sides

### Changed
- **Line Tool Behavior**: Enhanced line drawing to intelligently recognize shape completion
- **User Experience**: Added visual feedback when closed shapes are automatically created

## [1.1.3] - 2025-07-10

### Fixed
- **Build Process**: Fixed white screen issue in built application by correcting build scripts
  - Added missing Vite build step (`npm run build:vite`) to compile web assets before Electron packaging
  - Updated all build scripts (build, build:win, build:linux, build:mac) to include Vite compilation
  - Fixed asset path resolution in production builds
  - Ensures `dist/` folder is properly created with compiled HTML, CSS, and JavaScript
  - Application now displays correctly when built and packaged

### Changed
- **Build Scripts**: Enhanced build process reliability and consistency across platforms

## [1.1.2] - 2025-07-10

### Fixed
- **Fit Canvas Functionality**: Completely reimplemented "Fit Canvas" button to properly fit content to viewport
  - Now calculates bounds of all drawn shapes and fits them optimally in the viewport
  - For empty canvas, fits the logical canvas dimensions to viewport
  - Uses proper zoom and pan system instead of CSS transforms
  - Centers content in viewport with appropriate padding
  - Maintains zoom limits (0.1x to 5x) and updates zoom level display
  - Works consistently with existing zoom and pan controls

## [1.1.1] - 2025-07-10

### Fixed
- **Fit Canvas Button**: Fixed non-functional "Fit Canvas" button by adding missing event listener
  - Button now properly calls `fitCanvasToContainer()` method when clicked
  - Maintains existing keyboard shortcut functionality (Ctrl+F)
  - Button scales canvas to fit optimally within the container

## [1.1.0] - 2025-07-10

### Added
- **Professional Splash Screen**: Enhanced app startup experience with animated branding
  - Large Vector2Godot logo (128px) with smooth animations
  - App name displayed with elegant typography
  - Loading spinner with status text
  - Smooth fade-in/fade-out transitions
  - Minimum display time of 1.5 seconds for optimal UX
  - Theme-aware design compatible with both light and dark modes
  - Animated effects including floating logo and glow effects

### Changed
- **Version Management**: Updated to MINOR version (1.1.0) for new splash screen feature
- **Enhanced README**: Added splash screen feature to features list

## [1.1.0] - 2025-01-24

### Added
- **Splash Screen**: Added beautiful animated splash screen featuring the app icon and name
  - Large, centered Vector2Godot logo with smooth fade-in animation
  - App name displayed below the icon with elegant typography
  - Loading spinner and status text for user feedback
  - Theme-aware design that adapts to light/dark mode
  - Minimum display time of 1.5 seconds for smooth user experience
  - Smooth fade-out transition revealing the main application
  - Responsive design that works across different screen sizes

### Changed
- **Version Bump**: Updated version to 1.1.0 across all project files
- **User Experience**: Enhanced app startup experience with professional branding

## [1.0.9] - 2025-07-10

### Changed
- **Version Management**: Updated version number across all project files
- **App Icon Spacing**: Added vertical spacing around header icon while maintaining 64×64 size
- **Documentation**: Added version badges and meta tags for better version tracking

## [1.0.8] - 2025-07-10

### Changed
- **App Icon Spacing**: Added top and bottom spacing around the app icon in header
- Improved visual balance and professional appearance of header layout

## [1.0.7] - 2025-07-10

### Added
- **App Icon**: Added Vector2Godot icon to header with hover effects
- Enhanced visual branding and professional appearance

## [1.0.6] - 2025-07-10

### Fixed
- **Dark Mode Contrast Improvements**: Comprehensive contrast fixes for all interactive elements
  - Fixed toolbar buttons (Copy Code, Clear Canvas, Fit Canvas) contrast in dark mode
  - Fixed zoom control buttons and zoom level display text contrast
  - Fixed dropdown menu hover states for better visibility
  - Fixed section titles and tool button hover backgrounds
  - Fixed range slider tracks and value displays
  - Fixed modal close buttons and secondary action buttons
  - Fixed tool status and help text contrast
  - Replaced all hardcoded `var(--gray-*)` references with theme-aware variables
  - All interactive elements now meet WCAG contrast guidelines

### Changed
- Enhanced hover states for better visual feedback across all buttons
- Improved consistency in color usage throughout the application
- Better visual integration of all UI elements with dark mode theme

## [1.0.5] - 2025-07-10

### Fixed
- **Button and Icon Dark Mode Support**: Fixed styling for header icons and buttons
  - Fixed code panel toggle button contrast (chevron up/down icon)
  - Fixed theme toggle switch colors and backgrounds
  - Fixed Settings and Help dropdown button hover states
  - Replaced undefined `--border-primary` variable with correct `--border-color`
  - Updated copy button, panel headers, and bottom panel styling for dark mode compatibility

### Changed
- All header buttons now use consistent theme-aware color variables
- Improved visual feedback for all interactive elements
- Enhanced dark mode integration for better user experience

## [1.0.4] - 2025-07-10

### Added
- **Code Window Minimized on Startup**: App now starts with the bottom code panel collapsed by default
  - Added `collapsed` class to bottom panel in HTML
  - Changed initial toggle icon from chevron-up to chevron-down
  - Users can still expand the code window by clicking the toggle button

### Fixed
- Updated bottom panel styling to use theme-aware variables for better dark mode support
- Improved consistency in panel header and code container styling

### Changed
- Enhanced user interface by providing more screen space for drawing on startup
- Maintained easy access to code panel through toggle functionality

## [1.0.3] - 2025-07-10

### Added
- **Manual Value Entry for Sliders**: Added number input fields alongside sliders for precise value control
  - Canvas width and height settings now support manual entry
  - Grid size setting now supports manual entry
  - Stroke width setting now supports manual entry
  - Bidirectional synchronization between sliders and number inputs
  - Input validation to ensure values stay within acceptable ranges

### Changed
- Enhanced modal interfaces with combined slider + number input controls
- Improved user experience for precise value adjustments
- Updated modal CSS styling for new input-slider-group components

### Fixed
- Better value synchronization between different input methods
- Improved modal layout and styling consistency

## [1.0.2] - 2025-07-10

### Fixed
- **Dark Mode Modal Support**: Fixed modal windows to properly support dark mode
  - Updated all modal backgrounds to use theme-aware variables
  - Fixed modal headers, bodies, and button styling for dark mode compatibility
  - Updated text colors and border colors throughout modal interfaces
  - Added/updated `--bg-tertiary` variable for both light and dark themes

### Changed
- Improved modal accessibility and visual consistency across themes
- Enhanced overall dark mode experience for settings and help dialogs

## [1.0.1] - 2025-07-10

### Added
- **Dark Mode Support**: Complete dark theme implementation
  - Added theme toggle switch in header with sun/moon icons
  - Implemented comprehensive dark color scheme
  - Added theme persistence using localStorage
  - All UI elements now support both light and dark themes

### Changed
- Enhanced overall visual design with better color consistency
- Improved contrast ratios for better accessibility
- Updated typography and spacing for modern appearance

### Fixed
- Better visual hierarchy and element separation
- Improved readability in both light and dark modes

## [1.0.0] - 2025-07-10

### Added
- **Initial Release**: Complete vector drawing application for Godot
  - Drawing tools: Select, Line, Rectangle, Circle, and Polygon
  - Real-time Godot `_draw()` code generation
  - Property controls for stroke color, fill color, stroke width, and fill options
  - Modern responsive UI with gradient backgrounds
  - Copy functionality for generated code
  - Canvas zoom and pan controls
  - Grid settings and visual guides
  - Tool settings and customization options
  - Keyboard shortcuts support
  - Built-in help and tutorial system

### Technical Features
- Built with Electron and Vite for desktop application
- HTML5 Canvas for vector drawing functionality
- Vanilla JavaScript with modern ES6+ features
- CSS3 with modern styling, gradients, and animations
- Responsive design that works across different screen sizes

### Code Generation
- Generates proper Godot code using:
  - `draw_line()` for lines
  - `draw_rect()` for rectangles
  - `draw_circle()` and `draw_arc()` for circles
  - `draw_colored_polygon()` and `draw_line()` for polygons
- Proper Vector2 coordinate handling
- Color format conversion for Godot compatibility

---

## Version Format

This project uses [Semantic Versioning](https://semver.org/) with the following format:
- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes and improvements

## Change Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
