# 🖥️ Desktop Version Features

Your Vector Drawing App is now available as a standalone desktop application!

## 🚀 **Quick Start**

### **Development Mode:**
```bash
npm run electron-dev
```
Runs both the web server and Electron app with hot reload.

### **Production Build:**
```bash
npm run dist
```
Creates distributable packages in the `release/` folder.

### **Quick Test:**
```bash
npm run electron
```
Runs the Electron app using the built web files.

## 📦 **Available Formats**

### **Linux Packages:**
- **`.AppImage`** - Portable, single-file application (recommended)
- **`.deb`** - For Debian/Ubuntu systems
- **`.rpm`** - For Red Hat/Fedora/SUSE systems

### **Installation:**
```bash
# AppImage (portable)
chmod +x vector-app-1.0.0.AppImage
./vector-app-1.0.0.AppImage

# DEB package
sudo dpkg -i vector-app_1.0.0_amd64.deb

# RPM package
sudo rpm -i vector-app-1.0.0.x86_64.rpm
```

## 🎯 **Desktop-Specific Features**

### **Native Menu Bar:**
- **File → New** (Ctrl+N) - Clear canvas
- **Edit → Copy Code** (Ctrl+C) - Copy generated code
- **View → Zoom In/Out** (Ctrl+Plus/Ctrl+-) - Zoom controls
- **View → Reset Zoom** (Ctrl+0) - Reset to 100%

### **Window Management:**
- **Resizable window** with minimum size constraints
- **Native title bar** and window controls
- **System integration** with taskbar/dock

### **Keyboard Shortcuts:**
- `Ctrl+N` - New/Clear canvas
- `Ctrl+C` - Copy generated code
- `Ctrl+Plus` - Zoom in
- `Ctrl+-` - Zoom out
- `Ctrl+0` - Reset zoom
- `Ctrl+Shift+I` - Developer tools

## 🔧 **Building for Distribution**

### **All Linux Formats:**
```bash
npm run dist
```

### **Specific Format:**
```bash
# AppImage only
npx electron-builder --linux AppImage

# DEB only
npx electron-builder --linux deb

# RPM only
npx electron-builder --linux rpm
```

## 📁 **File Structure**
```
release/
├── vector-app-1.0.0.AppImage          # Portable app
├── vector-app_1.0.0_amd64.deb         # Debian package
├── vector-app-1.0.0.x86_64.rpm        # RPM package
└── linux-unpacked/                    # Unpacked files
```

## 🎨 **App Features in Desktop Mode**

All web features work in desktop mode:
- ✅ Vector drawing tools (Select, Line, Rectangle, Circle, Polygon)
- ✅ Real-time Godot code generation
- ✅ Adjustable grid with snap-to-grid
- ✅ Custom canvas dimensions
- ✅ Shape editing with control points
- ✅ Zoom and pan functionality
- ✅ Property controls (colors, stroke width, fill)

Plus desktop-specific enhancements:
- 🆕 Native menus and shortcuts
- 🆕 System window management
- 🆕 Better performance (no browser overhead)
- 🆕 Offline operation
- 🆕 Direct file system access (future feature)

## 🐧 **Linux Integration**

The app integrates with Linux desktop environments:
- **Application menu** entry
- **File associations** (can be configured)
- **System notifications** support
- **Desktop icon** in applications menu

## 🔄 **Updates**

To update the app:
1. Download new version
2. Replace old AppImage OR
3. Install new DEB/RPM package (overwrites old version)

## 🛠️ **Development**

### **Modify the App:**
1. Edit source files (`main.js`, `style.css`, `index.html`)
2. Test with `npm run electron-dev`
3. Build with `npm run dist`

### **Customize Electron:**
- Edit `electron-main.cjs` for window behavior
- Modify `package.json` build configuration
- Add new menu items or shortcuts

Your Vector Drawing App is now a full-featured desktop application! 🎉
