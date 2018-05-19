import Canvas from 'common/canvas';

class LoadingCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  radius: number;
  count: number;
  color: string;
  index: number;
  duration: number;
  show: number;
  margin: number;
  point: number[];
  constructor(width, height) {
    super();
    this.ctx = this.getContext('2d');
    this.initCanvasSize(width, height);
    this.radius = 5;
    this.count = 6;
    this.index = 0;
    this.duration = 10;
    this.show = this.duration;
    this.margin = 10;
    this.color = '#f48041';
    this.point = this.computerPoint();
  }
  private computerPoint() {
    let point = [];
    let { width, count, radius, margin } = this;
    let totalLength = count * radius * 2 + (count - 1) * margin;
    let left = (width - totalLength) / 2;
    for (let i = 0; i < count; i++) {
      point[i] = left + radius + (radius * 2 + margin) * i;
    }
    return point;
  }
  private renderArc(index, scale) {
    let { ctx, radius, point, height } = this;
    let x = point[index];
    let y = height / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  private startLoading() {
    let { index, count, margin, duration, show } = this;
    for (let i = 0; i < count; i++) {
      if (i === index) {
        this.renderArc(i, 0.8 + 0.6 * duration / show);
      } else {
        this.renderArc(i, 0.8);
      }
    }
  }
  /* 渲染 */
  public render() {
    let { ctx, width, height, color, count, show } = this;
    if (this.duration < 1) {
      this.duration = show;
      this.index += 1;
    }
    if (this.index >= count) {
      this.index = 0;
    }
    this.duration -= 1;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.fillStyle = color;
    this.startLoading();
    ctx.restore();
    return this;
  }
}

export default LoadingCanvas;
