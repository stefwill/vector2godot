# Changelog

All notable changes to the Vector2Godot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
