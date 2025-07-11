# Roadmap

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

## Recent Updates

### [1.3.9] - 2025-07-11

#### Added
- **Major**: Modular architecture implementation - broke down the monolithic main.js into discrete modules
- New module structure with separate concerns for better maintainability
- Increased Node.js memory limit with --max-old-space-size=4096 for better performance
- Comprehensive module documentation

#### Changed
- **Breaking**: Restructured codebase into modular components
- Renamed main-new.js to main.js as the primary entry point
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
