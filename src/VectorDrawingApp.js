/**
 * Vector2Godot Main Application
 * Coordinates all modules and manages the application lifecycle
 */
import { SplashScreen } from './core/SplashScreen.js';
import { SettingsManager } from './core/SettingsManager.js';
import { ShapeManager } from './core/ShapeManager.js';
import { CanvasRenderer } from './core/CanvasRenderer.js';
import { EventHandler } from './core/EventHandler.js';
import { ToolManager } from './core/ToolManager.js';
import { CodeGenerator } from './core/CodeGenerator.js';
import { UIManager } from './ui/UIManager.js';

export class VectorDrawingApp {
  constructor() {
    this.isInitialized = false;
    this.version = '1.3.9';
    
    // Initialize modules
    this.settingsManager = new SettingsManager();
    this.shapeManager = new ShapeManager();
    this.codeGenerator = new CodeGenerator();
    this.uiManager = new UIManager();
    
    // Initialize canvas and renderer
    this.canvas = document.getElementById('drawing-canvas');
    this.canvasRenderer = new CanvasRenderer(this.canvas, this.shapeManager);
    
    // Initialize tool manager
    this.toolManager = new ToolManager();
    
    // Initialize event handler
    this.eventHandler = new EventHandler(this.canvasRenderer, this.shapeManager, this.toolManager);
    
    // Code output element
    this.codeOutput = document.getElementById('code-output');
    
    // Initialize the application
    this.init();
  }

  async init() {
    try {
      // Load theme immediately
      this.settingsManager.loadTheme();
      
      // Load settings
      const settings = this.settingsManager.loadSettings();
      this.applySettings(settings);
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Setup menu event listeners
      this.setupMenuEventListeners();
      
      // Create hidden inputs for compatibility
      this.createHiddenInputs();
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Initial canvas setup
      this.canvasRenderer.updateCanvasSize();
      this.canvasRenderer.fitCanvasToContainer();
      this.canvasRenderer.redrawCanvas();
      
      // Initial code output
      this.updateCodeOutput();
      
      // Update UI
      this.uiManager.updateUI();
      
      this.isInitialized = true;
      
      // Show success message
      this.uiManager.showSuccess('Vector2Godot initialized successfully!');
      
    } catch (error) {
      console.error('Failed to initialize Vector2Godot:', error);
      this.uiManager.showError('Failed to initialize application: ' + error.message);
    }
  }

  setupEventListeners() {
    // Listen for shape events
    window.addEventListener('shapeCreated', (e) => {
      this.updateCodeOutput();
    });

    window.addEventListener('shapeDeleted', (e) => {
      this.updateCodeOutput();
    });

    // Listen for tool events
    window.addEventListener('toolChanged', (e) => {
      this.updateCodeOutput();
    });

    // Listen for canvas events
    window.addEventListener('canvasSettingsChanged', (e) => {
      const { width, height } = e.detail;
      this.canvasRenderer.updateCanvasSize(width, height);
      this.updateCodeOutput();
    });

    window.addEventListener('gridSettingsChanged', (e) => {
      const { gridSize, showGrid, snapToGrid } = e.detail;
      this.canvasRenderer.setGridProperties(gridSize, showGrid);
      this.canvasRenderer.redrawCanvas();
    });

    window.addEventListener('propertiesSettingsChanged', (e) => {
      const { strokeColor, fillColor, strokeWidth, fillEnabled } = e.detail;
      this.toolManager.setStrokeColor(strokeColor);
      this.toolManager.setFillColor(fillColor);
      this.toolManager.setStrokeWidth(strokeWidth);
      this.toolManager.setFillEnabled(fillEnabled);
    });

    // Action buttons
    this.setupActionButtons();
  }

