/**
 * Tool Manager
 * Manages drawing tools, tool properties, and tool state
 */
export class ToolManager {
  constructor() {
    this.currentTool = 'line';
    this.toolProperties = {
      strokeColor: '#000000',
      fillColor: '#ffffff',
      strokeWidth: 2,
      fillEnabled: false
    };
    
    this.toolCursors = {
      select: 'default',
      line: 'crosshair',
      rectangle: 'crosshair',
      circle: 'crosshair',
      polygon: 'crosshair',
      eraser: 'pointer',
      eyedropper: 'crosshair',
      fill: 'crosshair',
      text: 'text'
    };
    
    this.toolStatus = {
      select: 'Select Tool - Click to select shapes',
      line: 'Line Tool - Click and drag to draw',
      rectangle: 'Rectangle Tool - Click and drag to draw',
      circle: 'Circle Tool - Click and drag to draw',
      polygon: 'Polygon Tool - Click to add points, double-click to finish',
      eraser: 'Eraser Tool - Click on shapes to delete them',
      eyedropper: 'Eyedropper Tool - Click to pick colors',
      fill: 'Fill Tool - Click to fill areas',
      text: 'Text Tool - Click to add text'
    };
    
    this.setupToolEventListeners();
  }

  setupToolEventListeners() {
    // Tool selection buttons
    document.querySelectorAll('.tool-btn, .tool-btn-vertical').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = btn.dataset.tool;
        if (tool) {
          this.setTool(tool);
        }
      });
    });

    // Property controls
    this.setupPropertyControls();
  }

  setupPropertyControls() {
    // Stroke color
    const strokeColorEl = document.getElementById('stroke-color');
    if (strokeColorEl) {
      strokeColorEl.addEventListener('change', (e) => {
        this.toolProperties.strokeColor = e.target.value;
      });
    }

    // Fill color
    const fillColorEl = document.getElementById('fill-color');
    if (fillColorEl) {
      fillColorEl.addEventListener('change', (e) => {
        this.toolProperties.fillColor = e.target.value;
      });
    }

    // Stroke width
    const strokeWidthEl = document.getElementById('stroke-width');
    if (strokeWidthEl) {
      strokeWidthEl.addEventListener('input', (e) => {
        this.toolProperties.strokeWidth = parseInt(e.target.value);
        this.updateStrokeWidthDisplay();
      });
    }

    // Fill enabled
    const fillEnabledEl = document.getElementById('fill-enabled');
    if (fillEnabledEl) {
      fillEnabledEl.addEventListener('change', (e) => {
        this.toolProperties.fillEnabled = e.target.checked;
      });
    }
  }

  setTool(tool) {
    if (this.currentTool === tool) return;
    
    this.currentTool = tool;
    this.updateToolUI();
    this.updateToolStatus();
    this.updateCursor();
    
    // Dispatch tool changed event
    window.dispatchEvent(new CustomEvent('toolChanged', { 
      detail: { tool, properties: this.toolProperties } 
    }));
  }

  getCurrentTool() {
    return this.currentTool;
  }

  getToolProperties() {
    return { ...this.toolProperties };
  }

  getStrokeColor() {
    return this.toolProperties.strokeColor;
  }

  getFillColor() {
    return this.toolProperties.fillColor;
  }

  getStrokeWidth() {
    return this.toolProperties.strokeWidth;
  }

  isFillEnabled() {
    return this.toolProperties.fillEnabled;
  }

  setStrokeColor(color) {
    this.toolProperties.strokeColor = color;
    const strokeColorEl = document.getElementById('stroke-color');
    if (strokeColorEl) {
      strokeColorEl.value = color;
    }
  }

  setFillColor(color) {
    this.toolProperties.fillColor = color;
    const fillColorEl = document.getElementById('fill-color');
    if (fillColorEl) {
      fillColorEl.value = color;
    }
  }

  setStrokeWidth(width) {
    this.toolProperties.strokeWidth = width;
    const strokeWidthEl = document.getElementById('stroke-width');
    if (strokeWidthEl) {
      strokeWidthEl.value = width;
    }
    this.updateStrokeWidthDisplay();
  }

  setFillEnabled(enabled) {
    this.toolProperties.fillEnabled = enabled;
    const fillEnabledEl = document.getElementById('fill-enabled');
    if (fillEnabledEl) {
      fillEnabledEl.checked = enabled;
    }
  }

  updateToolUI() {
    // Remove active class from all buttons
    document.querySelectorAll('.tool-btn, .tool-btn-vertical').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to current tool button
    const activeBtn = document.querySelector(`[data-tool="${this.currentTool}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  updateToolStatus() {
    const statusElement = document.getElementById('tool-status');
    if (statusElement) {
      statusElement.textContent = this.toolStatus[this.currentTool] || 'Unknown Tool';
    }
  }

  updateCursor() {
    const canvas = document.getElementById('drawing-canvas');
    if (canvas) {
      canvas.style.cursor = this.getCursor();
    }
  }

  getCursor() {
    return this.toolCursors[this.currentTool] || 'default';
  }

  updateStrokeWidthDisplay() {
    const strokeWidthValue = document.getElementById('stroke-width-value');
    if (strokeWidthValue) {
      strokeWidthValue.textContent = this.toolProperties.strokeWidth;
    }
  }

  // Color picker functionality
  pickColor(color) {
    // This would be called by the eyedropper tool
    this.setStrokeColor(color);
    this.setFillColor(color);
  }

  // Preset management
  savePreset(name) {
    const presets = this.getPresets();
    presets[name] = { ...this.toolProperties };
    localStorage.setItem('vector2godot-presets', JSON.stringify(presets));
  }

  loadPreset(name) {
    const presets = this.getPresets();
    if (presets[name]) {
      this.toolProperties = { ...presets[name] };
      this.updatePropertyControls();
    }
  }

  getPresets() {
    const savedPresets = localStorage.getItem('vector2godot-presets');
    return savedPresets ? JSON.parse(savedPresets) : {};
  }

  deletePreset(name) {
    const presets = this.getPresets();
    delete presets[name];
    localStorage.setItem('vector2godot-presets', JSON.stringify(presets));
  }

  updatePropertyControls() {
    const strokeColorEl = document.getElementById('stroke-color');
    const fillColorEl = document.getElementById('fill-color');
    const strokeWidthEl = document.getElementById('stroke-width');
    const fillEnabledEl = document.getElementById('fill-enabled');

    if (strokeColorEl) strokeColorEl.value = this.toolProperties.strokeColor;
    if (fillColorEl) fillColorEl.value = this.toolProperties.fillColor;
    if (strokeWidthEl) strokeWidthEl.value = this.toolProperties.strokeWidth;
    if (fillEnabledEl) fillEnabledEl.checked = this.toolProperties.fillEnabled;
    
    this.updateStrokeWidthDisplay();
  }

  // Tool-specific settings
  getToolSettings(tool) {
    const settings = {
      line: {
        showFill: false,
        showStroke: true,
        showWidth: true
      },
      rectangle: {
        showFill: true,
        showStroke: true,
        showWidth: true
      },
      circle: {
        showFill: true,
        showStroke: true,
        showWidth: true
      },
      polygon: {
        showFill: true,
        showStroke: true,
        showWidth: true
      },
      select: {
        showFill: false,
        showStroke: false,
        showWidth: false
      },
      eraser: {
        showFill: false,
        showStroke: false,
        showWidth: false
      }
    };

    return settings[tool] || settings.line;
  }

  // Validation
  validateTool(tool) {
    const validTools = ['select', 'line', 'rectangle', 'circle', 'polygon', 'eraser', 'eyedropper', 'fill', 'text'];
    return validTools.includes(tool);
  }

  // Export/Import tool settings
  exportSettings() {
    return {
      currentTool: this.currentTool,
      toolProperties: this.toolProperties,
      presets: this.getPresets()
    };
  }

  importSettings(settings) {
    if (settings.currentTool && this.validateTool(settings.currentTool)) {
      this.setTool(settings.currentTool);
    }

    if (settings.toolProperties) {
      this.toolProperties = { ...this.toolProperties, ...settings.toolProperties };
      this.updatePropertyControls();
    }

    if (settings.presets) {
      localStorage.setItem('vector2godot-presets', JSON.stringify(settings.presets));
    }
  }
}
