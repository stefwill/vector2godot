/**
 * Canvas Renderer
 * Handles all canvas drawing operations and visual rendering
 */
export class CanvasRenderer {
  constructor(canvas, shapeManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.shapeManager = shapeManager;
    
    // Canvas properties
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.cssScale = 1;
    
    // Grid properties
    this.gridSize = 10;
    this.showGrid = true;
    this.canvasWidth = 256;
    this.canvasHeight = 256;
  }

  updateCanvasSize(width, height) {
    this.canvasWidth = width || this.canvasWidth;
    this.canvasHeight = height || this.canvasHeight;
    
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    
    this.fitCanvasToContainer();
  }

  fitCanvasToContainer() {
    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const scaleX = containerWidth / this.canvasWidth;
    const scaleY = containerHeight / this.canvasHeight;
    this.cssScale = Math.min(scaleX, scaleY, 1);
    
    this.canvas.style.width = `${this.canvasWidth * this.cssScale}px`;
    this.canvas.style.height = `${this.canvasHeight * this.cssScale}px`;
    
    // Center the canvas
    this.canvas.style.marginLeft = `${(containerWidth - this.canvasWidth * this.cssScale) / 2}px`;
    this.canvas.style.marginTop = `${(containerHeight - this.canvasHeight * this.cssScale) / 2}px`;
  }

  setZoom(zoom) {
    this.zoom = Math.max(0.1, Math.min(10, zoom));
    this.redrawCanvas();
  }

  setPan(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.redrawCanvas();
  }

  setGridProperties(gridSize, showGrid) {
    this.gridSize = gridSize;
    this.showGrid = showGrid;
  }

  redrawCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.zoom, this.zoom);
    
    if (this.showGrid) {
      this.drawGrid();
    }
    
    this.drawShapes();
    this.drawControlPoints();
    
    this.ctx.restore();
  }

  drawGrid() {
    this.ctx.strokeStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--grid-color').trim() || '#e0e0e0';
    this.ctx.lineWidth = 1 / this.zoom;
    this.ctx.setLineDash([]);
    
    const startX = Math.floor(-this.offsetX / this.zoom / this.gridSize) * this.gridSize;
    const startY = Math.floor(-this.offsetY / this.zoom / this.gridSize) * this.gridSize;
    const endX = startX + (this.canvasWidth / this.zoom) + this.gridSize;
    const endY = startY + (this.canvasHeight / this.zoom) + this.gridSize;
    
    this.ctx.beginPath();
    for (let x = startX; x <= endX; x += this.gridSize) {
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += this.gridSize) {
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
    }
    this.ctx.stroke();
  }

  drawShapes() {
    const shapes = this.shapeManager.getShapes();
    shapes.forEach(shape => {
      this.drawShape(shape);
    });
  }

  drawShape(shape) {
    this.ctx.save();
    this.ctx.lineWidth = shape.strokeWidth / this.zoom;
    this.ctx.strokeStyle = shape.strokeColor;
    this.ctx.setLineDash([]);
    
    if (shape.fillEnabled && shape.fillColor) {
      this.ctx.fillStyle = shape.fillColor;
    }
    
    switch (shape.type) {
      case 'line':
        this.drawLine(shape);
        break;
      case 'rectangle':
        this.drawRectangle(shape);
        break;
      case 'circle':
        this.drawCircle(shape);
        break;
      case 'polygon':
        this.drawPolygon(shape);
        break;
    }
    
    // Highlight selected shape
    if (this.shapeManager.getSelectedShape() === shape) {
      this.ctx.strokeStyle = '#007acc';
      this.ctx.lineWidth = (shape.strokeWidth + 2) / this.zoom;
      this.ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  drawLine(shape) {
    this.ctx.beginPath();
    this.ctx.moveTo(shape.startX, shape.startY);
    this.ctx.lineTo(shape.endX, shape.endY);
    this.ctx.stroke();
  }

  drawRectangle(shape) {
    const x = Math.min(shape.startX, shape.endX);
    const y = Math.min(shape.startY, shape.endY);
    const width = Math.abs(shape.endX - shape.startX);
    const height = Math.abs(shape.endY - shape.startY);
    
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    
    if (shape.fillEnabled) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  drawCircle(shape) {
    const centerX = (shape.startX + shape.endX) / 2;
    const centerY = (shape.startY + shape.endY) / 2;
    const radiusX = Math.abs(shape.endX - shape.startX) / 2;
    const radiusY = Math.abs(shape.endY - shape.startY) / 2;
    
    this.ctx.beginPath();
    this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    
    if (shape.fillEnabled) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  drawPolygon(shape) {
    if (shape.points.length < 2) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
    
    for (let i = 1; i < shape.points.length; i++) {
      this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }
    
    if (shape.points.length > 2) {
      this.ctx.closePath();
      if (shape.fillEnabled) {
        this.ctx.fill();
      }
    }
    
    this.ctx.stroke();
  }

  drawControlPoints() {
    const controlPoints = this.shapeManager.getControlPoints();
    if (controlPoints.length === 0) return;
    
    this.ctx.save();
    this.ctx.fillStyle = '#007acc';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2 / this.zoom;
    
    controlPoints.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 4 / this.zoom, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    });
    
    this.ctx.restore();
  }

  drawPreviewShape(startX, startY, endX, endY, shapeType, strokeColor, strokeWidth) {
    this.ctx.save();
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = strokeWidth / this.zoom;
    this.ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);
    
    switch (shapeType) {
      case 'line':
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        break;
      case 'rectangle':
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        this.ctx.strokeRect(x, y, width, height);
        break;
      case 'circle':
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const radiusX = Math.abs(endX - startX) / 2;
        const radiusY = Math.abs(endY - startY) / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        break;
    }
    
    this.ctx.restore();
  }

  drawPolygonPreview(points, currentPoint) {
    if (points.length === 0) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = '#007acc';
    this.ctx.lineWidth = 2 / this.zoom;
    this.ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);
    
    // Draw existing points
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    
    // Draw line to current mouse position
    if (currentPoint) {
      this.ctx.lineTo(currentPoint.x, currentPoint.y);
    }
    
    this.ctx.stroke();
    
    // Draw points
    this.ctx.fillStyle = '#007acc';
    this.ctx.setLineDash([]);
    
    points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 3 / this.zoom, 0, 2 * Math.PI);
      this.ctx.fill();
    });
    
    this.ctx.restore();
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    
    // Get mouse position relative to the canvas element (considering CSS scaling)
    let x = (e.clientX - rect.left) / this.cssScale;
    let y = (e.clientY - rect.top) / this.cssScale;
    
    // Convert from canvas coordinate space to drawing coordinate space
    x = (x - this.offsetX) / this.zoom;
    y = (y - this.offsetY) / this.zoom;
    
    return { x, y };
  }

  snapToGrid(x, y) {
    if (this.showGrid) {
      return {
        x: Math.round(x / this.gridSize) * this.gridSize,
        y: Math.round(y / this.gridSize) * this.gridSize
      };
    }
    return { x, y };
  }

  getCanvasProperties() {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight,
      zoom: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      cssScale: this.cssScale,
      gridSize: this.gridSize,
      showGrid: this.showGrid
    };
  }
}