  setupActionButtons() {
    // Clear button
    const clearBtns = document.querySelectorAll('#clear-btn, [data-action="clear"]');
    clearBtns.forEach(btn => {
      btn.addEventListener('click', () => this.clearCanvas());
    });
    
    // Copy code button
    const copyBtns = document.querySelectorAll('#copy-code-btn, #copy-code, [data-action="copy"]');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => this.copyCode());
    });
    
    // Fit canvas button
    const fitCanvasBtn = document.getElementById('fit-canvas');
    if (fitCanvasBtn) {
      fitCanvasBtn.addEventListener('click', () => this.fitCanvasToContainer());
    }
    
    // Import SVG button
    const importSVGBtn = document.getElementById('import-svg-btn');
    if (importSVGBtn) {
      importSVGBtn.addEventListener('click', () => this.importSVG());
    }
    
    // Bottom panel toggle
    const toggleBtn = document.getElementById('toggle-code-panel');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.uiManager.toggleCodePanel());
    }
  }

  setupMenuEventListeners() {
    // Settings dropdown items
    const settingsCanvas = document.getElementById('settings-canvas');
    const settingsGrid = document.getElementById('settings-grid');
    const settingsTools = document.getElementById('settings-tools');
    const settingsProperties = document.getElementById('settings-properties');
    
    if (settingsCanvas) {
      settingsCanvas.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.openCanvasSettings();
      });
    }
    
    if (settingsGrid) {
      settingsGrid.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.openGridSettings();
      });
    }
    
    if (settingsTools) {
      settingsTools.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.openToolSettings();
      });
    }
    
    if (settingsProperties) {
      settingsProperties.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.openPropertiesSettings();
      });
    }
    
    // Help dropdown items
    const helpShortcuts = document.getElementById('help-shortcuts');
    const helpTutorial = document.getElementById('help-tutorial');
    const helpAbout = document.getElementById('help-about');
    
    if (helpShortcuts) {
      helpShortcuts.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.showKeyboardShortcuts();
      });
    }
    
    if (helpTutorial) {
      helpTutorial.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.showTutorial();
      });
    }
    
    if (helpAbout) {
      helpAbout.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.showAbout();
      });
    }
    
    // Listen for Electron menu events
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.on('menu-clear', () => {
        this.clearCanvas();
      });
      
      window.electronAPI.on('menu-copy', () => {
        this.copyCode();
      });
      
      window.electronAPI.on('menu-zoom-in', () => {
        const currentZoom = this.canvasRenderer.getCanvasProperties().zoom;
        this.canvasRenderer.setZoom(currentZoom * 1.2);
      });
      
      window.electronAPI.on('menu-zoom-out', () => {
        const currentZoom = this.canvasRenderer.getCanvasProperties().zoom;
        this.canvasRenderer.setZoom(currentZoom * 0.8);
      });
      
      window.electronAPI.on('menu-zoom-reset', () => {
        this.canvasRenderer.setZoom(1);
        this.canvasRenderer.setPan(0, 0);
        this.canvasRenderer.fitCanvasToContainer();
      });
    }
  }

  setupKeyboardShortcuts() {
    // Keyboard shortcuts are handled in EventHandler
    // This is just for any app-level shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            this.saveProject();
            break;
          case 'o':
            e.preventDefault();
            this.openProject();
            break;
          case 'n':
            e.preventDefault();
            this.newProject();
            break;
          case 'e':
            e.preventDefault();
            this.exportProject();
            break;
        }
      }
    });
  }

  createHiddenInputs() {
    // Create hidden inputs for properties that were removed from sidebar
    const hiddenInputs = [
      { id: 'stroke-color', type: 'color', value: '#000000' },
      { id: 'stroke-width', type: 'range', value: '2', min: '1', max: '10' },
      { id: 'fill-color', type: 'color', value: '#ffffff' },
      { id: 'fill-enabled', type: 'checkbox', checked: true },
      { id: 'canvas-width', type: 'range', value: '256', min: '200', max: '1600' },
      { id: 'canvas-height', type: 'range', value: '256', min: '150', max: '1200' },
      { id: 'grid-size', type: 'range', value: '10', min: '5', max: '50' },
      { id: 'show-grid', type: 'checkbox', checked: true },
      { id: 'snap-to-grid', type: 'checkbox', checked: true }
    ];

    const hiddenSpans = [
      { id: 'stroke-width-value', textContent: '2' },
      { id: 'canvas-width-value', textContent: '256' },
      { id: 'canvas-height-value', textContent: '256' },
      { id: 'grid-size-value', textContent: '10' },
      { id: 'zoom-level', textContent: '100%' },
      { id: 'tool-status', textContent: 'Line Tool - Click and drag to draw' }
    ];

    hiddenInputs.forEach(({ id, type, value, checked, min, max }) => {
      if (!document.getElementById(id)) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        if (min) input.min = min;
        if (max) input.max = max;
        if (type === 'checkbox') {
          input.checked = checked;
        } else {
          input.value = value;
        }
        input.style.display = 'none';
        document.body.appendChild(input);
      }
    });

    hiddenSpans.forEach(({ id, textContent }) => {
      if (!document.getElementById(id)) {
        const span = document.createElement('span');
        span.id = id;
        span.textContent = textContent;
        span.style.display = 'none';
        document.body.appendChild(span);
      }
    });
  }

  applySettings(settings) {
    // Apply canvas settings
    this.canvasRenderer.updateCanvasSize(settings.canvasWidth, settings.canvasHeight);
    this.canvasRenderer.setGridProperties(settings.gridSize, settings.showGrid);
    
    // Apply tool settings
    this.toolManager.setStrokeColor(settings.strokeColor);
    this.toolManager.setFillColor(settings.fillColor);
    this.toolManager.setStrokeWidth(settings.strokeWidth);
    
    // Update UI controls
    this.updateHiddenInputs(settings);
  }

  updateHiddenInputs(settings) {
    const updates = [
      { id: 'canvas-width', value: settings.canvasWidth },
      { id: 'canvas-height', value: settings.canvasHeight },
      { id: 'grid-size', value: settings.gridSize },
      { id: 'show-grid', checked: settings.showGrid },
      { id: 'snap-to-grid', checked: settings.snapToGrid },
      { id: 'stroke-width', value: settings.strokeWidth },
      { id: 'stroke-color', value: settings.strokeColor },
      { id: 'fill-color', value: settings.fillColor }
    ];

    updates.forEach(({ id, value, checked }) => {
      const element = document.getElementById(id);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = checked;
        } else {
          element.value = value;
        }
      }
    });

    // Update value displays
    const valueUpdates = [
      { id: 'stroke-width-value', value: settings.strokeWidth },
      { id: 'canvas-width-value', value: settings.canvasWidth },
      { id: 'canvas-height-value', value: settings.canvasHeight },
      { id: 'grid-size-value', value: settings.gridSize }
    ];

    valueUpdates.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  updateCodeOutput() {
    if (!this.codeOutput) return;
    
    const shapes = this.shapeManager.getShapes();
    const canvasProps = this.canvasRenderer.getCanvasProperties();
    const code = this.codeGenerator.generateCode(shapes, canvasProps);
    
    this.codeOutput.textContent = code;
    
    // Dispatch code updated event
    window.dispatchEvent(new CustomEvent('codeUpdated', { detail: { code } }));
  }

  clearCanvas() {
    this.shapeManager.clearShapes();
    this.canvasRenderer.redrawCanvas();
    this.updateCodeOutput();
    this.uiManager.showSuccess('Canvas cleared!');
  }

  async copyCode() {
    try {
      const code = this.codeOutput.textContent;
      await navigator.clipboard.writeText(code);
      this.uiManager.showSuccess('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
      this.uiManager.showError('Failed to copy code to clipboard');
    }
  }

  fitCanvasToContainer() {
    this.canvasRenderer.fitCanvasToContainer();
    this.canvasRenderer.redrawCanvas();
    this.uiManager.showSuccess('Canvas fitted to container!');
  }

  importSVG() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.loadSVGFile(file);
      }
    };
    input.click();
  }

  async loadSVGFile(file) {
    try {
      const text = await file.text();
      // TODO: Implement SVG parsing
      this.uiManager.showWarning('SVG import not yet implemented');
    } catch (error) {
      console.error('Failed to load SVG file:', error);
      this.uiManager.showError('Failed to load SVG file');
    }
  }

  newProject() {
    if (this.shapeManager.getShapes().length > 0) {
      if (confirm('Are you sure you want to start a new project? All unsaved changes will be lost.')) {
        this.clearCanvas();
        this.uiManager.showSuccess('New project started!');
      }
    } else {
      this.uiManager.showSuccess('New project started!');
    }
  }

  saveProject() {
    const projectData = {
      version: this.version,
      shapes: this.shapeManager.getShapes(),
      canvasProperties: this.canvasRenderer.getCanvasProperties(),
      toolProperties: this.toolManager.getToolProperties(),
      timestamp: Date.now()
    };

    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'vector2godot-project.json';
    link.click();

    URL.revokeObjectURL(url);
    this.uiManager.showSuccess('Project saved!');
  }

  openProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.loadProjectFile(file);
      }
    };
    input.click();
  }

  async loadProjectFile(file) {
    try {
      const text = await file.text();
      const projectData = JSON.parse(text);
      
      // Validate project data
      if (!projectData.shapes || !projectData.canvasProperties) {
        throw new Error('Invalid project file format');
      }
      
      // Clear current project
      this.shapeManager.clearShapes();
      
      // Load shapes
      projectData.shapes.forEach(shapeData => {
        this.shapeManager.addShape(shapeData);
      });
      
      // Load canvas properties
      if (projectData.canvasProperties) {
        this.canvasRenderer.updateCanvasSize(
          projectData.canvasProperties.width,
          projectData.canvasProperties.height
        );
        this.canvasRenderer.setGridProperties(
          projectData.canvasProperties.gridSize,
          projectData.canvasProperties.showGrid
        );
      }
      
      // Load tool properties
      if (projectData.toolProperties) {
        this.toolManager.importSettings({ toolProperties: projectData.toolProperties });
      }
      
      // Refresh display
      this.canvasRenderer.redrawCanvas();
      this.updateCodeOutput();
      this.uiManager.updateUI();
      
      this.uiManager.showSuccess('Project loaded successfully!');
      
    } catch (error) {
      console.error('Failed to load project file:', error);
      this.uiManager.showError('Failed to load project file: ' + error.message);
    }
  }

  exportProject() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Export Project</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="export-options">
            <button class="action-btn" onclick="app.exportGodotCode()">Export Godot Code</button>
            <button class="action-btn" onclick="app.exportSVG()">Export SVG</button>
            <button class="action-btn" onclick="app.exportCSV()">Export CSV</button>
            <button class="action-btn" onclick="app.exportPNG()">Export PNG</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
  }

  exportGodotCode() {
    const shapes = this.shapeManager.getShapes();
    const canvasProps = this.canvasRenderer.getCanvasProperties();
    const code = this.codeGenerator.generateCode(shapes, canvasProps);
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'godot_draw_function.gd';
    link.click();
    URL.revokeObjectURL(url);
    
    this.uiManager.showSuccess('Godot code exported!');
  }

  exportSVG() {
    const shapes = this.shapeManager.getShapes();
    const canvasProps = this.canvasRenderer.getCanvasProperties();
    const svg = this.codeGenerator.generateSVGExport(shapes, canvasProps);
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vector2godot-export.svg';
    link.click();
    URL.revokeObjectURL(url);
    
    this.uiManager.showSuccess('SVG exported!');
  }

  exportCSV() {
    const shapes = this.shapeManager.getShapes();
    const csv = this.codeGenerator.generateCSVExport(shapes);
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vector2godot-export.csv';
    link.click();
    URL.revokeObjectURL(url);
    
    this.uiManager.showSuccess('CSV exported!');
  }

  exportPNG() {
    // Create a temporary canvas for export
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    const canvasProps = this.canvasRenderer.getCanvasProperties();
    
    exportCanvas.width = canvasProps.width;
    exportCanvas.height = canvasProps.height;
    
    // Fill with white background
    exportCtx.fillStyle = 'white';
    exportCtx.fillRect(0, 0, canvasProps.width, canvasProps.height);
    
    // Draw shapes
    const shapes = this.shapeManager.getShapes();
    shapes.forEach(shape => {
      // Simple shape rendering for export
      this.drawShapeToCanvas(exportCtx, shape);
    });
    
    // Convert to blob and download
    exportCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vector2godot-export.png';
      link.click();
      URL.revokeObjectURL(url);
      
      this.uiManager.showSuccess('PNG exported!');
    });
  }

  drawShapeToCanvas(ctx, shape) {
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = shape.strokeWidth;
    
    if (shape.fillEnabled) {
      ctx.fillStyle = shape.fillColor;
    }
    
    switch (shape.type) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        break;
      case 'rectangle':
        const x = Math.min(shape.startX, shape.endX);
        const y = Math.min(shape.startY, shape.endY);
        const width = Math.abs(shape.endX - shape.startX);
        const height = Math.abs(shape.endY - shape.startY);
        
        if (shape.fillEnabled) {
          ctx.fillRect(x, y, width, height);
        }
        ctx.strokeRect(x, y, width, height);
        break;
      case 'circle':
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radiusX = Math.abs(shape.endX - shape.startX) / 2;
        const radiusY = Math.abs(shape.endY - shape.startY) / 2;
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        
        if (shape.fillEnabled) {
          ctx.fill();
        }
        ctx.stroke();
        break;
      case 'polygon':
        if (shape.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          
          for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          
          ctx.closePath();
          
          if (shape.fillEnabled) {
            ctx.fill();
          }
          ctx.stroke();
        }
        break;
    }
  }

  // Public API methods
  getVersion() {
    return this.version;
  }

  getShapes() {
    return this.shapeManager.getShapes();
  }

  getCurrentTool() {
    return this.toolManager.getCurrentTool();
  }

  setTool(tool) {
    this.toolManager.setTool(tool);
  }

  isReady() {
    return this.isInitialized;
  }
}
