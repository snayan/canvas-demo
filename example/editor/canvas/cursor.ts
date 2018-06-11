/* 光标的一些属性参数 */
export interface CursorOptions {
  width?: number;
  height?: number;
  fillStyle?: string;
}

/* 光标 */
class Cursor {
  height: number;
  width: number;
  fillStyle: string;
  ctx: CanvasRenderingContext2D;
  imgData: ImageData;
  left: number;
  bottom: number;
  blinkOn: number;
  blinkOff: number;
  lastShowTime: number;
  timer: number;
  constructor(ctx, options: CursorOptions = {}) {
    this.ctx = ctx;
    this.width = options.width || 1;
    this.height = options.height || this.getHeight();
    this.fillStyle = 'rgba(0,0,0,0.8)';
    this.blinkOn = 500;
    this.blinkOff = 500;
    this.lastShowTime = 0;
  }

  /* 获取当前字体的大致高度 */
  private getHeight() {
    let { ctx } = this;
    let h = ctx.measureText('M').width;
    return h + h / 6;
  }

  /* 擦掉光标 */
  private erase() {
    let { ctx, imgData, width, height, left, bottom } = this;
    if (imgData) {
      ctx.putImageData(imgData, 0, 0, left - 1, bottom - height - 1, width + 2, height + 2);
    }
  }

  /* 绘制光标 */
  private draw() {
    let { ctx, left, bottom, width, height, fillStyle } = this;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = width;
    ctx.fillRect(left, bottom - height, width, height);
    ctx.restore();
  }

  /* 闪烁光标 */
  private blink(time: number) {
    let { ctx, blinkOn, blinkOff, lastShowTime } = this;
    let delta = time - lastShowTime;
    if (delta > blinkOn + blinkOff) {
      this.draw();
      this.lastShowTime = time;
    } else if (delta > blinkOn) {
      this.erase();
    }
    this.timer = window.requestAnimationFrame(this.blink.bind(this));
  }

  /* 绘制光标 */
  public move(left: number, bottom: number) {
    let { ctx, width, height, timer } = this;
    this.erase();
    this.imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.left = left;
    this.bottom = bottom;
    this.lastShowTime = 0;
    window.cancelAnimationFrame(timer);
    this.blink(performance.now());
  }
}

export default Cursor;
