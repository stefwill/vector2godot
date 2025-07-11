const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// App version
const APP_VERSION = '1.3.8';

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      spellcheck: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'Vector Drawing App for Godot',
    titleBarStyle: process.platform === 'win32' ? 'default' : 'default',
    show: false, // Don't show until ready
    autoHideMenuBar: false,
    vibrancy: process.platform === 'darwin' ? 'sidebar' : undefined,
    backgroundMaterial: process.platform === 'win32' ? 'acrylic' : undefined, // Windows 11 acrylic effect
    transparent: false,
    frame: true
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('dist/index.html');
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });    // Handle window closed
    mainWindow.on('closed', () => {
      // Dereference the window object
      app.quit();
    });

    // Handle menu events from renderer
    mainWindow.webContents.on('did-finish-load', () => {
      // Listen for menu events
      const { ipcMain } = require('electron');
      
      ipcMain.on('menu-clear', () => {
        mainWindow.webContents.send('menu-clear');
      });
      
      ipcMain.on('menu-copy', () => {
        mainWindow.webContents.send('menu-copy');
      });
      
      ipcMain.on('menu-zoom-in', () => {
        mainWindow.webContents.send('menu-zoom-in');
      });
      
      ipcMain.on('menu-zoom-out', () => {
        mainWindow.webContents.send('menu-zoom-out');
      });
      
      ipcMain.on('menu-zoom-reset', () => {
        mainWindow.webContents.send('menu-zoom-reset');
      });
    });

    // Create application menu
    createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // Send message to renderer to clear canvas
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-clear');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Copy Code',
          accelerator: 'CmdOrCtrl+C',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-copy');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-zoom-in');
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-zoom-out');
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('menu-zoom-reset');
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              type: 'info',
              title: 'About Vector Drawing App',
              message: 'Vector Drawing App for Godot',
              detail: `Version ${APP_VERSION}\n\nCreate vector shapes and generate Godot _draw() function code.\n\nBuilt with Electron and modern web technologies.`,
              icon: path.join(__dirname, 'assets/icon.png'),
              buttons: ['OK', 'Visit GitHub'],
              defaultId: 0
            }).then((result) => {
              if (result.response === 1) {
                shell.openExternal('https://github.com');
              }
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
