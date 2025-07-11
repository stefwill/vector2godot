/**
 * Event Handler
 * Manages all user input events and interactions
 */
export class EventHandler {
  constructor(canvasRenderer, shapeManager, toolManager) {
    this.canvasRenderer = canvasRenderer;
    this.shapeManager = shapeManager;
    this.toolManager = toolManager;
    
    this.canvas = canvasRenderer.canvas;
    
    // Mouse interaction states
    this.isDrawing = false;
    this.isDragging = false;
    this.isPanning = false;
    this.isEditing = false;
    
    // Mouse positions
    this.startX = 0;
    this.startY = 0;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.panStartX = 0;
    this.panStartY = 0;
    this.dragOffset = { x: 0, y: 0 };
    
    // Polygon drawing
    this.polygonPoints = [];
    this.editingPoint = null;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Canvas mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.canvasRenderer.fitCanvasToContainer();
      }, 100);
    });

    // Keyboard events
    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Prevent default shortcuts during text input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (this.shapeManager.getSelectedShape()) {
            this.shapeManager.removeShape(this.shapeManager.getSelectedShape());
            this.canvasRenderer.redrawCanvas();
          }
          break;
        case 'Escape':
          this.cancelCurrentAction();
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // TODO: Implement undo
          }
          break;
        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // TODO: Implement redo
          }
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.copySelectedShape();
          }
          break;
        case 'v':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.pasteShape();
          }
          break;
        case 'd':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.duplicateSelectedShape();
          }
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.selectAllShapes();
          }
          break;
        // Tool shortcuts
        case '1':
          this.toolManager.setTool('select');
          break;
        case '2':
          this.toolManager.setTool('line');
          break;
        case '3':
          this.toolManager.setTool('rectangle');
          break;
        case '4':
          this.toolManager.setTool('circle');
          break;
        case '5':
          this.toolManager.setTool('polygon');
          break;
        case '6':
          this.toolManager.setTool('eraser');
          break;
      }
    });
  }

  handleMouseDown(e) {
    const pos = this.canvasRenderer.getMousePos(e);
    
    // Handle middle mouse button for panning
    if (e.button === 1) {
      this.startPanning(pos.x, pos.y);
      return;
    }

    const currentTool = this.toolManager.getCurrentTool();
    
    if (currentTool === 'select') {
      this.handleSelectMouseDown(pos, e);
    } else if (currentTool === 'eraser') {
      this.handleEraserClick(pos);
    } else if (currentTool === 'polygon') {
      // Polygon uses click events instead
      return;
    } else {
      this.startDrawing(pos);
    }
  }

  handleSelectMouseDown(pos, e) {
    // Check if clicking on a control point
    const controlPoints = this.shapeManager.getControlPoints();
    const controlPoint = this.findControlPoint(pos.x, pos.y, controlPoints);
    
    if (controlPoint) {
      this.startEditingPoint(controlPoint);
      return;
    }

    // Check if clicking on a shape
    const clickedShape = this.shapeManager.getShapeAt(pos.x, pos.y);
    
    if (clickedShape) {
      if (clickedShape !== this.shapeManager.getSelectedShape()) {
        this.shapeManager.selectShape(clickedShape);
      }
      this.startDragging(pos, clickedShape);
    } else {
      this.shapeManager.deselectShape();
      
      // Start panning if shift is held or right mouse button
      if (e.shiftKey || e.button === 2) {
        this.startPanning(pos.x, pos.y);
      }
    }
    
    this.canvasRenderer.redrawCanvas();
  }

  handleMouseMove(e) {
    const pos = this.canvasRenderer.getMousePos(e);
    
    if (this.isPanning) {
      this.updatePanning(pos.x, pos.y);
      return;
    }
    
    if (this.isEditing && this.editingPoint) {
      this.updateEditingPoint(pos);
      return;
    }
    
    if (this.isDragging) {
      this.updateDragging(pos);
      return;
    }
    
    if (this.isDrawing) {
      this.updateDrawing(pos);
      return;
    }
    
    // Handle polygon preview
    if (this.toolManager.getCurrentTool() === 'polygon' && this.polygonPoints.length > 0) {
      this.canvasRenderer.redrawCanvas();
      this.canvasRenderer.drawPolygonPreview(this.polygonPoints, pos);
    }
  }

  handleMouseUp(e) {
    if (e.button === 1 && this.isPanning) {
      this.stopPanning();
      return;
    }
    
    if (this.isPanning) {
      this.stopPanning();
      return;
    }
    
    if (this.isEditing) {
      this.stopEditing();
      return;
    }
    
    if (this.isDragging) {
      this.stopDragging();
      return;
    }
    
    if (this.isDrawing) {
      this.finishDrawing();
      return;
    }
  }

  handleClick(e) {
    const pos = this.canvasRenderer.getMousePos(e);
    
    if (this.toolManager.getCurrentTool() === 'polygon') {
      this.addPolygonPoint(pos);
    }
  }

  handleDoubleClick(e) {
    if (this.toolManager.getCurrentTool() === 'polygon') {
      this.finishPolygon();
    }
  }

  handleWheel(e) {
    e.preventDefault();
    
    const pos = this.canvasRenderer.getMousePos(e);
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    const canvas = this.canvasRenderer.getCanvasProperties();
    const newZoom = canvas.zoom * zoomFactor;
    
    // Adjust offset to zoom towards mouse position
    const newOffsetX = pos.x - (pos.x - canvas.offsetX / canvas.zoom) * newZoom;
    const newOffsetY = pos.y - (pos.y - canvas.offsetY / canvas.zoom) * newZoom;
    
    this.canvasRenderer.setZoom(newZoom);
    this.canvasRenderer.setPan(newOffsetX, newOffsetY);
    
    this.updateZoomLevel();
  }

  startPanning(x, y) {
    this.isPanning = true;
    this.panStartX = x;
    this.panStartY = y;
    this.canvas.style.cursor = 'grabbing';
  }

  updatePanning(x, y) {
    if (!this.isPanning) return;
    
    const deltaX = (x - this.panStartX) * this.canvasRenderer.zoom;
    const deltaY = (y - this.panStartY) * this.canvasRenderer.zoom;
    
    const canvas = this.canvasRenderer.getCanvasProperties();
    this.canvasRenderer.setPan(
      canvas.offsetX + deltaX,
      canvas.offsetY + deltaY
    );
    
    this.panStartX = x;
    this.panStartY = y;
  }

  stopPanning() {
    this.isPanning = false;
    this.canvas.style.cursor = this.toolManager.getCursor();
  }

  startDrawing(pos) {
    this.isDrawing = true;
    this.startX = pos.x;
    this.startY = pos.y;
    
    // Apply grid snapping if enabled
    if (this.canvasRenderer.showGrid) {
      const snapped = this.canvasRenderer.snapToGrid(pos.x, pos.y);
      this.startX = snapped.x;
      this.startY = snapped.y;
    }
  }

  updateDrawing(pos) {
    if (!this.isDrawing) return;
    
    let endX = pos.x;
    let endY = pos.y;
    
    // Apply grid snapping if enabled
    if (this.canvasRenderer.showGrid) {
      const snapped = this.canvasRenderer.snapToGrid(pos.x, pos.y);
      endX = snapped.x;
      endY = snapped.y;
    }
    
    this.canvasRenderer.redrawCanvas();
    this.canvasRenderer.drawPreviewShape(
      this.startX,
      this.startY,
      endX,
      endY,
      this.toolManager.getCurrentTool(),
      this.toolManager.getStrokeColor(),
      this.toolManager.getStrokeWidth()
    );
  }

  finishDrawing() {
    if (!this.isDrawing) return;
    
    const pos = this.canvasRenderer.getMousePos(event);
    let endX = pos.x;
    let endY = pos.y;
    
    // Apply grid snapping if enabled
    if (this.canvasRenderer.showGrid) {
      const snapped = this.canvasRenderer.snapToGrid(pos.x, pos.y);
      endX = snapped.x;
      endY = snapped.y;
    }
    
    const shapeData = {
      type: this.toolManager.getCurrentTool(),
      startX: this.startX,
      startY: this.startY,
      endX,
      endY,
      strokeColor: this.toolManager.getStrokeColor(),
      fillColor: this.toolManager.getFillColor(),
      strokeWidth: this.toolManager.getStrokeWidth(),
      fillEnabled: this.toolManager.isFillEnabled()
    };
    
    const shape = this.shapeManager.addShape(shapeData);
    
    if (shape && this.toolManager.getCurrentTool() === 'line') {
      this.checkForClosedShape(shape);
    }
    
    this.isDrawing = false;
    this.canvasRenderer.redrawCanvas();
    
    // Dispatch shape created event
    this.dispatchEvent('shapeCreated', { shape });
  }

  startDragging(pos, shape) {
    this.isDragging = true;
    this.dragStartX = pos.x;
    this.dragStartY = pos.y;
    this.dragOffset = { x: 0, y: 0 };
    this.canvas.style.cursor = 'grabbing';
  }

  updateDragging(pos) {
    if (!this.isDragging) return;
    
    const deltaX = pos.x - this.dragStartX;
    const deltaY = pos.y - this.dragStartY;
    
    const selectedShape = this.shapeManager.getSelectedShape();
    if (selectedShape) {
      this.shapeManager.moveShape(selectedShape, deltaX - this.dragOffset.x, deltaY - this.dragOffset.y);
      this.dragOffset = { x: deltaX, y: deltaY };
      this.canvasRenderer.redrawCanvas();
    }
  }

  stopDragging() {
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.canvas.style.cursor = this.toolManager.getCursor();
    
    // Update control points after dragging
    const selectedShape = this.shapeManager.getSelectedShape();
    if (selectedShape) {
      this.shapeManager.selectShape(selectedShape);
    }
  }

  startEditingPoint(controlPoint) {
    this.isEditing = true;
    this.editingPoint = controlPoint;
    this.canvas.style.cursor = 'grabbing';
  }

  updateEditingPoint(pos) {
    if (!this.isEditing || !this.editingPoint) return;
    
    // Update the control point position
    this.editingPoint.x = pos.x;
    this.editingPoint.y = pos.y;
    
    // Update the actual shape based on the control point
    this.updateShapeFromControlPoint();
    
    this.canvasRenderer.redrawCanvas();
  }

  stopEditing() {
    this.isEditing = false;
    this.editingPoint = null;
    this.canvas.style.cursor = this.toolManager.getCursor();
  }

  addPolygonPoint(pos) {
    let x = pos.x;
    let y = pos.y;
    
    // Apply grid snapping if enabled
    if (this.canvasRenderer.showGrid) {
      const snapped = this.canvasRenderer.snapToGrid(pos.x, pos.y);
      x = snapped.x;
      y = snapped.y;
    }
    
    this.polygonPoints.push({ x, y });
    this.canvasRenderer.redrawCanvas();
    this.canvasRenderer.drawPolygonPreview(this.polygonPoints);
  }

  finishPolygon() {
    if (this.polygonPoints.length < 3) return;
    
    const shapeData = {
      type: 'polygon',
      points: [...this.polygonPoints],
      strokeColor: this.toolManager.getStrokeColor(),
      fillColor: this.toolManager.getFillColor(),
      strokeWidth: this.toolManager.getStrokeWidth(),
      fillEnabled: this.toolManager.isFillEnabled()
    };
    
    const shape = this.shapeManager.addShape(shapeData);
    this.polygonPoints = [];
    this.canvasRenderer.redrawCanvas();
    
    // Dispatch shape created event
    this.dispatchEvent('shapeCreated', { shape });
  }

  handleEraserClick(pos) {
    const shape = this.shapeManager.getShapeAt(pos.x, pos.y);
    if (shape) {
      this.shapeManager.removeShape(shape);
      this.canvasRenderer.redrawCanvas();
      this.dispatchEvent('shapeDeleted', { shape });
    }
  }

  findControlPoint(x, y, controlPoints, tolerance = 8) {
    for (const point of controlPoints) {
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      if (distance <= tolerance) {
        return point;
      }
    }
    return null;
  }

  updateShapeFromControlPoint() {
    // This would need to be implemented based on the specific shape type
    // and which control point is being edited
    // For now, we'll just update the control points
    const selectedShape = this.shapeManager.getSelectedShape();
    if (selectedShape) {
      this.shapeManager.selectShape(selectedShape);
    }
  }

  cancelCurrentAction() {
    this.isDrawing = false;
    this.isDragging = false;
    this.isPanning = false;
    this.isEditing = false;
    this.polygonPoints = [];
    this.editingPoint = null;
    this.canvas.style.cursor = this.toolManager.getCursor();
    this.canvasRenderer.redrawCanvas();
  }

  checkForClosedShape(newLine) {
    // TODO: Implement line connection detection
    // This would check if lines connect to form closed shapes
  }

  copySelectedShape() {
    const selected = this.shapeManager.getSelectedShape();
    if (selected) {
      localStorage.setItem('vector2godot-clipboard', JSON.stringify(selected));
    }
  }

  pasteShape() {
    const clipboardData = localStorage.getItem('vector2godot-clipboard');
    if (clipboardData) {
      try {
        const shapeData = JSON.parse(clipboardData);
        const shape = this.shapeManager.duplicateShape(shapeData);
        this.shapeManager.selectShape(shape);
        this.canvasRenderer.redrawCanvas();
        this.dispatchEvent('shapeCreated', { shape });
      } catch (error) {
        console.error('Failed to paste shape:', error);
      }
    }
  }

  duplicateSelectedShape() {
    const selected = this.shapeManager.getSelectedShape();
    if (selected) {
      const duplicate = this.shapeManager.duplicateShape(selected);
      this.shapeManager.selectShape(duplicate);
      this.canvasRenderer.redrawCanvas();
      this.dispatchEvent('shapeCreated', { shape: duplicate });
    }
  }

  selectAllShapes() {
    // TODO: Implement multi-selection
    console.log('Select all not implemented yet');
  }

  updateZoomLevel() {
    const zoomElement = document.getElementById('zoom-level');
    if (zoomElement) {
      const zoom = this.canvasRenderer.getCanvasProperties().zoom;
      zoomElement.textContent = `${Math.round(zoom * 100)}%`;
    }
  }

  dispatchEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  }
}
