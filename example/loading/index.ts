interface LoadingOptions {
  radius?: number;
  count?: number;
  duration?: number;
  margin?: number;
}

class LoadingCanvas {
  ctx: CanvasRenderingContext2D;
  radius: number;
  count: number;
  color: string;
  index: number;
  duration: number;
  show: number;
  margin: number;
  point: number[];
  isLoading: boolean;
  constructor(ctx: CanvasRenderingContext2D, options: LoadingOptions = {}) {
    this.ctx = ctx;
    this.radius = options.radius || 5;
    this.count = options.count || 6;
    this.duration = options.duration || 8;
    this.margin = options.margin || 10;
    this.color = '#f48041';
    this.index = 0;
    this.show = this.duration;
    this.point = this.computerPoint();
    this.isLoading = false;
  }
  /* 创建坐标 */
  private computerPoint() {
    let point = [];
    let { ctx, count, radius, margin } = this;
    let totalLength = count * radius * 2 + (count - 1) * margin;
    let left = (ctx.canvas.width - totalLength) / 2;
    for (let i = 0; i < count; i++) {
      point[i] = left + radius + (radius * 2 + margin) * i;
    }
    return point;
  }
  /* 绘制圆点 */
  private renderArc(index, scale) {
    let { ctx, radius, point } = this;
    let x = point[index];
    let y = ctx.canvas.height / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  /* 开始loading */
  private startLoading() {
    let { index, count, margin, duration, show } = this;
    for (let i = 0; i < count; i++) {
      if (i === index) {
        this.renderArc(i, 0.8 + (0.6 * duration) / show);
      } else {
        this.renderArc(i, 0.8);
      }
    }
  }

  private animate() {
    let { ctx, color, count, show } = this;
    if (this.duration < 1) {
      this.duration = show;
      this.index += 1;
    }
    if (this.index >= count) {
      this.index = 0;
    }
    this.duration -= 1;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.isLoading) {
      ctx.save();
      ctx.fillStyle = color;
      this.startLoading();
      ctx.restore();
      window.requestAnimationFrame(this.animate.bind(this));
    }
  }

  /* 开始loading */
  public start() {
    this.isLoading = true;
    this.animate();
  }

  /* 停止loading */
  public stop() {
    let { ctx } = this;
    this.isLoading = false;
  }
}

export default LoadingCanvas;
