import './style.css'

// Splash Screen Management
class SplashScreen {
  constructor() {
    this.splashElement = document.getElementById('splash-screen');
    this.appElement = document.getElementById('app');
    this.minDisplayTime = 1500; // Minimum 1.5 seconds
    this.startTime = Date.now();
  }

  hide() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
    
    setTimeout(() => {
      this.splashElement.classList.add('fade-out');
      
      setTimeout(() => {
        this.splashElement.style.display = 'none';
        this.appElement.classList.remove('app-hidden');
        
        // Dispatch custom event for app initialization
        window.dispatchEvent(new CustomEvent('splashComplete'));
      }, 350); // Match CSS transition duration
    }, remainingTime);
  }

  updateLoadingText(text) {
    const loadingText = this.splashElement.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = text;
    }
  }
}

// Initialize splash screen
const splash = new SplashScreen();

// Load theme immediately to prevent flash
const savedTheme = localStorage.getItem('vector2godot-theme') || 'light';
console.log('Loading saved theme:', savedTheme);
document.documentElement.setAttribute('data-theme', savedTheme);

class VectorDrawingApp {
  constructor() {
    this.canvas = document.getElementById('drawing-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.codeOutput = document.getElementById('code-output');
    
    this.currentTool = 'line';
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.shapes = [];
    this.selectedShape = null;
    this.polygonPoints = [];
    
    // Grid properties
    this.gridSize = 20;
    this.showGrid = true;
    this.snapToGrid = true;
    
    // Canvas dimensions
    this.canvasWidth = 1280;
    this.canvasHeight = 720;
    
    // Zoom and pan properties
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.cssScale = 1; // Track CSS transform scale
    
    // Shape editing properties
    this.isEditing = false;
    this.editingShape = null;
    this.editingPoint = null;
    this.controlPoints = [];
    
    this.init();
  }
  
  init() {
    console.log('Vector2Godot app initializing...');
    this.createHiddenInputs(); // Create hidden inputs for properties
    this.setupEventListeners();
    this.setupMenuEventListeners();
    this.setupThemeToggle();
    this.loadSettings();
    this.updateCanvasSize(); // Set initial canvas size and fit to container
    this.updateCursor(); // Set initial cursor
    this.updateToolStatus(); // Set initial tool status
    this.redrawCanvas(); // This will draw the grid and update code output
    this.updateCodeOutput();
    this.setupKeyboardShortcuts();
    this.setupDropdowns();
  }
  
  createHiddenInputs() {
    // Create hidden inputs for properties that were removed from sidebar
    const hiddenInputs = [
      { id: 'stroke-color', type: 'color', value: '#000000' },
      { id: 'stroke-width', type: 'range', value: '2', min: '1', max: '10' },
      { id: 'fill-color', type: 'color', value: '#ffffff' },
      { id: 'fill-enabled', type: 'checkbox', checked: true },
      { id: 'canvas-width', type: 'range', value: '1280', min: '200', max: '1600' },
      { id: 'canvas-height', type: 'range', value: '720', min: '150', max: '1200' },
      { id: 'grid-size', type: 'range', value: '20', min: '5', max: '50' },
      { id: 'show-grid', type: 'checkbox', checked: true },
      { id: 'snap-to-grid', type: 'checkbox', checked: true }
    ];

    const hiddenSpans = [
      { id: 'stroke-width-value', textContent: '2' },
      { id: 'canvas-width-value', textContent: '1280' },
      { id: 'canvas-height-value', textContent: '720' },
      { id: 'grid-size-value', textContent: '20' },
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
  
  setupEventListeners() {
    // Tool selection - handle both old and new tool button classes
    document.querySelectorAll('.tool-btn, .tool-btn-vertical').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tool-btn, .tool-btn-vertical').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.dataset.tool;
        this.polygonPoints = []; // Reset polygon points when switching tools
        
        // Update tool status
        this.updateToolStatus();
        
        // Update cursor based on tool
        this.updateCursor();
      });
    });
    
    // Canvas events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu

