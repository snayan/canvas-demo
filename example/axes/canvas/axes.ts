export interface AxesOptions {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  color?: string;
  horizontalTickSpacing?: number;
  verticalTickSpacing?: number;
  tickSize?: number;
  tickColor?: string;
  tickLineWidth?: number;
}

class Axes {
  width: number;
  height: number;
  left: number;
  top: number;
  color: string;
  horizontalTickSpacing: number;
  verticalTickSpacing: number;
  tickSize: number;
  tickColor: string;
  tickLineWidth: number;
  numHorizontalTicks: number;
  numVerticalTicks: number;
  ctx: CanvasRenderingContext2D;
  canvasOffset: ClientRect | DOMRect;
  constructor(ctx: CanvasRenderingContext2D, options?: AxesOptions) {
    Object.assign(this, options);
    this.ctx = ctx;
    this.canvasOffset = ctx.canvas.getBoundingClientRect();
    this.initAxes();
  }
  initAxes() {
    let { ctx, width, height, left, top, color, horizontalTickSpacing, verticalTickSpacing, tickColor, tickLineWidth, tickSize, canvasOffset } = this;
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    color || (this.color = 'blue');
    tickColor || (this.tickColor = 'navy');
    tickLineWidth || (this.tickLineWidth = 0.5);
    tickSize || (this.tickSize = 8);
    width = width || (this.width = canvasWidth * 0.7);
    height = height || (this.height = canvasHeight * 0.7);
    horizontalTickSpacing = horizontalTickSpacing || (this.horizontalTickSpacing = 20);
    verticalTickSpacing = verticalTickSpacing || (this.verticalTickSpacing = 40);
    left = +left;
    top = +top;
    if (Number.isNaN(left) || left < 0 || left > canvasWidth) {
      left = (canvasWidth - width) / 2;
    }
    if (Number.isNaN(top) || top < 0 || top > canvasHeight) {
      top = (canvasHeight - height) / 2;
    }
    this.left = left;
    this.top = top;
    this.numHorizontalTicks = width / horizontalTickSpacing;
    this.numVerticalTicks = height / verticalTickSpacing;
  }
  drawHorizontalAxis() {
    let { ctx, left, top, width, height } = this;
    ctx.beginPath();
    ctx.moveTo(left, top + height - 0.5);
    ctx.lineTo(left + width, top + height - 0.5);
    ctx.stroke();
  }
  drawVerticalAxis() {
    let { ctx, left, top, height } = this;
    ctx.beginPath();
    ctx.moveTo(left - 0.5, top + height);
    ctx.lineTo(left - 0.5, top);
    ctx.stroke();
  }
  drawHorizontalTicks() {
    let { ctx, left, top, height, tickSize, numHorizontalTicks, horizontalTickSpacing } = this;
    ctx.beginPath();
    let x;
    let y = top + height;
    for (let i = 1; i < numHorizontalTicks; i++) {
      x = left + horizontalTickSpacing * i - 0.5;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - tickSize * (+!(i % 5) * 0.75 + 1));
    }
    ctx.stroke();
  }
  drawVerticalTicks() {
    let { ctx, left, top, height, tickSize, numVerticalTicks, verticalTickSpacing } = this;
    ctx.beginPath();
    let x = left;
    let y;
    for (let i = 1; i < numVerticalTicks; i++) {
      y = top + height - verticalTickSpacing * i - 0.5;
      ctx.moveTo(x, y);
      ctx.lineTo(x + tickSize * (+!(i % 5) * 0.75 + 1), y);
    }
    ctx.stroke();
  }
  render() {
    let { ctx, left, top, width, height, color, tickColor, tickLineWidth } = this;
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = color;
    this.drawHorizontalAxis();
    this.drawVerticalAxis();
    ctx.lineWidth = tickLineWidth;
    ctx.strokeStyle = tickColor;
    this.drawHorizontalTicks();
    this.drawVerticalTicks();
    ctx.restore();
  }
}

export default Axes;
