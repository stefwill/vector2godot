/**
 * UI Manager
 * Manages user interface elements, modals, and interactions
 */
export class UIManager {
  constructor() {
    this.modals = new Map();
    this.notifications = [];
    this.setupUI();
  }

  setupUI() {
    this.setupModalHandlers();
    this.setupNotificationSystem();
    this.setupDropdowns();
    this.setupThemeToggle();
  }

  setupModalHandlers() {
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  setupNotificationSystem() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  }

  setupDropdowns() {
    // Setup dropdown menus
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');

      if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other dropdowns
          document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
              otherMenu.classList.remove('show');
            }
          });

          // Toggle current dropdown
          menu.classList.toggle('show');
        });
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
    });
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('vector2godot-theme', newTheme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    const container = document.getElementById('notification-container');
    container.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);

    // Add to notifications array
    this.notifications.push({
      message,
      type,
      timestamp: Date.now()
    });

    // Keep only last 10 notifications
    if (this.notifications.length > 10) {
      this.notifications.shift();
    }
  }

  showError(message, duration = 5000) {
    this.showNotification(message, 'error', duration);
  }

  showSuccess(message, duration = 3000) {
    this.showNotification(message, 'success', duration);
  }

  showWarning(message, duration = 4000) {
    this.showNotification(message, 'warning', duration);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.classList.remove('modal-open');
  }

  openCanvasSettings() {
    this.createCanvasSettingsModal();
    this.openModal('canvas-settings-modal');
  }

  openGridSettings() {
    this.createGridSettingsModal();
    this.openModal('grid-settings-modal');
  }

  openToolSettings() {
    this.createToolSettingsModal();
    this.openModal('tool-settings-modal');
  }

  openPropertiesSettings() {
    this.createPropertiesSettingsModal();
    this.openModal('properties-settings-modal');
  }

  createCanvasSettingsModal() {
    if (document.getElementById('canvas-settings-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'canvas-settings-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Canvas Settings</h3>
          <button class="modal-close" onclick="app.uiManager.closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="property-group">
            <div class="slider-group">
              <label for="canvas-width-setting">Canvas Width:</label>
              <div class="input-slider-group">
                <input type="range" id="canvas-width-setting" min="200" max="1600" value="256">
                <span id="canvas-width-setting-value">256</span>
              </div>
            </div>
            <div class="slider-group">
              <label for="canvas-height-setting">Canvas Height:</label>
              <div class="input-slider-group">
                <input type="range" id="canvas-height-setting" min="150" max="1200" value="256">
                <span id="canvas-height-setting-value">256</span>
              </div>
            </div>
            <div class="select-group">
              <label for="canvas-preset">Quick Presets:</label>
              <select id="canvas-preset">
                <option value="custom">Custom</option>
                <option value="256x256">256×256 (Icon)</option>
                <option value="512x512">512×512 (Texture)</option>
                <option value="1024x1024">1024×1024 (Large)</option>
                <option value="640x480">640×480 (Classic)</option>
                <option value="800x600">800×600 (SVGA)</option>
                <option value="1920x1080">1920×1080 (HD)</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" onclick="app.uiManager.applyCanvasSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.uiManager.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  createGridSettingsModal() {
    if (document.getElementById('grid-settings-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'grid-settings-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Grid Settings</h3>
          <button class="modal-close" onclick="app.uiManager.closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="property-group">
            <div class="slider-group">
              <label for="grid-size-setting">Grid Size:</label>
              <div class="input-slider-group">
                <input type="range" id="grid-size-setting" min="5" max="50" value="10">
                <span id="grid-size-setting-value">10</span>
              </div>
            </div>
            <div class="toggle-group">
              <label for="show-grid-setting">Show Grid:</label>
              <input type="checkbox" id="show-grid-setting" checked>
            </div>
            <div class="toggle-group">
              <label for="snap-to-grid-setting">Snap to Grid:</label>
              <input type="checkbox" id="snap-to-grid-setting" checked>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" onclick="app.uiManager.applyGridSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.uiManager.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  createToolSettingsModal() {
    if (document.getElementById('tool-settings-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'tool-settings-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Tool Settings</h3>
          <button class="modal-close" onclick="app.uiManager.closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="property-group">
            <p>Tool-specific settings will be added here.</p>
            <div class="toggle-group">
              <label for="auto-close-shapes">Auto-close shapes:</label>
              <input type="checkbox" id="auto-close-shapes" checked>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" onclick="app.uiManager.applyToolSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.uiManager.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  createPropertiesSettingsModal() {
    if (document.getElementById('properties-settings-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'properties-settings-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Properties Settings</h3>
          <button class="modal-close" onclick="app.uiManager.closeModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="property-group">
            <div class="color-group">
              <label for="default-stroke-color">Default Stroke Color:</label>
              <input type="color" id="default-stroke-color" value="#000000">
            </div>
            <div class="color-group">
              <label for="default-fill-color">Default Fill Color:</label>
              <input type="color" id="default-fill-color" value="#ffffff">
            </div>
            <div class="slider-group">
              <label for="default-stroke-width">Default Stroke Width:</label>
              <div class="input-slider-group">
                <input type="range" id="default-stroke-width" min="1" max="10" value="2">
                <span id="default-stroke-width-value">2</span>
              </div>
            </div>
            <div class="toggle-group">
              <label for="default-fill-enabled">Default Fill Enabled:</label>
              <input type="checkbox" id="default-fill-enabled">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" onclick="app.uiManager.applyPropertiesSettings()">Apply</button>
          <button class="action-btn secondary" onclick="app.uiManager.closeModal()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  applyCanvasSettings() {
    const width = document.getElementById('canvas-width-setting').value;
    const height = document.getElementById('canvas-height-setting').value;
    
    window.dispatchEvent(new CustomEvent('canvasSettingsChanged', {
      detail: { width: parseInt(width), height: parseInt(height) }
    }));
    
    this.closeModal();
    this.showSuccess('Canvas settings applied!');
  }

  applyGridSettings() {
    const gridSize = document.getElementById('grid-size-setting').value;
    const showGrid = document.getElementById('show-grid-setting').checked;
    const snapToGrid = document.getElementById('snap-to-grid-setting').checked;
    
    window.dispatchEvent(new CustomEvent('gridSettingsChanged', {
      detail: { gridSize: parseInt(gridSize), showGrid, snapToGrid }
    }));
    
    this.closeModal();
    this.showSuccess('Grid settings applied!');
  }

  applyToolSettings() {
    const autoCloseShapes = document.getElementById('auto-close-shapes').checked;
    
    window.dispatchEvent(new CustomEvent('toolSettingsChanged', {
      detail: { autoCloseShapes }
    }));
    
    this.closeModal();
    this.showSuccess('Tool settings applied!');
  }

  applyPropertiesSettings() {
    const strokeColor = document.getElementById('default-stroke-color').value;
    const fillColor = document.getElementById('default-fill-color').value;
    const strokeWidth = document.getElementById('default-stroke-width').value;
    const fillEnabled = document.getElementById('default-fill-enabled').checked;
    
    window.dispatchEvent(new CustomEvent('propertiesSettingsChanged', {
      detail: { strokeColor, fillColor, strokeWidth: parseInt(strokeWidth), fillEnabled }
    }));
    
    this.closeModal();
    this.showSuccess('Properties settings applied!');
  }

  showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Keyboard Shortcuts</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="shortcuts-grid">
            <div class="shortcut-item">
              <kbd>1</kbd>
              <span>Select Tool</span>
            </div>
            <div class="shortcut-item">
              <kbd>2</kbd>
              <span>Line Tool</span>
            </div>
            <div class="shortcut-item">
              <kbd>3</kbd>
              <span>Rectangle Tool</span>
            </div>
            <div class="shortcut-item">
              <kbd>4</kbd>
              <span>Circle Tool</span>
            </div>
            <div class="shortcut-item">
              <kbd>5</kbd>
              <span>Polygon Tool</span>
            </div>
            <div class="shortcut-item">
              <kbd>6</kbd>
              <span>Eraser Tool</span>
            </div>
            <div class="shortcut-item">
              <kbd>Delete</kbd>
              <span>Delete Selected</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl+C</kbd>
              <span>Copy</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl+V</kbd>
              <span>Paste</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl+D</kbd>
              <span>Duplicate</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl+A</kbd>
              <span>Select All</span>
            </div>
            <div class="shortcut-item">
              <kbd>Escape</kbd>
              <span>Cancel Action</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" onclick="this.closest('.modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
  }

  showTutorial() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Tutorial</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="tutorial-content">
            <h4>Getting Started</h4>
            <p>Vector2Godot is a drawing tool that generates Godot _draw() function code.</p>
            
            <h4>Basic Usage</h4>
            <ol>
              <li>Select a drawing tool from the toolbar</li>
              <li>Draw shapes on the canvas</li>
              <li>See the generated code in the bottom panel</li>
              <li>Copy the code to use in your Godot project</li>
            </ol>
            
            <h4>Tools</h4>
            <ul>
              <li><strong>Select:</strong> Select and move shapes</li>
              <li><strong>Line:</strong> Draw straight lines</li>
              <li><strong>Rectangle:</strong> Draw rectangles</li>
              <li><strong>Circle:</strong> Draw circles and ellipses</li>
              <li><strong>Polygon:</strong> Draw custom polygons</li>
              <li><strong>Eraser:</strong> Delete shapes</li>
            </ul>
            
            <h4>Tips</h4>
            <ul>
              <li>Use the grid for precise positioning</li>
              <li>Middle-click or Shift+click to pan the canvas</li>
              <li>Use the mouse wheel to zoom in/out</li>
              <li>Double-click to finish drawing polygons</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" onclick="this.closest('.modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
  }

  showAbout() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>About Vector2Godot</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="about-content">
            <div class="about-logo">
              <img src="assets/icon.png" alt="Vector2Godot" width="64" height="64">
            </div>
            <h4>Vector2Godot v1.3.8</h4>
            <p>A vector drawing application that generates Godot _draw() function code.</p>
            
            <h4>Features</h4>
            <ul>
              <li>Multiple drawing tools</li>
              <li>Real-time code generation</li>
              <li>Grid system with snapping</li>
              <li>Zoom and pan controls</li>
              <li>Shape editing and manipulation</li>
              <li>Export to multiple formats</li>
            </ul>
            
            <h4>Created by</h4>
            <p>Stefan Willoughby</p>
            
            <h4>License</h4>
            <p>MIT License</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn" onclick="this.closest('.modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
  }

  updateUI() {
    // Update various UI elements
    this.updateZoomLevel();
    this.updateCanvasSizeDisplay();
    this.updateGridDisplay();
  }

  updateZoomLevel() {
    const zoomElement = document.getElementById('zoom-level');
    if (zoomElement && window.app && window.app.canvasRenderer) {
      const zoom = window.app.canvasRenderer.getCanvasProperties().zoom;
      zoomElement.textContent = `${Math.round(zoom * 100)}%`;
    }
  }

  updateCanvasSizeDisplay() {
    const canvasWidthValue = document.getElementById('canvas-width-value');
    const canvasHeightValue = document.getElementById('canvas-height-value');
    
    if (canvasWidthValue && canvasHeightValue && window.app && window.app.canvasRenderer) {
      const props = window.app.canvasRenderer.getCanvasProperties();
      canvasWidthValue.textContent = props.width;
      canvasHeightValue.textContent = props.height;
    }
  }

  updateGridDisplay() {
    const gridSizeValue = document.getElementById('grid-size-value');
    
    if (gridSizeValue && window.app && window.app.canvasRenderer) {
      const props = window.app.canvasRenderer.getCanvasProperties();
      gridSizeValue.textContent = props.gridSize;
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

  getNotifications() {
    return this.notifications;
  }

  clearNotifications() {
    this.notifications = [];
    const container = document.getElementById('notification-container');
    if (container) {
      container.innerHTML = '';
    }
  }
}
