/**
 * Code Generator
 * Generates Godot _draw() function code from shapes
 */
export class CodeGenerator {
  constructor() {
    this.indentLevel = 0;
  }

  generateCode(shapes, canvasProperties) {
    if (!shapes || shapes.length === 0) {
      return this.generateEmptyCode();
    }

    const codeLines = [];
    codeLines.push('func _draw():');
    codeLines.push('\t# Generated by Vector2Godot');
    codeLines.push('\t# Canvas size: ' + canvasProperties.width + 'x' + canvasProperties.height);
    codeLines.push('');
    codeLines.push('\t# Scale factor for responsive design');
    codeLines.push('\tvar scale_factor = get_viewport().get_visible_rect().size.x / ' + canvasProperties.width + '.0');
    codeLines.push('\tvar center_offset = Vector2(0, 0)  # Adjust as needed');
    codeLines.push('');

    shapes.forEach((shape, index) => {
      codeLines.push(`\t# Shape ${index + 1}: ${shape.type}`);
      codeLines.push(...this.generateShapeCode(shape));
      codeLines.push('');
    });

    return codeLines.join('\n');
  }

  generateEmptyCode() {
    return `func _draw():
\t# Generated by Vector2Godot
\t# Add your drawing code here
\t
\t# Example:
\t# draw_line(Vector2(0, 0), Vector2(100, 100), Color.WHITE, 2.0)`;
  }

  generateShapeCode(shape) {
    switch (shape.type) {
      case 'line':
        return this.generateLineCode(shape);
      case 'rectangle':
        return this.generateRectangleCode(shape);
      case 'circle':
        return this.generateCircleCode(shape);
      case 'polygon':
        return this.generatePolygonCode(shape);
      default:
        return ['\t# Unknown shape type'];
    }
  }

  generateLineCode(shape) {
    const color = this.hexToGodotColor(shape.strokeColor);
    const width = shape.strokeWidth;
    
    return [
      `\tdraw_line(`,
      `\t\tVector2(${shape.startX.toFixed(0)}, ${shape.startY.toFixed(0)}) * scale_factor + center_offset,`,
      `\t\tVector2(${shape.endX.toFixed(0)}, ${shape.endY.toFixed(0)}) * scale_factor + center_offset,`,
      `\t\t${color},`,
      `\t\t${width.toFixed(1)} * scale_factor`,
      `\t)`
    ];
  }

  generateRectangleCode(shape) {
    const x = Math.min(shape.startX, shape.endX);
    const y = Math.min(shape.startY, shape.endY);
    const width = Math.abs(shape.endX - shape.startX);
    const height = Math.abs(shape.endY - shape.startY);
    
    const strokeColor = this.hexToGodotColor(shape.strokeColor);
    const fillColor = this.hexToGodotColor(shape.fillColor);
    
    const code = [];
    
    if (shape.fillEnabled) {
      code.push(
        `\tdraw_rect(`,
        `\t\tRect2(`,
        `\t\t\tVector2(${x.toFixed(0)}, ${y.toFixed(0)}) * scale_factor + center_offset,`,
        `\t\t\tVector2(${width.toFixed(0)}, ${height.toFixed(0)}) * scale_factor`,
        `\t\t),`,
        `\t\t${fillColor}`,
        `\t)`
      );
    }
    
    if (shape.strokeWidth > 0) {
      code.push(
        `\tdraw_rect(`,
        `\t\tRect2(`,
        `\t\t\tVector2(${x.toFixed(0)}, ${y.toFixed(0)}) * scale_factor + center_offset,`,
        `\t\t\tVector2(${width.toFixed(0)}, ${height.toFixed(0)}) * scale_factor`,
        `\t\t),`,
        `\t\t${strokeColor},`,
        `\t\tfalse,`,
        `\t\t${shape.strokeWidth.toFixed(1)} * scale_factor`,
        `\t)`
      );
    }
    
    return code;
  }

