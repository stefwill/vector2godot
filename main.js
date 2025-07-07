import './style.css'

class VectorDrawingApp {
  constructor() {
    this.canvas = document.getElementById('drawing-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.codeOutput = document.getElementById('code-output');
    
    this.currentTool = 'select';
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
    this.canvasWidth = 800;
    this.canvasHeight = 600;
    
    // Zoom and pan properties
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    
    // Shape editing properties
    this.isEditing = false;
    this.editingShape = null;
    this.editingPoint = null;
    this.controlPoints = [];
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateCanvasSize(); // Set initial canvas size
    this.redrawCanvas(); // This will draw the grid and update code output
    this.updateCodeOutput();
  }
  
  setupEventListeners() {
    // Tool selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.dataset.tool;
        this.polygonPoints = []; // Reset polygon points when switching tools
      });
    });
    
    // Canvas events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu
    
    // Property controls
    document.getElementById('stroke-width').addEventListener('input', (e) => {
      document.getElementById('stroke-width-value').textContent = e.target.value;
    });
    
    // Grid controls
    document.getElementById('grid-size').addEventListener('input', (e) => {
      this.gridSize = parseInt(e.target.value);
      document.getElementById('grid-size-value').textContent = e.target.value;
      this.redrawCanvas();
    });
    
    document.getElementById('show-grid').addEventListener('change', (e) => {
      this.showGrid = e.target.checked;
      this.redrawCanvas();
    });
    
    document.getElementById('snap-to-grid').addEventListener('change', (e) => {
      this.snapToGrid = e.target.checked;
    });
    
    // Canvas dimension controls
    document.getElementById('canvas-width').addEventListener('input', (e) => {
      this.canvasWidth = parseInt(e.target.value);
      document.getElementById('canvas-width-value').textContent = e.target.value;
      this.updateCanvasSize();
    });
    
    document.getElementById('canvas-height').addEventListener('input', (e) => {
      this.canvasHeight = parseInt(e.target.value);
      document.getElementById('canvas-height-value').textContent = e.target.value;
      this.updateCanvasSize();
    });
    
    document.getElementById('preset-sizes').addEventListener('change', (e) => {
      if (e.target.value) {
        const [width, height] = e.target.value.split('x').map(Number);
        this.canvasWidth = width;
        this.canvasHeight = height;
        document.getElementById('canvas-width').value = width;
        document.getElementById('canvas-height').value = height;
        document.getElementById('canvas-width-value').textContent = width;
        document.getElementById('canvas-height-value').textContent = height;
        this.updateCanvasSize();
        e.target.value = ''; // Reset selection
      }
    });
    
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
      this.setZoom(this.zoom * 1.2);
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
      this.setZoom(this.zoom / 1.2);
    });
    
    document.getElementById('zoom-reset').addEventListener('click', () => {
      this.setZoom(1);
      this.offsetX = 0;
      this.offsetY = 0;
      this.redrawCanvas();
    });
    
    // Action buttons
    document.getElementById('clear-btn').addEventListener('click', this.clearCanvas.bind(this));
    document.getElementById('copy-code-btn').addEventListener('click', this.copyCode.bind(this));
  }
  
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left - this.offsetX) / this.zoom;
    let y = (e.clientY - rect.top - this.offsetY) / this.zoom;
    
    // Snap to grid if enabled
    if (this.snapToGrid && this.currentTool !== 'select') {
      x = Math.round(x / this.gridSize) * this.gridSize;
      y = Math.round(y / this.gridSize) * this.gridSize;
    }
    
    return { x, y };
  }
  
  handleMouseDown(e) {
    const pos = this.getMousePos(e);
    
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
    
    if (this.currentTool === 'polygon') return; // Polygon uses click events
    
    this.startX = pos.x;
    this.startY = pos.y;
    this.isDrawing = true;
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
    
    if (!this.isDrawing || this.currentTool === 'polygon' || this.currentTool === 'select') return;
    
    this.redrawCanvas();
    this.drawPreview(this.startX, this.startY, pos.x, pos.y);
  }
  
  handleMouseUp(e) {
    if (this.isPanning) {
      this.isPanning = false;
      return;
    }
    
    if (this.isEditing) {
      this.isEditing = false;
      this.editingPoint = null;
      return;
    }
    
    if (!this.isDrawing || this.currentTool === 'polygon' || this.currentTool === 'select') return;
    
    const pos = this.getMousePos(e);
    this.addShape(this.startX, this.startY, pos.x, pos.y);
    this.isDrawing = false;
    this.redrawCanvas();
    this.updateCodeOutput();
  }
  
  handleClick(e) {
    if (this.currentTool !== 'polygon') return;
    
    const pos = this.getMousePos(e);
    
    // Double-click to finish polygon
    if (e.detail === 2) {
      if (this.polygonPoints.length >= 3) {
        this.addPolygon();
      }
      this.polygonPoints = [];
      this.redrawCanvas();
      this.updateCodeOutput();
      return;
    }
    
    // Single click to add point
    this.polygonPoints.push({ x: pos.x, y: pos.y });
    this.redrawCanvas();
    this.drawPolygonPreview();
  }
  
  handleWheel(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, this.zoom * zoomFactor));
    
    // Zoom towards mouse position
    this.offsetX = mouseX - (mouseX - this.offsetX) * (newZoom / this.zoom);
    this.offsetY = mouseY - (mouseY - this.offsetY) * (newZoom / this.zoom);
    
    this.setZoom(newZoom);
  }
  
  setZoom(zoom) {
    this.zoom = Math.max(0.1, Math.min(5, zoom));
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
    const strokeColor = document.getElementById('stroke-color').value;
    const fillColor = document.getElementById('fill-color').value;
    const strokeWidth = parseInt(document.getElementById('stroke-width').value);
    const fillEnabled = document.getElementById('fill-enabled').checked;
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fillStyle = fillColor;
    this.ctx.lineWidth = strokeWidth;
    
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
  }
  
  drawPolygonPreview() {
    if (this.polygonPoints.length < 2) return;
    
    const strokeColor = document.getElementById('stroke-color').value;
    const strokeWidth = parseInt(document.getElementById('stroke-width').value);
    
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.setLineDash([5, 5]);
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
    for (let i = 1; i < this.polygonPoints.length; i++) {
      this.ctx.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
    }
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    // Draw points
    this.ctx.fillStyle = strokeColor;
    this.polygonPoints.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.ctx.setTransform(this.zoom, 0, 0, this.zoom, this.offsetX, this.offsetY);
    
    // Draw grid first (behind shapes)
    this.drawGrid();
    
    this.shapes.forEach(shape => {
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
    
    this.codeOutput.value = code;
  }
  
  clearCanvas() {
    this.shapes = [];
    this.polygonPoints = [];
    this.selectedShape = null;
    this.controlPoints = [];
    this.redrawCanvas();
    this.updateCodeOutput();
  }
  
  copyCode() {
    this.codeOutput.select();
    document.execCommand('copy');
    
    // Show feedback
    const btn = document.getElementById('copy-code-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  }
  
  updateCanvasSize() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.redrawCanvas();
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VectorDrawingApp();
});
