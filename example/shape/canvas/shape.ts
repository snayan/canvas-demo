import Canvas from 'common/canvas';

interface Point {
  x: number;
  y: number;
}

class ShapeCanvas extends Canvas {
  shapeWidth: number;
  shapeHeight: number;
  shapeCount: number;
  shapes: Point[];
  ctx: CanvasRenderingContext2D;
  constructor() {
    super();
    this.shapeWidth = 100;
    this.shapeHeight = 100;
    this.shapeCount = 6;
    this.shapes = [];
    this.ctx = this.getContext('2d');
  }

  /* 动态计算shape的位置 */
  calculate() {
    let { width, height, shapeWidth, shapeHeight, shapeCount, shapes } = this;
    let maxHorizontalCount = 4;
    let minMargin = 20;
    let horizontalCount = Math.min(Math.floor(width / shapeWidth), maxHorizontalCount);
    let margin = (width - horizontalCount * shapeWidth) / (horizontalCount + 1);
    let verticalCount = Math.ceil(shapeCount / horizontalCount);
    while (margin < minMargin && horizontalCount > 1) {
      horizontalCount -= 1;
      verticalCount = Math.ceil(shapeCount / horizontalCount);
      margin = (width - horizontalCount * shapeWidth) / (horizontalCount + 1);
    }
    let top = (height - shapeHeight * verticalCount - margin * (verticalCount - 1)) / 2;
    for (let i = 0; i < verticalCount; i++) {
      for (let j = 0; j < horizontalCount; j++) {
        if (shapes.length >= shapeCount) {
          break;
        }
        shapes.push({
          x: (j + 1) * margin + j * shapeWidth,
          y: top + i * (shapeHeight + margin),
        });
      }
    }
    this.shapes = shapes;
  }

  /*  */
  drawShapes() {
    let { shapes, shapeWidth, shapeHeight, ctx } = this;
    ctx.save();
    ctx.lineWidth = 0.5;
    let i = 0;
    let x;
    let y;

    /* 绘制三角形 */
    let triangle = shapes[i++];
    x = triangle.x;
    y = triangle.y;
    ctx.beginPath();
    ctx.moveTo(x + shapeWidth / 2, y);
    ctx.lineTo(x, y + shapeHeight);
    ctx.lineTo(x + shapeWidth, y + shapeHeight);
    ctx.closePath();
    ctx.stroke();

    /* 绘制四边形 */
    let rect = shapes[i++];
    x = rect.x;
    y = rect.y;
    ctx.beginPath();
    ctx.rect(x, y, shapeWidth, shapeHeight);
    ctx.closePath();
    ctx.stroke();

    /* 绘制圆角矩形 */
    let roundRect = shapes[i++];
    let radius = 20;
    x = roundRect.x;
    y = roundRect.y;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + shapeWidth - radius, y);
    ctx.arcTo(x + shapeWidth, y, x + shapeWidth, y + radius, radius);
    ctx.lineTo(x + shapeWidth, y + shapeHeight - radius);
    ctx.arcTo(x + shapeWidth, y + shapeHeight, x + shapeWidth - radius, y + shapeHeight, radius);
    ctx.lineTo(x + radius, y + shapeHeight);
    ctx.arcTo(x, y + shapeHeight, x, y + shapeHeight - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.stroke();

    /* 绘制虚线圆角矩形 */
    ctx.save();
    ctx.setLineDash([2, 2]);
    let roundRect2 = shapes[i++];
    let radius2 = 30;
    x = roundRect2.x;
    y = roundRect2.y;
    ctx.beginPath();
    ctx.moveTo(x + radius2, y);
    ctx.lineTo(x + shapeWidth - radius2, y);
    ctx.arcTo(x + shapeWidth, y, x + shapeWidth, y + radius2, radius2);
    ctx.lineTo(x + shapeWidth, y + shapeHeight - radius2);
    ctx.arcTo(x + shapeWidth, y + shapeHeight, x + shapeWidth - radius2, y + shapeHeight, radius2);
    ctx.lineTo(x + radius2, y + shapeHeight);
    ctx.arcTo(x, y + shapeHeight, x, y + shapeHeight - radius2, radius2);
    ctx.lineTo(x, y + radius2);
    ctx.arcTo(x, y, x + radius2, y, radius2);
    ctx.stroke();
    ctx.restore();

    /* 绘制六边形 */
    let hexagon = shapes[i++];
    x = hexagon.x;
    y = hexagon.y;
    let tangent = 20;
    ctx.beginPath();
    ctx.moveTo(x + tangent, y);
    ctx.lineTo(x + shapeWidth - tangent, y);
    ctx.lineTo(x + shapeWidth, y + tangent);
    ctx.lineTo(x + shapeWidth, y + shapeHeight - tangent);
    ctx.lineTo(x + shapeWidth - tangent, y + shapeHeight);
    ctx.lineTo(x + tangent, y + shapeHeight);
    ctx.lineTo(x, y + shapeHeight - tangent);
    ctx.lineTo(x, y + tangent);
    ctx.closePath();
    ctx.stroke();

    /* 绘制圆形 */
    let circle = shapes[i++];
    x = circle.x;
    y = circle.y;
    let radius3 = Math.min(shapeWidth / 2, shapeHeight / 2);
    ctx.beginPath();
    ctx.arc(x + radius3, y + radius3, radius3, 0, Math.PI * 2, false);
    ctx.stroke();

  }

  /* 渲染 */
  render(container: HTMLElement) {
    super.render(container);
    this.calculate();
    this.drawShapes();
  }
}

export default ShapeCanvas;