  generateCircleCode(shape) {
    const centerX = (shape.startX + shape.endX) / 2;
    const centerY = (shape.startY + shape.endY) / 2;
    const radiusX = Math.abs(shape.endX - shape.startX) / 2;
    const radiusY = Math.abs(shape.endY - shape.startY) / 2;
    
    const strokeColor = this.hexToGodotColor(shape.strokeColor);
    const fillColor = this.hexToGodotColor(shape.fillColor);
    
    const code = [];
    
    // Check if it's a perfect circle or ellipse
    if (Math.abs(radiusX - radiusY) < 0.1) {
      // Perfect circle
      const radius = radiusX;
      
      if (shape.fillEnabled) {
        code.push(
          `\tdraw_circle(`,
          `\t\tVector2(${centerX.toFixed(0)}, ${centerY.toFixed(0)}) * scale_factor + center_offset,`,
          `\t\t${radius.toFixed(1)} * scale_factor,`,
          `\t\t${fillColor}`,
          `\t)`
        );
      }
      
      if (shape.strokeWidth > 0) {
        code.push(
          `\tdraw_arc(`,
          `\t\tVector2(${centerX.toFixed(0)}, ${centerY.toFixed(0)}) * scale_factor + center_offset,`,
          `\t\t${radius.toFixed(1)} * scale_factor,`,
          `\t\t0.0,`,
          `\t\tTAU,`,
          `\t\t64,`,
          `\t\t${strokeColor},`,
          `\t\t${shape.strokeWidth.toFixed(1)} * scale_factor`,
          `\t)`
        );
      }
    } else {
      // Ellipse - approximate with polygon
      const points = this.generateEllipsePoints(centerX, centerY, radiusX, radiusY);
      code.push('\t# Ellipse approximated as polygon');
      code.push(...this.generatePolygonCodeFromPoints(points, shape.fillColor, shape.strokeColor, shape.strokeWidth, shape.fillEnabled));
    }
    
    return code;
  }

  generatePolygonCode(shape) {
    return this.generatePolygonCodeFromPoints(
      shape.points, 
      shape.fillColor, 
      shape.strokeColor, 
      shape.strokeWidth, 
      shape.fillEnabled
    );
  }

  generatePolygonCodeFromPoints(points, fillColor, strokeColor, strokeWidth, fillEnabled) {
    const code = [];
    
    if (points.length < 3) {
      return ['\t# Invalid polygon: needs at least 3 points'];
    }
    
    const godotFillColor = this.hexToGodotColor(fillColor);
    const godotStrokeColor = this.hexToGodotColor(strokeColor);
    
    // Generate points array
    const pointsArray = points.map(p => 
      `\t\tVector2(${p.x.toFixed(0)}, ${p.y.toFixed(0)}) * scale_factor + center_offset`
    ).join(',\n');
    
    if (fillEnabled) {
      code.push(
        `\tvar fill_points = PackedVector2Array([`,
        pointsArray,
        `\t])`,
        `\tdraw_colored_polygon(fill_points, ${godotFillColor})`
      );
    }
    
    if (strokeWidth > 0) {
      code.push(
        `\tvar stroke_points = PackedVector2Array([`,
        pointsArray,
        `\t])`,
        `\tdraw_polyline(stroke_points, ${godotStrokeColor}, ${strokeWidth.toFixed(1)} * scale_factor, true)`
      );
    }
    
    return code;
  }

  generateEllipsePoints(centerX, centerY, radiusX, radiusY, segments = 32) {
    const points = [];
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      points.push({ x, y });
    }
    
