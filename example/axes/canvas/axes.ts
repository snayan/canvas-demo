export interface AxesData {
  x: number;
  y: number;
}

export interface AxesOptions {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  axisColor?: string;
  dataLineColor?: string;
  dataLineWidth?: string;
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
  axisColor: string;
  dataLineColor: string;
  dataLineWidth: number;
  minTickSpacing: number;
  horizontalTickSpacing: number;
  verticalTickSpacing: number;
  tickSize: number;
  tickColor: string;
  tickLineWidth: number;
  numHorizontalTicks: number;
  numVerticalTicks: number;
  ctx: CanvasRenderingContext2D;
  data: AxesData[];
  xPerTick: number;
  yPerTick: number;
  startX: number;
  startY: number;
  constructor(ctx: CanvasRenderingContext2D, data: AxesData[], options?: AxesOptions) {
    Object.assign(this, options);
    this.ctx = ctx;
    this.data = data.sort((a, b) => a.x - b.x);
    if (!this.axisColor) {
      this.axisColor = 'blue';
    }
    if (!this.tickColor) {
      this.tickColor = 'navy';
    }
    if (!this.dataLineColor) {
      this.dataLineColor = '#D4A090';
    }
    if (!this.tickLineWidth) {
      this.tickLineWidth = 0.5;
    }
    if (!this.dataLineWidth) {
      this.dataLineWidth = 0.5;
    }
    if (!this.tickSize) {
      this.tickSize = 8;
    }
    this.minTickSpacing = 10;
    this.computeSize();
    this.computeDelta();
  }
  computeSize() {
    let { ctx, width, height, left, top, horizontalTickSpacing, verticalTickSpacing } = this;
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    let minSize = Math.min(canvasWidth, canvasHeight);
    width = width || (this.width = minSize * 0.8);
    height = height || (this.height = minSize * 0.8);
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
    horizontalTickSpacing = horizontalTickSpacing || (this.horizontalTickSpacing = 10);
    verticalTickSpacing = verticalTickSpacing || (this.verticalTickSpacing = 10);
    this.numHorizontalTicks = Math.floor(width / horizontalTickSpacing);
    this.numVerticalTicks = Math.floor(height / verticalTickSpacing);
  }
  computeDelta() {
    let { data, numHorizontalTicks, numVerticalTicks } = this;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let { x, y } of data) {
      maxX = Math.max(maxX, x);
      minX = Math.min(minX, x);
      maxY = Math.max(maxY, y);
      minY = Math.min(minY, y);
    }
    this.xPerTick = Math.ceil((maxX - minX) / numHorizontalTicks);
    this.yPerTick = Math.ceil((maxY - minY) / numVerticalTicks);
    this.startX = maxX - this.xPerTick * numHorizontalTicks;
    this.startY = maxY - this.yPerTick * numVerticalTicks;
    this.startX = Math.max(Math.min(this.startX, minX), 0);
    this.startY = Math.max(Math.min(this.startY, minY), 0);
    this.startX = Math.floor(this.startX);
    this.startY = Math.floor(this.startY);
  }
  toCanvasX(x) {
    let { left, startX, xPerTick, horizontalTickSpacing } = this;
    return left + (x - startX) * horizontalTickSpacing / xPerTick;
  }
  toCanvasY(y) {
    let { top, height, startY, yPerTick, verticalTickSpacing } = this;
    return top + height - (y - startY) * verticalTickSpacing / yPerTick;
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
    let { ctx, data, left, top, width, height, xPerTick, startX, tickSize, numHorizontalTicks, horizontalTickSpacing } = this;
    ctx.beginPath();
    let text;
    let textWidth;
    let textHeight = ctx.measureText('W').width;
    let x;
    let y = top + height;
    for (let i = 0; i < numHorizontalTicks; i++) {
      x = left + horizontalTickSpacing * i - 0.5;
      if (i > 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - tickSize * (+!(i % 5) * 0.75 + 1));
      }
      text = i * xPerTick + startX;
      textWidth = ctx.measureText(text).width;
      if (i === 0 || i % 5 === 0) {
        ctx.strokeText(text, x - textWidth / 2, y + textHeight + 6);
      }
    }
    ctx.stroke();
  }
  drawVerticalTicks() {
    let { ctx, left, top, height, yPerTick, startY, tickSize, numVerticalTicks, verticalTickSpacing } = this;
    ctx.beginPath();
    let text;
    let textWidth;
    let textHeight = ctx.measureText('W').width;
    let x = left;
    let y;
    for (let i = 0; i < numVerticalTicks; i++) {
      y = top + height - verticalTickSpacing * i - 0.5;
      if (i > 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + tickSize * (+!(i % 5) * 0.75 + 1), y);
      }
      text = i * yPerTick + startY;
      textWidth = ctx.measureText(text).width;
      if (i === 0 || i % 5 === 0) {
        ctx.strokeText(text, x - textWidth - 10, y + textHeight / 2);
      }
    }
    ctx.stroke();
  }
  drawData() {
    let { ctx, data } = this;
    ctx.save();
    ctx.beginPath();
    let len = data.length;
    let point;
    if (len) {
      point = data[0];
      ctx.moveTo(this.toCanvasX(point.x), this.toCanvasY(point.y));
    }
    for (let i = 1; i < len; i++) {
      point = data[i];
      ctx.lineTo(this.toCanvasX(point.x), this.toCanvasY(point.y));
    }
    ctx.stroke();
    ctx.restore();
  }
  render() {
    let { ctx, axisColor, tickColor, dataLineColor, dataLineWidth, tickLineWidth } = this;
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = axisColor;
    this.drawHorizontalAxis();
    this.drawVerticalAxis();
    ctx.lineWidth = tickLineWidth;
    ctx.strokeStyle = tickColor;
    this.drawHorizontalTicks();
    this.drawVerticalTicks();
    ctx.lineWidth = dataLineWidth;
    ctx.strokeStyle = dataLineColor;
    this.drawData();
    ctx.restore();
  }
}

export default Axes;
