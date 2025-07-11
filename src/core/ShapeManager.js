/**
 * Shape Management
 * Handles all shape operations, validation, and geometric calculations
 */
export class ShapeManager {
  constructor() {
    this.shapes = [];
    this.selectedShape = null;
    this.editingShape = null;
    this.editingPoint = null;
    this.controlPoints = [];
  }

  addShape(shapeData) {
    const shape = this.createShape(shapeData);
    if (shape) {
      this.shapes.push(shape);
      return shape;
    }
    return null;
  }

  createShape(shapeData) {
    const {
      type,
      startX,
      startY,
      endX,
      endY,
      points,
      strokeColor = '#000000',
      fillColor = '#ffffff',
      strokeWidth = 2,
      fillEnabled = false
    } = shapeData;

    switch (type) {
      case 'line':
        return {
          type: 'line',
          startX,
          startY,
          endX,
          endY,
          strokeColor,
          strokeWidth
        };
      case 'rectangle':
        return {
          type: 'rectangle',
          startX,
          startY,
          endX,
          endY,
          strokeColor,
          fillColor,
          strokeWidth,
          fillEnabled
        };
      case 'circle':
        return {
          type: 'circle',
          startX,
          startY,
          endX,
          endY,
          strokeColor,
          fillColor,
          strokeWidth,
          fillEnabled
        };
      case 'polygon':
        return {
          type: 'polygon',
          points: [...points],
          strokeColor,
          fillColor,
          strokeWidth,
          fillEnabled
        };
      default:
        console.warn('Unknown shape type:', type);
        return null;
    }
  }

  removeShape(shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes.splice(index, 1);
      if (this.selectedShape === shape) {
        this.selectedShape = null;
      }
      return true;
    }
    return false;
  }

  clearShapes() {
    this.shapes = [];
    this.selectedShape = null;
    this.editingShape = null;
    this.editingPoint = null;
    this.controlPoints = [];
  }

  getShapeAt(x, y, tolerance = 5) {
    // Check shapes in reverse order (top to bottom)
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      if (this.isPointInShape(x, y, shape, tolerance)) {
        return shape;
      }
    }
    return null;
  }

  isPointInShape(x, y, shape, tolerance = 5) {
    switch (shape.type) {
      case 'line':
        return this.isPointNearLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY, tolerance);
      case 'rectangle':
        return this.isPointInRectangle(x, y, shape, tolerance);
      case 'circle':
        return this.isPointInCircle(x, y, shape, tolerance);
      case 'polygon':
        return this.isPointInPolygon(x, y, shape, tolerance);
      default:
        return false;
    }
  }

  isPointNearLine(x, y, x1, y1, x2, y2, tolerance) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B) <= tolerance;

    const param = dot / lenSq;
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

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy) <= tolerance;
  }

  isPointInRectangle(x, y, shape, tolerance) {
    const minX = Math.min(shape.startX, shape.endX) - tolerance;
    const maxX = Math.max(shape.startX, shape.endX) + tolerance;
    const minY = Math.min(shape.startY, shape.endY) - tolerance;
    const maxY = Math.max(shape.startY, shape.endY) + tolerance;
    
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }

  isPointInCircle(x, y, shape, tolerance) {
    const centerX = (shape.startX + shape.endX) / 2;
    const centerY = (shape.startY + shape.endY) / 2;
    const radiusX = Math.abs(shape.endX - shape.startX) / 2;
    const radiusY = Math.abs(shape.endY - shape.startY) / 2;
    
    const dx = (x - centerX) / (radiusX + tolerance);
    const dy = (y - centerY) / (radiusY + tolerance);
    
    return dx * dx + dy * dy <= 1;
  }

  isPointInPolygon(x, y, shape, tolerance) {
    const points = shape.points;
    if (points.length < 3) return false;

    // Check if point is near any edge
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      
      if (this.isPointNearLine(x, y, p1.x, p1.y, p2.x, p2.y, tolerance)) {
        return true;
      }
    }

    // Check if point is inside polygon using ray casting
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x;
      const yi = points[i].y;
      const xj = points[j].x;
      const yj = points[j].y;
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
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
        // For circles, we can provide control points at cardinal directions
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radiusX = Math.abs(shape.endX - shape.startX) / 2;
        const radiusY = Math.abs(shape.endY - shape.startY) / 2;
        
        vertices.push(
          { x: centerX, y: centerY - radiusY }, // Top
          { x: centerX + radiusX, y: centerY }, // Right
          { x: centerX, y: centerY + radiusY }, // Bottom
          { x: centerX - radiusX, y: centerY }  // Left
        );
        break;
      case 'line':
        vertices.push(
          { x: shape.startX, y: shape.startY },
          { x: shape.endX, y: shape.endY }
        );
        break;
      case 'polygon':
        vertices.push(...shape.points);
        break;
    }
    
    return vertices;
  }

  moveShape(shape, deltaX, deltaY) {
    switch (shape.type) {
      case 'line':
      case 'rectangle':
      case 'circle':
        shape.startX += deltaX;
        shape.startY += deltaY;
        shape.endX += deltaX;
        shape.endY += deltaY;
        break;
      case 'polygon':
        shape.points.forEach(point => {
          point.x += deltaX;
          point.y += deltaY;
        });
        break;
    }
  }

  duplicateShape(shape) {
    const duplicate = JSON.parse(JSON.stringify(shape));
    // Offset the duplicate slightly
    this.moveShape(duplicate, 10, 10);
    this.shapes.push(duplicate);
    return duplicate;
  }

  selectShape(shape) {
    this.selectedShape = shape;
    this.controlPoints = this.getShapeVertices(shape);
  }

  deselectShape() {
    this.selectedShape = null;
    this.controlPoints = [];
    this.editingShape = null;
    this.editingPoint = null;
  }

  getShapes() {
    return this.shapes;
  }

  getSelectedShape() {
    return this.selectedShape;
  }

  getControlPoints() {
    return this.controlPoints;
  }
}
