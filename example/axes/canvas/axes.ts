import browser from 'common/browser';

export interface AxesData {
  x: number;
  y: number;
}

export interface AxesOptions {
  axisColor?: string;
  dataLineColor?: string;
  tickColor?: string;
  tickLineWidth?: number;
  dataLineWidth?: number;
  guideColor?: string;
}

class Axes {
  width: number;
  height: number;
  left: number;
  top: number;
  axisColor: string;
  dataLineColor: string;
  guideColor: string;
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
  cacheImgData: any;
  constructor(ctx: CanvasRenderingContext2D, data: AxesData[], options?: AxesOptions) {
    let defaultOptions = { axisColor: '#000', tickColor: '#666', dataLineColor: '#DE0B27', guideColor: 'rgba(0,0,230,0.4)', tickLineWidth: 1, dataLineWidth: 1 };
    let opts = { ...defaultOptions, ...options };
    this.ctx = ctx;
    this.data = data.sort((a, b) => a.x - b.x);
    this.axisColor = opts.axisColor;
    this.tickColor = opts.tickColor;
    this.dataLineColor = opts.dataLineColor;
    this.guideColor = opts.guideColor;
    this.tickLineWidth = opts.tickLineWidth;
    this.dataLineWidth = opts.dataLineWidth;
    this.tickSize = browser.pc ? 6 : 4;
    this.minTickSpacing = 10;
    this.horizontalTickSpacing = 10;
    this.verticalTickSpacing = 10;
    this.computeSize();
    this.computeDelta();
  }
  private saveDrawingSurface() {
    let { ctx } = this;
    let canvas = ctx.canvas;
    this.cacheImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  private restoreDrawingSurface() {
    let { ctx, cacheImgData } = this;
    let canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(cacheImgData, 0, 0);
  }
  private computeSize() {
    let { ctx, horizontalTickSpacing, verticalTickSpacing } = this;
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    let minSize = Math.min(canvasWidth, canvasHeight);
    let width = minSize * 0.8;
    let height = minSize * 0.8;
    this.left = (canvasWidth - width) / 2;
    this.top = (canvasHeight - height) / 2;
    this.numHorizontalTicks = Math.floor(width / horizontalTickSpacing);
    this.numVerticalTicks = Math.floor(height / verticalTickSpacing);
    this.width = width;
    this.height = height;
  }
  private computeDelta() {
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
  private drawHorizontalLine(y: number) {
    let { ctx, left, width } = this;
    ctx.beginPath();
    ctx.moveTo(left, y - 0.5);
    ctx.lineTo(left + width, y - 0.5);
    ctx.stroke();
  }
  private drawVerticalLine(x: number) {
    let { ctx, left, top, height } = this;
    ctx.beginPath();
    ctx.moveTo(x - 0.5, top + height);
    ctx.lineTo(x - 0.5, top);
    ctx.stroke();
  }
  private drawHorizontalTicks() {
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
  private drawVerticalTicks() {
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
  private drawData() {
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
  private toCanvasX(x) {
    let { left, startX, xPerTick, horizontalTickSpacing } = this;
    return left + (x - startX) * horizontalTickSpacing / xPerTick;
  }
  private toCanvasY(y) {
    let { top, height, startY, yPerTick, verticalTickSpacing } = this;
    return top + height - (y - startY) * verticalTickSpacing / yPerTick;
  }
  private showPoint(x: number, y: number) {
    console.log(x, y);
  }
  public drawGuide(x: number, y: number) {
    console.log(x, y);
    let { ctx, left, top, width, height, guideColor } = this;
    if (x > left && x < left + width && y > top && y < top + height) {
      this.restoreDrawingSurface();
      ctx.save();
      ctx.strokeStyle = guideColor;
      ctx.lineWidth = 0.5;
      this.drawHorizontalLine(y);
      this.drawVerticalLine(x);
      ctx.restore();
    }
  }
  public render() {
    let { ctx, left, top, height, axisColor, tickColor, dataLineColor, dataLineWidth, tickLineWidth } = this;
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = axisColor;
    this.drawHorizontalLine(top + height);
    this.drawVerticalLine(left);
    ctx.lineWidth = tickLineWidth;
    ctx.strokeStyle = tickColor;
    this.drawHorizontalTicks();
    this.drawVerticalTicks();
    ctx.lineWidth = dataLineWidth;
    ctx.strokeStyle = dataLineColor;
    this.drawData();
    ctx.restore();
    this.saveDrawingSurface();
  }
}

export default Axes;