    // Listen for window resize to re-fit canvas
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.fitCanvasToContainer();
      }, 100); // Small delay to let layout settle
    });
    
    // Action buttons - both in sidebar and toolbar
    const clearBtns = document.querySelectorAll('#clear-btn, [id="clear-btn"]');
    clearBtns.forEach(btn => {
      btn.addEventListener('click', this.clearCanvas.bind(this));
    });
    
    const copyBtns = document.querySelectorAll('#copy-code-btn, #copy-code, [id="copy-code-btn"]');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', this.copyCode.bind(this));
    });
    
    // Fit canvas button
    const fitCanvasBtn = document.getElementById('fit-canvas');
    if (fitCanvasBtn) {
      fitCanvasBtn.addEventListener('click', this.fitCanvasToContainer.bind(this));
    }
    
    // Bottom panel toggle
    const toggleBtn = document.getElementById('toggle-code-panel');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', this.toggleCodePanel.bind(this));
    }
  }
  
  toggleCodePanel() {
    const panel = document.querySelector('.bottom-panel');
    const toggle = document.getElementById('toggle-code-panel');
    const icon = toggle.querySelector('i');
    
    panel.classList.toggle('collapsed');
    
    if (panel.classList.contains('collapsed')) {
      panel.style.height = '50px';
      icon.className = 'fas fa-chevron-down';
    } else {
      panel.style.height = 'var(--bottom-panel-height)';
      icon.className = 'fas fa-chevron-up';
    }
  }
  
  updateToolStatus() {
    const statusElement = document.getElementById('tool-status');
    const toolNames = {
      select: 'Select Tool - Click to select shapes',
      line: 'Line Tool - Click and drag to draw',
      rectangle: 'Rectangle Tool - Click and drag to draw',
      circle: 'Circle Tool - Click and drag to draw',
      polygon: 'Polygon Tool - Click to add points, double-click to finish',
      brush: 'Brush Tool - Click and drag to paint',
      pencil: 'Pencil Tool - Click and drag to draw freehand',
      eraser: 'Eraser Tool - Click on vertices to remove them',
      eyedropper: 'Eyedropper Tool - Click to pick colors',
      fill: 'Fill Tool - Click to fill areas',
      text: 'Text Tool - Click to add text'
    };
    
    if (statusElement) {
      statusElement.textContent = toolNames[this.currentTool] || 'Unknown Tool';
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
        this.openCanvasSettings();
      });
    }
    
    if (settingsGrid) {
      settingsGrid.addEventListener('click', (e) => {
        e.preventDefault();
        this.openGridSettings();
      });
    }
    
    if (settingsTools) {
      settingsTools.addEventListener('click', (e) => {
        e.preventDefault();
        this.openToolSettings();
      });
    }
    
    if (settingsProperties) {
      settingsProperties.addEventListener('click', (e) => {
        e.preventDefault();
        this.openPropertiesSettings();
      });
    }
    
    // Help dropdown items
    const helpShortcuts = document.getElementById('help-shortcuts');
    const helpTutorial = document.getElementById('help-tutorial');
    const helpAbout = document.getElementById('help-about');
    
    if (helpShortcuts) {
      helpShortcuts.addEventListener('click', (e) => {
        e.preventDefault();
        this.showKeyboardShortcuts();
      });
    }
    
    if (helpTutorial) {
      helpTutorial.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTutorial();
      });
    }
    
    if (helpAbout) {
      helpAbout.addEventListener('click', (e) => {
        e.preventDefault();
        this.showAbout();
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
        this.setZoom(this.zoom * 1.2);
      });
      
      window.electronAPI.on('menu-zoom-out', () => {
        this.setZoom(this.zoom * 0.8);
      });
      
      window.electronAPI.on('menu-zoom-reset', () => {
        this.setZoom(1);
        this.offsetX = 0;
        this.offsetY = 0;
        this.fitCanvasToContainer();
        this.redrawCanvas();
      });
    }
  }
  
  openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'block';
    this.populateSettingsModal();
  }
  
  closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'none';
  }
  
  populateSettingsModal() {
    document.getElementById('default-canvas-width').value = this.canvasWidth;
    document.getElementById('default-canvas-height').value = this.canvasHeight;
    document.getElementById('default-grid-size').value = this.gridSize;
    document.getElementById('default-show-grid').checked = this.showGrid;
    document.getElementById('default-snap-to-grid').checked = this.snapToGrid;
    document.getElementById('default-stroke-width').value = document.getElementById('stroke-width').value;
    document.getElementById('default-stroke-color').value = document.getElementById('stroke-color').value;
    document.getElementById('default-fill-color').value = document.getElementById('fill-color').value;
  }
  
  saveSettings() {
    const settings = {
      canvasWidth: parseInt(document.getElementById('default-canvas-width').value),
      canvasHeight: parseInt(document.getElementById('default-canvas-height').value),
      gridSize: parseInt(document.getElementById('default-grid-size').value),
      showGrid: document.getElementById('default-show-grid').checked,
      snapToGrid: document.getElementById('default-snap-to-grid').checked,
      strokeWidth: parseInt(document.getElementById('default-stroke-width').value),
      strokeColor: document.getElementById('default-stroke-color').value,
      fillColor: document.getElementById('default-fill-color').value
    };
    
    localStorage.setItem('vector2godot-settings', JSON.stringify(settings));
    this.applySettings(settings);
    this.closeSettingsModal();
    
    // Show confirmation
    this.showNotification('Settings saved successfully!');
  }
  
  loadSettings() {
    const savedSettings = localStorage.getItem('vector2godot-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.applySettings(settings);
    }
  }
  
  applySettings(settings) {
    this.canvasWidth = settings.canvasWidth;
    this.canvasHeight = settings.canvasHeight;
    this.gridSize = settings.gridSize;
    this.showGrid = settings.showGrid;
    this.snapToGrid = settings.snapToGrid;
    
    // Update UI controls
    document.getElementById('canvas-width').value = settings.canvasWidth;
    document.getElementById('canvas-width-value').textContent = settings.canvasWidth;
    document.getElementById('canvas-height').value = settings.canvasHeight;
    document.getElementById('canvas-height-value').textContent = settings.canvasHeight;
    document.getElementById('grid-size').value = settings.gridSize;
    document.getElementById('grid-size-value').textContent = settings.gridSize;
    document.getElementById('show-grid').checked = settings.showGrid;
    document.getElementById('snap-to-grid').checked = settings.snapToGrid;
    document.getElementById('stroke-width').value = settings.strokeWidth;
    document.getElementById('stroke-width-value').textContent = settings.strokeWidth;
    document.getElementById('stroke-color').value = settings.strokeColor;
    document.getElementById('fill-color').value = settings.fillColor;
    
    this.updateCanvasSize();
    this.redrawCanvas();
  }
  
  resetSettings() {
    const defaultSettings = {
      canvasWidth: 1280,
      canvasHeight: 720,
      gridSize: 20,
      showGrid: true,
      snapToGrid: true,
      strokeWidth: 2,
      strokeColor: '#000000',
      fillColor: '#ffffff'
    };
    
    this.applySettings(defaultSettings);
    this.populateSettingsModal();
    this.showNotification('Settings reset to defaults!');
  }
  
  updateCursor() {
    const toolStatus = document.getElementById('tool-status');
    
    if (this.currentTool === 'select') {
      this.canvas.style.cursor = 'default';
      toolStatus.textContent = '✋ Select Tool - Click to select shapes';
    } else if (this.currentTool === 'line') {
      this.canvas.style.cursor = 'crosshair';
      toolStatus.textContent = '📏 Line Tool - Click and drag to draw. Lines automatically fill when closed!';
    } else if (this.currentTool === 'rectangle') {
      this.canvas.style.cursor = 'crosshair';
      toolStatus.textContent = '⬜ Rectangle Tool - Click and drag to draw';
    } else if (this.currentTool === 'circle') {
      this.canvas.style.cursor = 'crosshair';
      toolStatus.textContent = '⭕ Circle Tool - Click and drag to draw';
    } else if (this.currentTool === 'polygon') {
      this.canvas.style.cursor = 'crosshair';
      toolStatus.textContent = '🔶 Polygon Tool - Click to add points, double-click to finish';
    } else if (this.currentTool === 'eraser') {
      this.canvas.style.cursor = 'pointer';
      toolStatus.textContent = '🗑️ Eraser Tool - Click on vertices to remove them';
    } else {
      this.canvas.style.cursor = 'crosshair';
      toolStatus.textContent = '🎨 Drawing Tool Active';
    }
  }

  addShape(startX, startY, endX, endY) {
    const strokeColorEl = document.getElementById('stroke-color');
    const fillColorEl = document.getElementById('fill-color');
    const strokeWidthEl = document.getElementById('stroke-width');
    const fillEnabledEl = document.getElementById('fill-enabled');
    
    const strokeColor = strokeColorEl ? strokeColorEl.value : '#000000';
    const fillColor = fillColorEl ? fillColorEl.value : '#ffffff';
    const strokeWidth = strokeWidthEl ? parseInt(strokeWidthEl.value) : 2;
    const fillEnabled = fillEnabledEl ? fillEnabledEl.checked : false;
    
    const shape = {
      type: this.currentTool,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      strokeColor: strokeColor,
      fillColor: fillColor,
      strokeWidth: strokeWidth,
      fillEnabled: fillEnabled
    };
    
    this.shapes.push(shape);
    
    // Check for closed shape if drawing lines
    if (this.currentTool === 'line') {
      this.checkForClosedShape(shape);
    }
  }
  
  checkForClosedShape(newLine) {
    console.log('Checking for closed shape with new line:', newLine);
    const tolerance = 25; // Increased tolerance for grid snapping
    
    // Find all lines that share endpoints with the new line
    const connectedLines = this.findConnectedLines(newLine, tolerance);
    console.log('Found connected lines:', connectedLines.length);
    
    if (connectedLines.length >= 2) { // Need at least 3 total lines (including new one) for a triangle
      console.log('Attempting to build closed path...');
      const closedPath = this.buildClosedPath(newLine, connectedLines, tolerance);
      
      if (closedPath && closedPath.points && closedPath.points.length >= 3) {
        console.log('Closed path found with', closedPath.points.length, 'points');
        // Convert to filled polygon
        this.convertLinesToPolygon(closedPath, newLine.strokeColor, newLine.fillColor, newLine.strokeWidth);
      } else {
        console.log('No valid closed path found');
      }
    } else {
      console.log('Not enough connected lines for a closed shape');
    }
  }
  
  findConnectedLines(targetLine, tolerance) {
    const connected = [];
    console.log('Looking for lines connected to:', targetLine);
    console.log('Current shapes:', this.shapes.length);
    
    for (const shape of this.shapes) {
      if (shape.type !== 'line' || shape === targetLine) continue;
      
      console.log('Checking line:', shape);
      
      // Check if any endpoint of this line is close to any endpoint of target line
      const endpoints = [
        { line: shape, point: { x: shape.startX, y: shape.startY }, isStart: true },
        { line: shape, point: { x: shape.endX, y: shape.endY }, isStart: false }
      ];
      
      const targetEndpoints = [
        { x: targetLine.startX, y: targetLine.startY },
        { x: targetLine.endX, y: targetLine.endY }
      ];
      
      for (const endpoint of endpoints) {
        for (const targetEndpoint of targetEndpoints) {
          const distance = Math.sqrt(
            (endpoint.point.x - targetEndpoint.x) ** 2 + 
            (endpoint.point.y - targetEndpoint.y) ** 2
          );
          
          console.log(`Distance between (${endpoint.point.x}, ${endpoint.point.y}) and (${targetEndpoint.x}, ${targetEndpoint.y}): ${distance}`);
          
          if (distance <= tolerance) {
            console.log('Found connection!');
            connected.push({
              line: shape,
              connectionPoint: endpoint.point,
              isStart: endpoint.isStart,
              targetPoint: targetEndpoint
            });
            break;
          }
        }
      }
    }
    
    console.log('Total connected lines found:', connected.length);
    return connected;
  }
  
  buildClosedPath(startLine, connectedLines, tolerance) {
    console.log('Building closed path starting from line:', startLine);
    console.log('Available connected lines:', connectedLines);
    
    // Build a path by following connected lines
    const usedLines = new Set([startLine]);
    const path = [
      { x: startLine.startX, y: startLine.startY },
      { x: startLine.endX, y: startLine.endY }
    ];
    
    let currentEndpoint = { x: startLine.endX, y: startLine.endY };
    let iterations = 0;
    const maxIterations = 20; // Prevent infinite loops
    
    console.log('Starting path build from endpoint:', currentEndpoint);
    
    while (iterations < maxIterations) {
      iterations++;
      console.log(`Iteration ${iterations}, current endpoint:`, currentEndpoint);
      
      // Find next connected line
      let nextConnection = null;
      
      for (const connection of connectedLines) {
        if (usedLines.has(connection.line)) {
          console.log('Skipping already used line');
          continue;
        }
        
        const distance = Math.sqrt(
          (connection.connectionPoint.x - currentEndpoint.x) ** 2 + 
          (connection.connectionPoint.y - currentEndpoint.y) ** 2
        );
        
        console.log(`Checking connection distance: ${distance} (tolerance: ${tolerance})`);
        
        if (distance <= tolerance) {
          nextConnection = connection;
          console.log('Found next connection:', nextConnection);
          break;
        }
      }
      
      if (!nextConnection) {
        console.log('No more connections found');
        break;
      }
      
      // Add the line to our path
      usedLines.add(nextConnection.line);
      
      // Determine the other endpoint of this line
      const otherEndpoint = nextConnection.isStart ? 
        { x: nextConnection.line.endX, y: nextConnection.line.endY } :
        { x: nextConnection.line.startX, y: nextConnection.line.startY };
      
      console.log('Adding point to path:', otherEndpoint);
      path.push(otherEndpoint);
      currentEndpoint = otherEndpoint;
      
      // Check if we've closed the shape (back to start)
      const distanceToStart = Math.sqrt(
        (currentEndpoint.x - startLine.startX) ** 2 + 
        (currentEndpoint.y - startLine.startY) ** 2
      );
      
      console.log(`Distance to start: ${distanceToStart}, used lines: ${usedLines.size}`);
      
      if (distanceToStart <= tolerance && usedLines.size >= 3) {
        console.log('Shape closed! Removing duplicate end point');
        // Remove the duplicate start point
        path.pop();
        return { points: path, lines: Array.from(usedLines) };
      }
    }
    
    console.log('Failed to build closed path');
    return null; // No closed path found
  }
  
  convertLinesToPolygon(closedPath, strokeColor, fillColor, strokeWidth) {
    // Create a new filled polygon
    const polygon = {
      type: 'polygon',
      points: closedPath.points,
      strokeColor: strokeColor,
      fillColor: fillColor,
      strokeWidth: strokeWidth,
      fillEnabled: true // Always enable fill for closed shapes
    };
    
    // Remove the original lines
    this.shapes = this.shapes.filter(shape => !closedPath.lines.includes(shape));
    
    // Add the polygon
    this.shapes.push(polygon);
    
    // Show feedback to user
    const toolStatus = document.getElementById('tool-status');
    if (toolStatus) {
      toolStatus.textContent = `✨ Closed shape detected! Converted ${closedPath.lines.length} lines to filled polygon`;
      setTimeout(() => {
        this.updateToolStatus();
      }, 2000);
    }
  }

  addPolygon() {
    if (this.polygonPoints.length < 3) return;
    
    const strokeColorEl = document.getElementById('stroke-color');
    const fillColorEl = document.getElementById('fill-color');
    const strokeWidthEl = document.getElementById('stroke-width');
    const fillEnabledEl = document.getElementById('fill-enabled');
    
    const strokeColor = strokeColorEl ? strokeColorEl.value : '#000000';
    const fillColor = fillColorEl ? fillColorEl.value : '#ffffff';
    const strokeWidth = strokeWidthEl ? parseInt(strokeWidthEl.value) : 2;
    const fillEnabled = fillEnabledEl ? fillEnabledEl.checked : false;
    
    const shape = {
      type: 'polygon',
      points: [...this.polygonPoints], // Clone the points array
      strokeColor: strokeColor,
      fillColor: fillColor,
      strokeWidth: strokeWidth,
      fillEnabled: fillEnabled
    };
    
    this.shapes.push(shape);
  }

  eraseVertex(x, y) {
    const tolerance = 15 / this.zoom; // Click tolerance in pixels
    let vertexRemoved = false;
    
    // Iterate through shapes in reverse order (top to bottom)
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      
      if (shape.type === 'polygon') {
        // Check each vertex of the polygon
        for (let j = shape.points.length - 1; j >= 0; j--) {
          const point = shape.points[j];
          const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
          
          if (distance <= tolerance) {
            // Remove this vertex
            shape.points.splice(j, 1);
            vertexRemoved = true;
            
            // If polygon has less than 3 points, remove the entire shape
            if (shape.points.length < 3) {
              this.shapes.splice(i, 1);
              if (this.selectedShape === shape) {
                this.selectedShape = null;
                this.controlPoints = [];
              }
            }
            break;
          }
        }
      } else if (shape.type === 'line') {
        // For lines, check start and end points
        const startDistance = Math.sqrt((x - shape.startX) ** 2 + (y - shape.startY) ** 2);
        const endDistance = Math.sqrt((x - shape.endX) ** 2 + (y - shape.endY) ** 2);
        
        if (startDistance <= tolerance || endDistance <= tolerance) {
          // Remove the entire line since it needs both points
          this.shapes.splice(i, 1);
          if (this.selectedShape === shape) {
            this.selectedShape = null;
            this.controlPoints = [];
          }
          vertexRemoved = true;
        }
      } else if (shape.type === 'rectangle' || shape.type === 'circle') {
        // For rectangles and circles, check corner points or center
        const corners = this.getShapeVertices(shape);
        for (const corner of corners) {
          const distance = Math.sqrt((x - corner.x) ** 2 + (y - corner.y) ** 2);
          if (distance <= tolerance) {
            // Remove the entire shape since it's a primitive
            this.shapes.splice(i, 1);
            if (this.selectedShape === shape) {
              this.selectedShape = null;
              this.controlPoints = [];
            }
            vertexRemoved = true;
            break;
          }
        }
      }
      
      if (vertexRemoved) break; // Only remove one vertex per click
    }
    
    if (vertexRemoved) {
      this.redrawCanvas();
      this.updateCodeOutput();
      
      // Update tool status
      const toolStatus = document.getElementById('tool-status');
      toolStatus.textContent = '🗑️ Vertex removed! Click on vertices to erase them.';
      setTimeout(() => {
        this.updateCursor();
      }, 1500);
    } else {
      // No vertex found
      const toolStatus = document.getElementById('tool-status');
      toolStatus.textContent = '🗑️ No vertex found. Click closer to a vertex to erase it.';
      setTimeout(() => {
        this.updateCursor();
      }, 1500);
    }
  }

  getShapeVertices(shape) {
    const vertices = [];
    
    switch (shape.type) {
      case 'rectangle':
        vertices.push(
          { x: shape.startX, y: shape.startY },
          { x: shape.endX, y: shape.startY },
          { x: shape.endX, y: shape.endY },
          { x: shape.startX, y: shape.endY }
        );
        break;
      case 'circle':
        // For circles, we'll consider the center and 4 cardinal points as vertices
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radiusX = Math.abs(shape.endX - shape.startX) / 2;
        const radiusY = Math.abs(shape.endY - shape.startY) / 2;
        
        vertices.push(
          { x: centerX, y: centerY }, // Center
          { x: centerX - radiusX, y: centerY }, // Left
          { x: centerX + radiusX, y: centerY }, // Right
          { x: centerX, y: centerY - radiusY }, // Top
          { x: centerX, y: centerY + radiusY }  // Bottom
        );
        break;
      case 'line':
        vertices.push(
          { x: shape.startX, y: shape.startY },
          { x: shape.endX, y: shape.endY }
        );
        break;
      case 'polygon':
        return shape.points;
    }
    
    return vertices;
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    
    // Get mouse position relative to the canvas element (considering CSS scaling)
    let x = (e.clientX - rect.left) / this.cssScale;
    let y = (e.clientY - rect.top) / this.cssScale;
    
    // Convert from canvas coordinate space to drawing coordinate space
    x = (x - this.offsetX) / this.zoom;
    y = (y - this.offsetY) / this.zoom;
    
    // Snap to grid if enabled
    if (this.snapToGrid && this.currentTool !== 'select') {
      x = Math.round(x / this.gridSize) * this.gridSize;
      y = Math.round(y / this.gridSize) * this.gridSize;
    }
    
    return { x, y };
  }
  
  handleMouseDown(e) {
    console.log('Mouse down event triggered, current tool:', this.currentTool);
    const pos = this.getMousePos(e);
    console.log('Mouse position:', pos);
    
    if (this.currentTool === 'select') {
      // Check if clicking on a control point
      const controlPoint = this.getControlPointAt(pos.x, pos.y);
      if (controlPoint) {
        this.isEditing = true;
        this.editingPoint = controlPoint;
        return;
      }
      
      // Check if clicking on a shape
      const clickedShape = this.getShapeAt(pos.x, pos.y);
      if (clickedShape) {
        this.selectedShape = clickedShape;
        this.generateControlPoints(clickedShape);
        this.redrawCanvas();
        return;
      }
      
      // Start panning if shift is held or right mouse button
      if (e.shiftKey || e.button === 2) {
        this.isPanning = true;
        this.panStartX = e.clientX - this.offsetX;
        this.panStartY = e.clientY - this.offsetY;
        return;
      }
      
      // Deselect shape
      this.selectedShape = null;
      this.controlPoints = [];
      this.redrawCanvas();
      return;
    }
    
    if (this.currentTool === 'eraser') {
      this.eraseVertex(pos.x, pos.y);
      return;
    }
    
    if (this.currentTool === 'polygon') return; // Polygon uses click events
    
    this.startX = pos.x;
    this.startY = pos.y;
    this.isDrawing = true;
    console.log('Started drawing at:', this.startX, this.startY);
    
    // Update tool status to show we're drawing
    const toolStatus = document.getElementById('tool-status');
    if (toolStatus) {
      toolStatus.textContent = `Drawing ${this.currentTool} from (${Math.round(this.startX)}, ${Math.round(this.startY)})`;
    }
  }
  
  handleMouseMove(e) {
    const pos = this.getMousePos(e);
    
    // Handle panning
    if (this.isPanning) {
      this.offsetX = e.clientX - this.panStartX;
      this.offsetY = e.clientY - this.panStartY;
      this.redrawCanvas();
      return;
    }
    
    // Handle control point editing
    if (this.isEditing && this.editingPoint) {
      this.updateShapeFromControlPoint(this.editingPoint, pos.x, pos.y);
      this.generateControlPoints(this.selectedShape);
      this.redrawCanvas();
      this.updateCodeOutput();
      return;
    }
    
    // Handle polygon preview line
    if (this.currentTool === 'polygon' && this.polygonPoints.length > 0) {
      this.redrawCanvas();
      // Draw line from last point to current mouse position
      const lastPoint = this.polygonPoints[this.polygonPoints.length - 1];
      const strokeColor = document.getElementById('stroke-color')?.value || '#000000';
      const strokeWidth = parseInt(document.getElementById('stroke-width')?.value || '2');
      
      this.ctx.save();
      this.ctx.setTransform(this.zoom, 0, 0, this.zoom, this.offsetX, this.offsetY);
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = strokeWidth / this.zoom;
      this.ctx.setLineDash([5, 5]);
      this.ctx.globalAlpha = 0.7;
      
      this.ctx.beginPath();
      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
      
      this.ctx.restore();
      return;
    }
    
    if (!this.isDrawing || this.currentTool === 'select' || this.currentTool === 'eraser') return;
    
    this.redrawCanvas();
    this.drawPreview(this.startX, this.startY, pos.x, pos.y);
  }
  
  handleMouseUp(e) {
    console.log('Mouse up event triggered, isDrawing:', this.isDrawing, 'currentTool:', this.currentTool);
    
    if (this.isPanning) {
      this.isPanning = false;
      return;
    }
    
    if (this.isEditing) {
      this.isEditing = false;
      this.editingPoint = null;
      return;
    }
    
    if (!this.isDrawing || this.currentTool === 'polygon' || this.currentTool === 'select' || this.currentTool === 'eraser') {
      return;
    }
    
    const pos = this.getMousePos(e);
    console.log('Adding shape from:', this.startX, this.startY, 'to:', pos.x, pos.y);
    this.addShape(this.startX, this.startY, pos.x, pos.y);
    this.isDrawing = false;
    console.log('Total shapes after adding:', this.shapes.length);
    this.redrawCanvas();
    this.updateCodeOutput();
  }
  
  handleClick(e) {
    if (this.currentTool !== 'polygon') return;
    
    const pos = this.getMousePos(e);
    const toolStatus = document.getElementById('tool-status');
    
    // Double-click to finish polygon
    if (e.detail === 2) {
      if (this.polygonPoints.length >= 3) {
        this.addPolygon();
        toolStatus.textContent = '🔶 Polygon completed! Click to start a new one.';
        setTimeout(() => {
          this.updateCursor();
        }, 2000);
      } else {
        toolStatus.textContent = '🔶 Need at least 3 points to create a polygon';
        setTimeout(() => {
          this.updateCursor();
        }, 2000);
      }
      this.polygonPoints = [];
      this.redrawCanvas();
      this.updateCodeOutput();
      return;
    }
    
    // Single click to add point
    this.polygonPoints.push({ x: pos.x, y: pos.y });
    
    // Update status based on points
    if (this.polygonPoints.length === 1) {
      toolStatus.textContent = '🔶 First point placed! Click to add more points.';
    } else if (this.polygonPoints.length === 2) {
      toolStatus.textContent = '🔶 Two points placed! Add one more for a polygon.';
    } else {
      toolStatus.textContent = `🔶 ${this.polygonPoints.length} points placed. Double-click to finish.`;
    }
    
    this.redrawCanvas();
  }
  
  handleWheel(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    
    // Get mouse position relative to the canvas (accounting for CSS scale)
    const mouseX = (e.clientX - rect.left) / this.cssScale;
    const mouseY = (e.clientY - rect.top) / this.cssScale;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, this.zoom * zoomFactor));
    
    // Remove CSS transform when manually zooming
    this.canvas.style.transform = '';
    this.cssScale = 1; // Reset CSS scale
    
    // Zoom towards mouse position
    this.offsetX = mouseX - (mouseX - this.offsetX) * (newZoom / this.zoom);
    this.offsetY = mouseY - (mouseY - this.offsetY) * (newZoom / this.zoom);
    
    this.setZoom(newZoom);
  }
  
  setZoom(zoom) {
    this.zoom = Math.max(0.1, Math.min(5, zoom));
    // Remove CSS transform when manually zooming
    this.canvas.style.transform = '';
    this.cssScale = 1; // Reset CSS scale
    this.redrawCanvas();
    document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
  }
  
  getShapeAt(x, y) {
    // Check shapes in reverse order (top to bottom)
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      if (this.isPointInShape(x, y, shape)) {
        return shape;
      }
    }
    return null;
  }
  
  isPointInShape(x, y, shape) {
    const tolerance = 5 / this.zoom;
    
    switch (shape.type) {
      case 'line':
        return this.distanceToLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY) < tolerance;
      
      case 'rectangle':
        const rectX = Math.min(shape.startX, shape.endX);
        const rectY = Math.min(shape.startY, shape.endY);
        const rectWidth = Math.abs(shape.endX - shape.startX);
        const rectHeight = Math.abs(shape.endY - shape.startY);
        return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
      
      case 'circle':
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radius = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2) / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return distance <= radius;
      
      case 'polygon':
        return this.isPointInPolygon(x, y, shape.points);
    }
    return false;
  }
  
  distanceToLine(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  isPointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      if (((points[i].y > y) !== (points[j].y > y)) &&
          (x < (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
        inside = !inside;
      }
    }
    return inside;
  }
  
  generateControlPoints(shape) {
    this.controlPoints = [];
    
    switch (shape.type) {
      case 'line':
        this.controlPoints.push(
          { x: shape.startX, y: shape.startY, type: 'start' },
          { x: shape.endX, y: shape.endY, type: 'end' }
        );
        break;
      
      case 'rectangle':
        const rectX = Math.min(shape.startX, shape.endX);
        const rectY = Math.min(shape.startY, shape.endY);
        const rectWidth = Math.abs(shape.endX - shape.startX);
        const rectHeight = Math.abs(shape.endY - shape.startY);
        
        this.controlPoints.push(
          { x: rectX, y: rectY, type: 'topLeft' },
          { x: rectX + rectWidth, y: rectY, type: 'topRight' },
          { x: rectX + rectWidth, y: rectY + rectHeight, type: 'bottomRight' },
          { x: rectX, y: rectY + rectHeight, type: 'bottomLeft' }
        );
        break;
      
      case 'circle':
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radius = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2) / 2;
        
        this.controlPoints.push(
          { x: centerX, y: centerY, type: 'center' },
          { x: centerX + radius, y: centerY, type: 'radius' },
          { x: centerX, y: centerY - radius, type: 'radiusTop' },
          { x: centerX - radius, y: centerY, type: 'radiusLeft' },
          { x: centerX, y: centerY + radius, type: 'radiusBottom' }
        );
        break;
      
      case 'polygon':
        shape.points.forEach((point, index) => {
          this.controlPoints.push({ x: point.x, y: point.y, type: 'point', index });
        });
        break;
    }
  }
  
  getControlPointAt(x, y) {
    const tolerance = 8 / this.zoom;
    for (const point of this.controlPoints) {
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      if (distance < tolerance) {
        return point;
      }
    }
    return null;
  }
  
  updateShapeFromControlPoint(controlPoint, newX, newY) {
    if (!this.selectedShape) return;
    
    const shape = this.selectedShape;
    
    switch (shape.type) {
      case 'line':
        if (controlPoint.type === 'start') {
          shape.startX = newX;
          shape.startY = newY;
        } else if (controlPoint.type === 'end') {
          shape.endX = newX;
          shape.endY = newY;
        }
        break;
      
      case 'rectangle':
        this.updateRectangleFromControlPoint(shape, controlPoint, newX, newY);
        break;
      
      case 'circle':
        this.updateCircleFromControlPoint(shape, controlPoint, newX, newY);
        break;
      
      case 'polygon':
        if (controlPoint.type === 'point') {
          shape.points[controlPoint.index].x = newX;
          shape.points[controlPoint.index].y = newY;
        }
        break;
    }
  }
  
  updateRectangleFromControlPoint(shape, controlPoint, newX, newY) {
    switch (controlPoint.type) {
      case 'topLeft':
        shape.startX = newX;
        shape.startY = newY;
        break;
      case 'topRight':
        shape.endX = newX;
        shape.startY = newY;
        break;
      case 'bottomRight':
        shape.endX = newX;
        shape.endY = newY;
        break;
      case 'bottomLeft':
        shape.startX = newX;
        shape.endY = newY;
        break;
    }
  }
  
  updateCircleFromControlPoint(shape, controlPoint, newX, newY) {
    const centerX = (shape.startX + shape.endX) / 2;
    const centerY = (shape.startY + shape.endY) / 2;
    
    if (controlPoint.type === 'center') {
      const deltaX = newX - centerX;
      const deltaY = newY - centerY;
      shape.startX += deltaX;
      shape.startY += deltaY;
      shape.endX += deltaX;
      shape.endY += deltaY;
    } else if (controlPoint.type.startsWith('radius')) {
      const newRadius = Math.sqrt((newX - centerX) ** 2 + (newY - centerY) ** 2);
      shape.startX = centerX - newRadius;
      shape.startY = centerY - newRadius;
      shape.endX = centerX + newRadius;
      shape.endY = centerY + newRadius;
    }
  }
  
  drawPreview(startX, startY, endX, endY) {
    console.log('Drawing preview from', startX, startY, 'to', endX, endY, 'with tool:', this.currentTool);
    
    const strokeColorEl = document.getElementById('stroke-color');
    const fillColorEl = document.getElementById('fill-color');
    const strokeWidthEl = document.getElementById('stroke-width');
    const fillEnabledEl = document.getElementById('fill-enabled');
    
    const strokeColor = strokeColorEl ? strokeColorEl.value : '#000000';
    const fillColor = fillColorEl ? fillColorEl.value : '#ffffff';
    const strokeWidth = strokeWidthEl ? parseInt(strokeWidthEl.value) : 2;
    const fillEnabled = fillEnabledEl ? fillEnabledEl.checked : false;
    
    console.log('Preview properties:', { strokeColor, fillColor, strokeWidth, fillEnabled });
    
    this.ctx.save();
    this.ctx.setTransform(this.zoom, 0, 0, this.zoom, this.offsetX, this.offsetY);
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fillStyle = fillColor;
    this.ctx.lineWidth = strokeWidth / this.zoom;
    
    switch (this.currentTool) {
      case 'line':
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        break;
        
      case 'rectangle':
        const width = endX - startX;
        const height = endY - startY;
        if (fillEnabled) {
          this.ctx.fillRect(startX, startY, width, height);
        }
        this.ctx.strokeRect(startX, startY, width, height);
        break;
        
      case 'circle':
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        if (fillEnabled) {
          this.ctx.fill();
        }
        this.ctx.stroke();
        break;
    }
    
    this.ctx.restore();
  }
  
  drawPolygonPreview() {
    if (this.polygonPoints.length < 2) return;
    
    const strokeColorEl = document.getElementById('stroke-color');
    const fillColorEl = document.getElementById('fill-color');
    const strokeWidthEl = document.getElementById('stroke-width');
    const fillEnabledEl = document.getElementById('fill-enabled');
    
    const strokeColor = strokeColorEl ? strokeColorEl.value : '#000000';
    const fillColor = fillColorEl ? fillColorEl.value : '#ffffff';
    const strokeWidth = strokeWidthEl ? parseInt(strokeWidthEl.value) : 2;
    const fillEnabled = fillEnabledEl ? fillEnabledEl.checked : false;
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fillStyle = fillColor;
    this.ctx.lineWidth = strokeWidth;
    
    // Draw the polygon shape if we have enough points
    if (this.polygonPoints.length >= 3) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
      for (let i = 1; i < this.polygonPoints.length; i++) {
        this.ctx.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
      }
      this.ctx.closePath();
      
      // Fill the polygon if enabled
      if (fillEnabled) {
        this.ctx.fill();
      }
      
      // Draw the outline
      this.ctx.stroke();
    } else {
      // Draw just the line segments for incomplete polygon
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
      for (let i = 1; i < this.polygonPoints.length; i++) {
        this.ctx.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
      }
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
    
    // Draw points
    this.ctx.fillStyle = strokeColor;
    this.polygonPoints.forEach((point, index) => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      this.ctx.fill();
      
      // Add point numbers for better UX
      this.ctx.fillStyle = 'white';
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText((index + 1).toString(), point.x, point.y + 3);
      this.ctx.fillStyle = strokeColor;
    });
  }
  
  drawGrid() {
    if (!this.showGrid) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([]);
    
    // Draw vertical lines
    for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  redrawCanvas() {
    console.log('Redrawing canvas with', this.shapes.length, 'shapes');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.ctx.setTransform(this.zoom, 0, 0, this.zoom, this.offsetX, this.offsetY);
    
    // Draw grid first (behind shapes)
    this.drawGrid();
    
    this.shapes.forEach((shape, index) => {
      console.log('Drawing shape', index, ':', shape);
      // Highlight selected shape
      if (shape === this.selectedShape) {
        this.ctx.save();
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = (shape.strokeWidth + 2) / this.zoom;
        this.ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);
        this.drawShape(shape);
        this.ctx.restore();
      }
      
      this.ctx.strokeStyle = shape.strokeColor;
      this.ctx.fillStyle = shape.fillColor;
      this.ctx.lineWidth = shape.strokeWidth / this.zoom;
      this.ctx.setLineDash([]);
      
      this.drawShape(shape);
    });
    
    // Draw polygon preview
    if (this.currentTool === 'polygon' && this.polygonPoints.length > 0) {
      this.drawPolygonPreview();
    }
    
    this.ctx.restore();
    
    // Draw control points (not affected by zoom transform)
    this.drawControlPoints();
  }
  
  drawShape(shape) {
    switch (shape.type) {
      case 'line':
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        break;
        
      case 'rectangle':
        const width = shape.endX - shape.startX;
        const height = shape.endY - shape.startY;
        if (shape.fillEnabled) {
          this.ctx.fillRect(shape.startX, shape.startY, width, height);
        }
        this.ctx.strokeRect(shape.startX, shape.startY, width, height);
        break;
        
      case 'circle':
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radius = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2) / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        if (shape.fillEnabled) {
          this.ctx.fill();
        }
        this.ctx.stroke();
        break;
        
      case 'polygon':
        if (shape.points.length >= 3) {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          this.ctx.closePath();
          if (shape.fillEnabled) {
            this.ctx.fill();
          }
          this.ctx.stroke();
        }
        break;
    }
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  colorToGodot(hex) {
    const rgb = this.hexToRgb(hex);
    return `Color(${(rgb.r / 255).toFixed(3)}, ${(rgb.g / 255).toFixed(3)}, ${(rgb.b / 255).toFixed(3)})`;
  }
  
  // Simple GDScript syntax highlighting
  highlightGDScript(code) {
    return code
      .replace(/\b(func|var|const|class|extends|export|onready|signal|enum|static|return|if|else|elif|for|while|match|pass|break|continue|true|false|null|self|super)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b(Vector2|Rect2|Color|TAU|PI)\b/g, '<span style="color: #4ec9b0;">$1</span>')
      .replace(/\b(draw_line|draw_rect|draw_circle|draw_arc|draw_colored_polygon)\b/g, '<span style="color: #dcdcaa;">$1</span>')
      .replace(/#[^\n]*/g, '<span style="color: #6a9955;">$&</span>')
      .replace(/\b\d+\.?\d*\b/g, '<span style="color: #b5cea8;">$&</span>')
      .replace(/"[^"]*"/g, '<span style="color: #ce9178;">$&</span>');
  }
  
  updateCodeOutput() {
    let code = `func _draw():\n\t# Canvas size: ${this.canvasWidth}x${this.canvasHeight}\n`;
    
    if (this.shapes.length === 0) {
      code += '\t# No shapes to draw\n\tpass';
    } else {
      this.shapes.forEach((shape, index) => {
        code += `\t# Shape ${index + 1}: ${shape.type}\n`;
        
        switch (shape.type) {
          case 'line':
            code += `\tdraw_line(Vector2(${shape.startX}, ${shape.startY}), Vector2(${shape.endX}, ${shape.endY}), ${this.colorToGodot(shape.strokeColor)}, ${shape.strokeWidth})\n\n`;
            break;
            
          case 'rectangle':
            const rectX = Math.min(shape.startX, shape.endX);
            const rectY = Math.min(shape.startY, shape.endY);
            const rectWidth = Math.abs(shape.endX - shape.startX);
            const rectHeight = Math.abs(shape.endY - shape.startY);
            
            if (shape.fillEnabled) {
              code += `\tdraw_rect(Rect2(${rectX}, ${rectY}, ${rectWidth}, ${rectHeight}), ${this.colorToGodot(shape.fillColor)})\n`;
            }
            code += `\tdraw_rect(Rect2(${rectX}, ${rectY}, ${rectWidth}, ${rectHeight}), ${this.colorToGodot(shape.strokeColor)}, false, ${shape.strokeWidth})\n\n`;
            break;
            
          case 'circle':
            const centerX = (shape.startX + shape.endX) / 2;
            const centerY = (shape.startY + shape.endY) / 2;
            const radius = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2) / 2;
            
            if (shape.fillEnabled) {
              code += `\tdraw_circle(Vector2(${centerX.toFixed(1)}, ${centerY.toFixed(1)}), ${radius.toFixed(1)}, ${this.colorToGodot(shape.fillColor)})\n`;
            }
            code += `\tdraw_arc(Vector2(${centerX.toFixed(1)}, ${centerY.toFixed(1)}), ${radius.toFixed(1)}, 0, TAU, 64, ${this.colorToGodot(shape.strokeColor)}, ${shape.strokeWidth})\n\n`;
            break;
            
          case 'polygon':
            if (shape.points.length >= 3) {
              const points = shape.points.map(p => `Vector2(${p.x}, ${p.y})`).join(', ');
              
              if (shape.fillEnabled) {
                code += `\tdraw_colored_polygon([${points}], ${this.colorToGodot(shape.fillColor)})\n`;
              }
              
              // Draw polygon outline by drawing lines between consecutive points
              for (let i = 0; i < shape.points.length; i++) {
                const current = shape.points[i];
                const next = shape.points[(i + 1) % shape.points.length];
                code += `\tdraw_line(Vector2(${current.x}, ${current.y}), Vector2(${next.x}, ${next.y}), ${this.colorToGodot(shape.strokeColor)}, ${shape.strokeWidth})\n`;
              }
              code += '\n';
            }
            break;
        }
      });
    }
    
    // Update the code element content with syntax highlighting
    if (this.codeOutput) {
      this.codeOutput.innerHTML = this.highlightGDScript(code);
    }
  }
  
  clearCanvas() {
    if (this.shapes.length > 0) {
      const confirmed = confirm('Are you sure you want to clear all shapes? This cannot be undone.');
      if (!confirmed) return;
    }
    
    this.shapes = [];
    this.polygonPoints = [];
    this.selectedShape = null;
    this.controlPoints = [];
    this.redrawCanvas();
    this.updateCodeOutput();
    
    // Show feedback
    const toolStatus = document.getElementById('tool-status');
    const originalText = toolStatus.textContent;
    toolStatus.textContent = '🗑️ Canvas cleared!';
    setTimeout(() => {
      toolStatus.textContent = originalText;
    }, 2000);
  }
  
  copyCode() {
    // Get plain text content for copying (strip HTML tags)
    const codeText = this.codeOutput ? this.codeOutput.textContent || this.codeOutput.innerText : '';
    
    // Try the modern API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(codeText).then(() => {
        this.showCopyFeedback(true);
      }).catch(() => {
        // Fallback to older method
        this.fallbackCopyCode();
      });
    } else {
      this.fallbackCopyCode();
    }
  }
  
  fallbackCopyCode() {
    try {
      // Create a temporary textarea for fallback copy
      const tempTextarea = document.createElement('textarea');
      tempTextarea.value = this.codeOutput ? (this.codeOutput.textContent || this.codeOutput.innerText) : '';
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextarea);
      this.showCopyFeedback(true);
    } catch (err) {
      this.showCopyFeedback(false);
    }
  }
  
  showCopyFeedback(success) {
    if (success) {
      this.showNotification('Code copied to clipboard!', 'success');
    } else {
      this.showNotification('Failed to copy code to clipboard', 'error');
    }
  }
  
  updateCanvasSize() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.fitCanvasToContainer();
    this.redrawCanvas();
  }

  fitCanvasToContainer() {
    const container = document.querySelector('.canvas-container');
    if (!container) return;
    
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = containerRect.width;
    const viewportHeight = containerRect.height;
    
    // If no shapes, fit the logical canvas size to viewport
    if (this.shapes.length === 0) {
      const scaleX = viewportWidth / this.canvasWidth;
      const scaleY = viewportHeight / this.canvasHeight;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some margin
      
      this.zoom = Math.max(0.1, Math.min(5, scale));
      this.offsetX = (viewportWidth - this.canvasWidth * this.zoom) / 2;
      this.offsetY = (viewportHeight - this.canvasHeight * this.zoom) / 2;
    } else {
      // Calculate bounds of all shapes
      let minX = Infinity, minY = Infinity;
      let maxX = -Infinity, maxY = -Infinity;
      
      this.shapes.forEach(shape => {
        switch (shape.type) {
          case 'line':
            minX = Math.min(minX, shape.startX, shape.endX);
            maxX = Math.max(maxX, shape.startX, shape.endX);
            minY = Math.min(minY, shape.startY, shape.endY);
            maxY = Math.max(maxY, shape.startY, shape.endY);
            break;
          case 'rectangle':
            minX = Math.min(minX, shape.x);
            maxX = Math.max(maxX, shape.x + shape.width);
            minY = Math.min(minY, shape.y);
            maxY = Math.max(maxY, shape.y + shape.height);
            break;
          case 'circle':
            minX = Math.min(minX, shape.x - shape.radius);
            maxX = Math.max(maxX, shape.x + shape.radius);
            minY = Math.min(minY, shape.y - shape.radius);
            maxY = Math.max(maxY, shape.y + shape.radius);
            break;
          case 'polygon':
            shape.points.forEach(point => {
              minX = Math.min(minX, point.x);
              maxX = Math.max(maxX, point.x);
              minY = Math.min(minY, point.y);
              maxY = Math.max(maxY, point.y);
            });
            break;
        }
      });
      
      // Add some padding around the content
      const padding = 50;
      minX -= padding;
      minY -= padding;
      maxX += padding;
      maxY += padding;
      
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      
      // Calculate zoom to fit content
      const scaleX = viewportWidth / contentWidth;
      const scaleY = viewportHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some margin
      
      this.zoom = Math.max(0.1, Math.min(5, scale));
      
      // Center the content
      const contentCenterX = (minX + maxX) / 2;
      const contentCenterY = (minY + maxY) / 2;
      
      this.offsetX = viewportWidth / 2 - contentCenterX * this.zoom;
      this.offsetY = viewportHeight / 2 - contentCenterY * this.zoom;
    }
    
    // Reset CSS transform since we're using the zoom system
    this.canvas.style.transform = '';
    this.cssScale = 1;
    
    this.redrawCanvas();
    document.getElementById('zoom-level').textContent = Math.round(this.zoom * 100) + '%';
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            e.preventDefault();
            this.copyCode();
            break;
          case 'n':
            e.preventDefault();
            this.clearCanvas();
            break;
          case '=':
          case '+':
            e.preventDefault();
            this.setZoom(this.zoom * 1.2);
            break;
          case '-':
            e.preventDefault();
            this.setZoom(this.zoom / 1.2);
            break;
          case '0':
            e.preventDefault();
            this.setZoom(1);
            this.offsetX = 0;
            this.offsetY = 0;
            this.fitCanvasToContainer();
            this.redrawCanvas();
            break;
          case 'f':
            e.preventDefault();
            this.fitCanvasToContainer();
            break;
        }
      }
      
      // Tool shortcuts (without modifier keys)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        switch (e.key) {
          case 'v':
          case 'V':
            e.preventDefault();
            this.setTool('select');
            break;
          case 'l':
          case 'L':
            e.preventDefault();
            this.setTool('line');
            break;
          case 'r':
          case 'R':
            e.preventDefault();
            this.setTool('rectangle');
            break;
          case 'c':
          case 'C':
            e.preventDefault();
            this.setTool('circle');
            break;
          case 'p':
          case 'P':
            e.preventDefault();
            this.setTool('polygon');
            break;
          case 'b':
          case 'B':
            e.preventDefault();
            this.setTool('brush');
            break;
          case 'n':
          case 'N':
            e.preventDefault();
            this.setTool('pencil');
            break;
          case 'e':
          case 'E':
            e.preventDefault();
            this.setTool('eraser');
            break;
          case 'i':
          case 'I':
            e.preventDefault();
            this.setTool('eyedropper');
            break;
          case 'f':
          case 'F':
            e.preventDefault();
            this.setTool('fill');
            break;
          case 't':
          case 'T':
            e.preventDefault();
            this.setTool('text');
            break;
          case 'Escape':
            e.preventDefault();
            if (this.currentTool === 'polygon' && this.polygonPoints.length > 0) {
              this.polygonPoints = [];
              this.redrawCanvas();
              this.updateCursor();
            }
            break;
        }
      }
    });
  }
  
  setTool(tool) {
    // Remove active class from all buttons (both old and new styles)
    document.querySelectorAll('.tool-btn, .tool-btn-vertical').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected button
    const targetBtn = document.querySelector(`[data-tool="${tool}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
    }
    
    this.currentTool = tool;
    this.polygonPoints = []; // Reset polygon points when switching tools
    this.updateToolStatus(); // Update status message
    this.updateCursor();
  }
  
  showHelpDialog() {
    const helpContent = `
      <div style="padding: 20px; line-height: 1.6;">
        <h2 style="color: #667eea; margin-top: 0;">Vector2Godot Help</h2>
        
        <h3>🎨 Drawing Tools</h3>
        <ul>
          <li><strong>Select:</strong> Click and drag to select and move shapes</li>
          <li><strong>Line:</strong> Click and drag to draw lines</li>
          <li><strong>Rectangle:</strong> Click and drag to draw rectangles</li>
          <li><strong>Circle:</strong> Click and drag to draw circles</li>
          <li><strong>Polygon:</strong> Click to add points, double-click to complete the polygon</li>
        </ul>
        
        <h3>⚙️ Controls</h3>
        <ul>
          <li><strong>Mouse wheel:</strong> Zoom in/out</li>
          <li><strong>Shift + drag:</strong> Pan around the canvas</li>
          <li><strong>Grid snap:</strong> Enable to snap shapes to grid</li>
          <li><strong>Properties:</strong> Adjust colors, stroke width, and fill</li>
        </ul>
        
        <h3>🔶 Polygon Drawing Tips</h3>
        <ul>
          <li>Click to place each point of the polygon</li>
          <li>The preview shows numbered points for reference</li>
          <li>Need at least 3 points to create a polygon</li>
          <li>Double-click to complete and fill the polygon</li>
          <li>Fill color is applied when polygon is completed</li>
        </ul>
        
        <h3>📋 Code Generation</h3>
        <p>Draw shapes and see the Godot <code>_draw()</code> function code generated automatically. Click "Copy Code" to copy it to your clipboard.</p>
        
        <h3>🔧 Settings</h3>
        <p>Click the Settings button to customize default canvas size, grid settings, and drawing properties.</p>
        
        <h3>⌨️ Keyboard Shortcuts</h3>
        <ul>
          <li><strong>1-5:</strong> Select tools (1=Select, 2=Line, 3=Rectangle, 4=Circle, 5=Polygon)</li>
          <li><strong>Ctrl+C:</strong> Copy generated code</li>
          <li><strong>Ctrl+N:</strong> Clear canvas</li>
          <li><strong>Ctrl+Plus/Minus:</strong> Zoom in/out</li>
          <li><strong>Ctrl+0:</strong> Reset zoom and fit canvas</li>
          <li><strong>Ctrl+F:</strong> Fit canvas to container</li>
          <li><strong>Escape:</strong> Cancel polygon creation</li>
        </ul>
      </div>
    `;
    
    this.showModal('Help', helpContent);
  }
  
  openCanvasSettings() {
    const canvasContent = `
      <div class="modal-content">
        <h4>Canvas Settings</h4>
        <div class="property-group">
          <div class="slider-group">
            <label for="modal-canvas-width">Width</label>
            <div class="input-slider-group">
              <input type="range" id="modal-canvas-width" min="200" max="1600" value="${document.getElementById('canvas-width').value}">
              <input type="number" id="modal-canvas-width-value" min="200" max="1600" value="${document.getElementById('canvas-width').value}">
            </div>
          </div>
          <div class="slider-group">
            <label for="modal-canvas-height">Height</label>
            <div class="input-slider-group">
              <input type="range" id="modal-canvas-height" min="150" max="1200" value="${document.getElementById('canvas-height').value}">
              <input type="number" id="modal-canvas-height-value" min="150" max="1200" value="${document.getElementById('canvas-height').value}">
            </div>
          </div>
          <div class="select-group">
            <label for="modal-preset-sizes">Presets</label>
            <select id="modal-preset-sizes">
              <option value="">Custom</option>
              <option value="800x600">800×600 (4:3)</option>
              <option value="1024x768">1024×768 (4:3)</option>
              <option value="1280x720">1280×720 (16:9)</option>
              <option value="1920x1080">1920×1080 (16:9)</option>
              <option value="640x480">640×480 (Classic)</option>
              <option value="480x320">480×320 (Mobile)</option>
              <option value="1080x1080">1080×1080 (Square)</option>
            </select>
          </div>
        </div>
        <div class="modal-buttons">
          <button class="action-btn" onclick="app.applyCanvasSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    this.showModal('Canvas Settings', canvasContent);
    this.setupCanvasModalListeners();
  }
  
  openGridSettings() {
    const gridContent = `
      <div class="modal-content">
        <h4>Grid Settings</h4>
        <div class="property-group">
          <div class="slider-group">
            <label for="modal-grid-size">Grid Size</label>
            <div class="input-slider-group">
              <input type="range" id="modal-grid-size" min="5" max="50" value="${document.getElementById('grid-size').value}">
              <input type="number" id="modal-grid-size-value" min="5" max="50" value="${document.getElementById('grid-size').value}">
            </div>
          </div>
          <div class="toggle-group">
            <input type="checkbox" id="modal-show-grid" ${document.getElementById('show-grid').checked ? 'checked' : ''}>
            <label for="modal-show-grid">Show Grid</label>
          </div>
          <div class="toggle-group">
            <input type="checkbox" id="modal-snap-to-grid" ${document.getElementById('snap-to-grid').checked ? 'checked' : ''}>
            <label for="modal-snap-to-grid">Snap to Grid</label>
          </div>
        </div>
        <div class="modal-buttons">
          <button class="action-btn" onclick="app.applyGridSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    this.showModal('Grid Settings', gridContent);
    this.setupGridModalListeners();
  }
  
  openToolSettings() {
    const toolsContent = `
      <div class="modal-content">
        <h4>Tool Settings</h4>
        <div class="property-group">
          <h5>Current Tool</h5>
          <p>Active Tool: <strong>${this.currentTool.charAt(0).toUpperCase() + this.currentTool.slice(1)}</strong></p>
          <div class="toggle-group">
            <input type="checkbox" id="modal-snap-to-grid-tools" ${this.snapToGrid ? 'checked' : ''}>
            <label for="modal-snap-to-grid-tools">Enable Grid Snapping for Tools</label>
          </div>
        </div>
        <div class="property-group">
          <h5>Keyboard Shortcuts</h5>
          <p>Press the following keys to quickly switch tools:</p>
          <ul style="list-style: disc; margin-left: 20px; margin-top: 10px;">
            <li><strong>V:</strong> Select tool</li>
            <li><strong>L:</strong> Line tool</li>
            <li><strong>R:</strong> Rectangle tool</li>
            <li><strong>C:</strong> Circle tool</li>
            <li><strong>P:</strong> Polygon tool</li>
            <li><strong>E:</strong> Eraser tool</li>
          </ul>
        </div>
        <div class="modal-buttons">
          <button class="action-btn" onclick="app.applyToolSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    this.showModal('Tool Settings', toolsContent);
  }
  
  openPropertiesSettings() {
    const propertiesContent = `
      <div class="modal-content">
        <h4>Properties Settings</h4>
        <div class="property-group">
          <h5>Stroke</h5>
          <div class="color-input-group">
            <input type="color" id="modal-stroke-color" value="${document.getElementById('stroke-color') ? document.getElementById('stroke-color').value : '#000000'}">
            <label for="modal-stroke-color">Color</label>
          </div>
          <div class="slider-group">
            <label for="modal-stroke-width">Width</label>
            <div class="input-slider-group">
              <input type="range" id="modal-stroke-width" min="1" max="10" value="${document.getElementById('stroke-width') ? document.getElementById('stroke-width').value : '2'}">
              <input type="number" id="modal-stroke-width-value" min="1" max="10" value="${document.getElementById('stroke-width') ? document.getElementById('stroke-width').value : '2'}">
            </div>
          </div>
        </div>
        <div class="property-group">
          <h5>Fill</h5>
          <div class="toggle-group">
            <input type="checkbox" id="modal-fill-enabled" ${document.getElementById('fill-enabled') && document.getElementById('fill-enabled').checked ? 'checked' : ''}>
            <label for="modal-fill-enabled">Enable Fill</label>
          </div>
          <div class="color-input-group">
            <input type="color" id="modal-fill-color" value="${document.getElementById('fill-color') ? document.getElementById('fill-color').value : '#ffffff'}">
            <label for="modal-fill-color">Color</label>
          </div>
        </div>
        <div class="modal-buttons">
          <button class="action-btn" onclick="app.applyPropertiesSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    this.showModal('Properties Settings', propertiesContent);
    this.setupPropertiesModalListeners();
  }
  
  setupCanvasModalListeners() {
    const widthInput = document.getElementById('modal-canvas-width');
    const widthValue = document.getElementById('modal-canvas-width-value');
    const heightInput = document.getElementById('modal-canvas-height');
    const heightValue = document.getElementById('modal-canvas-height-value');
    const presetSelect = document.getElementById('modal-preset-sizes');
    
    // Function to sync slider and input values with validation
    const syncValues = (slider, input, min, max) => {
      const value = Math.min(max, Math.max(min, parseInt(slider.value) || min));
      slider.value = value;
      input.value = value;
    };
    
    if (widthInput && widthValue) {
      // Sync from slider to input
      widthInput.addEventListener('input', () => {
        widthValue.value = widthInput.value;
      });
      
      // Sync from input to slider with validation
      widthValue.addEventListener('input', () => {
        const min = parseInt(widthInput.min);
        const max = parseInt(widthInput.max);
        const value = Math.min(max, Math.max(min, parseInt(widthValue.value) || min));
        widthInput.value = value;
        widthValue.value = value;
      });
      
      // Validate on blur
      widthValue.addEventListener('blur', () => {
        const min = parseInt(widthInput.min);
        const max = parseInt(widthInput.max);
        syncValues(widthInput, widthValue, min, max);
      });
    }
    
    if (heightInput && heightValue) {
      // Sync from slider to input
      heightInput.addEventListener('input', () => {
        heightValue.value = heightInput.value;
      });
      
      // Sync from input to slider with validation
      heightValue.addEventListener('input', () => {
        const min = parseInt(heightInput.min);
        const max = parseInt(heightInput.max);
        const value = Math.min(max, Math.max(min, parseInt(heightValue.value) || min));
        heightInput.value = value;
        heightValue.value = value;
      });
      
      // Validate on blur
      heightValue.addEventListener('blur', () => {
        const min = parseInt(heightInput.min);
        const max = parseInt(heightInput.max);
        syncValues(heightInput, heightValue, min, max);
      });
    }
    
    if (presetSelect) {
      presetSelect.addEventListener('change', () => {
        const preset = presetSelect.value;
        if (preset) {
          const [width, height] = preset.split('x').map(Number);
          widthInput.value = width;
          heightInput.value = height;
          widthValue.value = width;
          heightValue.value = height;
        }
      });
    }
  }

  setupGridModalListeners() {
    const gridSizeInput = document.getElementById('modal-grid-size');
    const gridSizeValue = document.getElementById('modal-grid-size-value');
    
    // Function to sync slider and input values with validation
    const syncValues = (slider, input, min, max) => {
      const value = Math.min(max, Math.max(min, parseInt(slider.value) || min));
      slider.value = value;
      input.value = value;
    };
    
    if (gridSizeInput && gridSizeValue) {
      // Sync from slider to input
      gridSizeInput.addEventListener('input', () => {
        gridSizeValue.value = gridSizeInput.value;
      });
      
      // Sync from input to slider with validation
      gridSizeValue.addEventListener('input', () => {
        const min = parseInt(gridSizeInput.min);
        const max = parseInt(gridSizeInput.max);
        const value = Math.min(max, Math.max(min, parseInt(gridSizeValue.value) || min));
        gridSizeInput.value = value;
        gridSizeValue.value = value;
      });
      
      // Validate on blur
      gridSizeValue.addEventListener('blur', () => {
        const min = parseInt(gridSizeInput.min);
        const max = parseInt(gridSizeInput.max);
        syncValues(gridSizeInput, gridSizeValue, min, max);
      });
    }
  }

  applyCanvasSettings() {
    const width = document.getElementById('modal-canvas-width').value;
    const height = document.getElementById('modal-canvas-height').value;
    
    document.getElementById('canvas-width').value = width;
    document.getElementById('canvas-height').value = height;
    document.getElementById('canvas-width-value').textContent = width;
    document.getElementById('canvas-height-value').textContent = height;
    
    this.canvasWidth = parseInt(width);
    this.canvasHeight = parseInt(height);
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    
    this.redrawCanvas();
    this.updateCodeOutput();
    this.closeModal();
  }

  applyGridSettings() {
    const gridSize = document.getElementById('modal-grid-size').value;
    const showGrid = document.getElementById('modal-show-grid').checked;
    const snapToGrid = document.getElementById('modal-snap-to-grid').checked;
    
    document.getElementById('grid-size').value = gridSize;
    document.getElementById('grid-size-value').textContent = gridSize;
    document.getElementById('show-grid').checked = showGrid;
    document.getElementById('snap-to-grid').checked = snapToGrid;
    
    this.gridSize = parseInt(gridSize);
    this.showGrid = showGrid;
    this.snapToGrid = snapToGrid;
    
    this.redrawCanvas();
    this.closeModal();
  }

  setupPropertiesModalListeners() {
    const strokeWidthInput = document.getElementById('modal-stroke-width');
    const strokeWidthValue = document.getElementById('modal-stroke-width-value');
    
    // Function to sync slider and input values with validation
    const syncValues = (slider, input, min, max) => {
      const value = Math.min(max, Math.max(min, parseInt(slider.value) || min));
      slider.value = value;
      input.value = value;
    };
    
    if (strokeWidthInput && strokeWidthValue) {
      // Sync from slider to input
      strokeWidthInput.addEventListener('input', () => {
        strokeWidthValue.value = strokeWidthInput.value;
      });
      
      // Sync from input to slider with validation
      strokeWidthValue.addEventListener('input', () => {
        const min = parseInt(strokeWidthInput.min);
        const max = parseInt(strokeWidthInput.max);
        const value = Math.min(max, Math.max(min, parseInt(strokeWidthValue.value) || min));
        strokeWidthInput.value = value;
        strokeWidthValue.value = value;
      });
      
      // Validate on blur
      strokeWidthValue.addEventListener('blur', () => {
        const min = parseInt(strokeWidthInput.min);
        const max = parseInt(strokeWidthInput.max);
        syncValues(strokeWidthInput, strokeWidthValue, min, max);
      });
    }
  }

  applyPropertiesSettings() {
    const strokeColor = document.getElementById('modal-stroke-color').value;
    const strokeWidth = document.getElementById('modal-stroke-width').value;
    const fillEnabled = document.getElementById('modal-fill-enabled').checked;
    const fillColor = document.getElementById('modal-fill-color').value;
    
    document.getElementById('stroke-color').value = strokeColor;
    document.getElementById('stroke-width').value = strokeWidth;
    document.getElementById('fill-enabled').checked = fillEnabled;
    document.getElementById('fill-color').value = fillColor;
    
    this.redrawCanvas();
    this.closeModal();
  }

  applyToolSettings() {
    const snapToGridTools = document.getElementById('modal-snap-to-grid-tools');
    if (snapToGridTools) {
      this.snapToGrid = snapToGridTools.checked;
      document.getElementById('snap-to-grid').checked = snapToGridTools.checked;
    }
    
    this.closeModal();
  }

  closeModal() {
    const modal = document.getElementById('help-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('help-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'help-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
          <div class="modal-header">
            <h3 id="modal-title">${title}</h3>
            <span class="close" onclick="app.closeModal()">&times;</span>
          </div>
          <div id="modal-body" style="padding: 20px;">
            ${content}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      // Update existing modal
      const titleElement = modal.querySelector('#modal-title');
      const bodyElement = modal.querySelector('#modal-body');
      if (titleElement) titleElement.textContent = title;
      if (bodyElement) bodyElement.innerHTML = content;
    }
    
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.onclick = (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    };
  }

  showKeyboardShortcuts() {
    const shortcutsContent = `
      <div style="font-family: monospace; line-height: 1.6;">
        <h4>Drawing Tools</h4>
        <ul style="margin-bottom: 20px;">
          <li><strong>V:</strong> Select tool</li>
          <li><strong>L:</strong> Line tool</li>
          <li><strong>R:</strong> Rectangle tool</li>
          <li><strong>C:</strong> Circle tool</li>
          <li><strong>P:</strong> Polygon tool</li>
          <li><strong>E:</strong> Eraser tool</li>
        </ul>
        
        <h4>View Controls</h4>
        <ul style="margin-bottom: 20px;">
          <li><strong>Mouse Wheel:</strong> Zoom in/out</li>
          <li><strong>Shift + Drag:</strong> Pan around canvas</li>
          <li><strong>Ctrl + 0:</strong> Reset zoom and center</li>
          <li><strong>Ctrl + F:</strong> Fit canvas to window</li>
        </ul>
        
        <h4>Actions</h4>
        <ul>
          <li><strong>Ctrl + C:</strong> Copy generated code</li>
          <li><strong>Ctrl + N:</strong> Clear canvas</li>
          <li><strong>Escape:</strong> Cancel polygon creation</li>
               </ul>
      </div>
    `;
    
    this.showModal('Keyboard Shortcuts', shortcutsContent);
  }

  showTutorial() {
    const tutorialContent = `
      <div style="line-height: 1.6;">
        <h4>Getting Started with Vector2Godot</h4>
        
        <h5>1. Choose a Tool</h5>
        <p>Click on the tools in the floating toolbar on the right side of the canvas, or use keyboard shortcuts (V, L, R, C, P, E).</p>
        
        <h5>2. Draw Shapes</h5>
        <p>Click and drag to create lines, rectangles, and circles. For polygons, click to place points and double-click to finish.</p>
        <p><strong>Smart Lines:</strong> When drawing lines that connect to form a closed shape, they automatically convert to a filled polygon!</p>
        
        <h5>3. Customize Properties</h5>
        <p>Use the Settings menu to adjust stroke color, fill color, stroke width, and other properties.</p>
        
        <h5>4. Generate Code</h5>
        <p>Your drawings automatically generate Godot _draw() function code. Copy it from the bottom panel.</p>
        
        <h5>5. Use in Godot</h5>
        <p>Paste the generated code into a Godot script's _draw() function to recreate your drawings.</p>
      </div>
    `;
    
    this.showModal('Tutorial', tutorialContent);
  }

  showAbout() {
    const aboutContent = `
      <div style="text-align: center; line-height: 1.6;">
        <h3>Vector2Godot</h3>
        <p><strong>Version 1.1.4</strong></p>
        
        <p>A modern vector drawing tool that generates Godot Engine code.</p>
        
        <h4>Features</h4>
        <ul style="text-align: left; display: inline-block;">
          <li>Draw lines, rectangles, circles, and polygons</li>
          <li>Customizable stroke and fill properties</li>
          <li>Grid snapping and alignment tools</li>
          <li>Real-time Godot _draw() code generation</li>
          <li>Zoom and pan for detailed work</li>
          <li>Keyboard shortcuts for efficiency</li>
        </ul>
        
        <p style="margin-top: 20px;">
          <small>Built with HTML5 Canvas and modern web technologies.</small>
        </p>
      </div>
    `;
    
    this.showModal('About Vector2Godot', aboutContent);
  }

  showNotification(message, type = 'info') {
    // Simple notification system
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // You could implement a proper notification system here
    // For now, we'll just use console.log
  }

  redraw() {
    this.redrawCanvas();
  }

  drawControlPoints() {
    if (this.controlPoints.length === 0) return;
    
    this.ctx.save();
    
    // Don't apply zoom transform for control points
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    this.controlPoints.forEach(point => {
      // Convert world coordinates to screen coordinates
      const screenX = point.x * this.zoom + this.offsetX;
      const screenY = point.y * this.zoom + this.offsetY;
      
      // Draw control point
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      
      this.ctx.beginPath();
      this.ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    });
    
    this.ctx.restore();
  }

  setupDropdowns() {
    // Handle dropdown functionality
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      const btn = dropdown.querySelector('.dropdown-btn');
      const content = dropdown.querySelector('.dropdown-content');
      
      // Close all dropdowns when clicking elsewhere
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          content.classList.remove('show');
        }
      });
      
      // Toggle dropdown on button click
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(otherContent => {
          if (otherContent !== content) {
            otherContent.classList.remove('show');
          }
        });
        
        // Toggle this dropdown
        content.classList.toggle('show');
      });
    });
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    
    // Get current theme (already loaded at startup)
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Set toggle state to match current theme
    themeToggle.checked = currentTheme === 'dark';
    
    // Apply theme to body styles
    this.setTheme(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      this.setTheme(theme);
      localStorage.setItem('vector2godot-theme', theme);
    });
  }

  setTheme(theme) {
    console.log('Setting theme to:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update canvas background for better contrast
    if (theme === 'dark') {
      document.body.style.background = 'var(--bg-dark)';
    } else {
      document.body.style.background = 'var(--bg-light)';
    }
    
    // Redraw canvas to reflect theme changes
    this.redrawCanvas();
  }
}

// Create and expose the app globally for modal buttons
window.app = new VectorDrawingApp();

// Hide splash screen after app initialization
setTimeout(() => {
  splash.hide();
}, 100); // Small delay to ensure app is fully initialized