    return points;
  }

  hexToGodotColor(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return 'Color.WHITE';
    }
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    
    // Check for common colors
    const commonColors = {
      '#000000': 'Color.BLACK',
      '#ffffff': 'Color.WHITE',
      '#ff0000': 'Color.RED',
      '#00ff00': 'Color.GREEN',
      '#0000ff': 'Color.BLUE',
      '#ffff00': 'Color.YELLOW',
      '#ff00ff': 'Color.MAGENTA',
      '#00ffff': 'Color.CYAN',
      '#808080': 'Color.GRAY',
      '#800000': 'Color.DARK_RED',
      '#008000': 'Color.DARK_GREEN',
      '#000080': 'Color.DARK_BLUE'
    };
    
    const lowerHex = hex.toLowerCase();
    if (commonColors[lowerHex]) {
      return commonColors[lowerHex];
    }
    
    return `Color(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)})`;
  }

  generateOptimizedCode(shapes, canvasProperties) {
    // Group shapes by type and properties for optimization
    const groupedShapes = this.groupShapes(shapes);
    
    const codeLines = [];
    codeLines.push('func _draw():');
    codeLines.push('\t# Generated by Vector2Godot - Optimized');
    codeLines.push('\t# Canvas size: ' + canvasProperties.width + 'x' + canvasProperties.height);
    codeLines.push('');
    codeLines.push('\t# Scale factor for responsive design');
    codeLines.push('\tvar scale_factor = get_viewport().get_visible_rect().size.x / ' + canvasProperties.width + '.0');
    codeLines.push('\tvar center_offset = Vector2(0, 0)  # Adjust as needed');
    codeLines.push('');

    // Generate code for each group
    Object.entries(groupedShapes).forEach(([key, group]) => {
      codeLines.push(`\t# ${group.description}`);
      codeLines.push(...this.generateOptimizedGroupCode(group));
      codeLines.push('');
    });

    return codeLines.join('\n');
  }

  groupShapes(shapes) {
    const groups = {};
    
    shapes.forEach((shape, index) => {
      const key = `${shape.type}_${shape.strokeColor}_${shape.fillColor}_${shape.strokeWidth}`;
      
      if (!groups[key]) {
        groups[key] = {
          type: shape.type,
          strokeColor: shape.strokeColor,
          fillColor: shape.fillColor,
          strokeWidth: shape.strokeWidth,
          fillEnabled: shape.fillEnabled,
          shapes: [],
          description: `${shape.type} shapes with ${shape.strokeColor} stroke`
        };
      }
      
      groups[key].shapes.push(shape);
    });
    
    return groups;
  }

  generateOptimizedGroupCode(group) {
    if (group.shapes.length === 1) {
      return this.generateShapeCode(group.shapes[0]);
    }
    
    // For multiple shapes of same type, we could batch them
    const code = [];
    
    group.shapes.forEach((shape, index) => {
      code.push(`\t# ${group.type} ${index + 1}`);
      code.push(...this.generateShapeCode(shape));
    });
    
    return code;
  }

  generateCSVExport(shapes) {
    const csvLines = [];
    csvLines.push('Type,StartX,StartY,EndX,EndY,StrokeColor,FillColor,StrokeWidth,FillEnabled,Points');
    
    shapes.forEach(shape => {
      const points = shape.points ? shape.points.map(p => `${p.x},${p.y}`).join(';') : '';
      csvLines.push([
        shape.type,
        shape.startX || '',
        shape.startY || '',
        shape.endX || '',
        shape.endY || '',
        shape.strokeColor,
        shape.fillColor,
        shape.strokeWidth,
        shape.fillEnabled,
        points
      ].join(','));
    });
    
    return csvLines.join('\n');
  }

  generateSVGExport(shapes, canvasProperties) {
    const svgLines = [];
    svgLines.push(`<svg width="${canvasProperties.width}" height="${canvasProperties.height}" xmlns="http://www.w3.org/2000/svg">`);
    
    shapes.forEach(shape => {
      svgLines.push(this.generateSVGShape(shape));
    });
    
    svgLines.push('</svg>');
    return svgLines.join('\n');
  }

  generateSVGShape(shape) {
    switch (shape.type) {
      case 'line':
        return `<line x1="${shape.startX}" y1="${shape.startY}" x2="${shape.endX}" y2="${shape.endY}" stroke="${shape.strokeColor}" stroke-width="${shape.strokeWidth}" />`;
      case 'rectangle':
        const x = Math.min(shape.startX, shape.endX);
        const y = Math.min(shape.startY, shape.endY);
        const width = Math.abs(shape.endX - shape.startX);
        const height = Math.abs(shape.endY - shape.startY);
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${shape.fillEnabled ? shape.fillColor : 'none'}" stroke="${shape.strokeColor}" stroke-width="${shape.strokeWidth}" />`;
      case 'circle':
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radiusX = Math.abs(shape.endX - shape.startX) / 2;
        const radiusY = Math.abs(shape.endY - shape.startY) / 2;
        return `<ellipse cx="${centerX}" cy="${centerY}" rx="${radiusX}" ry="${radiusY}" fill="${shape.fillEnabled ? shape.fillColor : 'none'}" stroke="${shape.strokeColor}" stroke-width="${shape.strokeWidth}" />`;
      case 'polygon':
        const points = shape.points.map(p => `${p.x},${p.y}`).join(' ');
        return `<polygon points="${points}" fill="${shape.fillEnabled ? shape.fillColor : 'none'}" stroke="${shape.strokeColor}" stroke-width="${shape.strokeWidth}" />`;
      default:
        return `<!-- Unknown shape type: ${shape.type} -->`;
    }
  }
}
