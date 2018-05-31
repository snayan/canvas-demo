/* grid class */

export interface GridOption {
  width?: number;
  height?: number;
  axisSpaceX?: number;
  axisSpaceY?: number;
  lineColor?: string;
}

class Grid {
  width: number;
  height: number;
  lineColor: string;
  numHorizontalStep: number;
  numVerticalStep: number;
  axisSpaceX: number;
  axisSpaceY: number;
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, options: GridOption = {}) {
    this.ctx = ctx;
    this.width = options.width;
    this.height = options.height;
    this.lineColor = options.lineColor || 'lightgray';
    this.axisSpaceX = options.axisSpaceX || 10;
    this.axisSpaceY = options.axisSpaceY || 10;
    this.initGrid();
  }

  /* 初始化网格数据 */
  initGrid() {
    let { ctx, width, height, axisSpaceX, axisSpaceY } = this;
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    width = width || (this.width = canvasWidth);
    height = height || (this.height = canvasHeight);
    let gridWidth = width - 1; //防止在绘制最后的垂直线在边界外的0.5像素处不可见，所以先预留1px
    let gridHeight = height - 1; //防止在绘制最后的水平线在边界外的0.5像素处不可见，所以先预留1px
    this.numHorizontalStep = Math.floor(gridWidth / axisSpaceX);
    this.numVerticalStep = Math.floor(gridHeight / axisSpaceY);
    this.axisSpaceX = gridWidth / this.numHorizontalStep;
    this.axisSpaceY = gridHeight / this.numVerticalStep;
  }

  /* 渲染网格 */
  render() {
    let { ctx, width, height, lineColor, axisSpaceX, axisSpaceY, numHorizontalStep, numVerticalStep } = this;
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = lineColor;
    ctx.translate(0, 0);
    ctx.beginPath();
    for (let i = 0; i < numHorizontalStep + 1; i += 1) {
      ctx.moveTo(i * axisSpaceX + 0.5, 0);
      ctx.lineTo(i * axisSpaceX + 0.5, height - 1);
    }
    for (let i = 0; i < numVerticalStep + 1; i += 1) {
      ctx.moveTo(0, i * axisSpaceY + 0.5);
      ctx.lineTo(width - 1, i * axisSpaceY + 0.5);
    }
    ctx.stroke();
    ctx.restore();
  }
}

export default Grid;
