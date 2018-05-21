/* 星星 */

interface StarOption {
  isBlink?: boolean;
  isMeteor?: boolean;
}

class Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  isBlink: boolean;
  isMeteor: boolean;
  renderCtx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  constructor(renderCtx: CanvasRenderingContext2D, option: StarOption) {
    this.renderCtx = renderCtx;
    this.isBlink = !!option.isBlink;
    this.isMeteor = !!option.isMeteor;
    let { x, y } = this.createPoint();
    this.x = x;
    this.y = y;
    this.radius = this.isMeteor ? this.random(3, 8) : this.random(1, 3);
    this.alpha = this.isMeteor ? 1 : this.random(0, 1);
    this.initCanvas();
  }
  /* 初始化星星canvas */
  private initCanvas() {
    let radius = this.radius;
    let canvas = document.createElement('canvas');
    canvas.width = radius * 2;
    canvas.height = radius * 2;
    let starCtx = canvas.getContext('2d');
    let gradient = starCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0.25, '#fff');
    gradient.addColorStop(0.4, '#ccc');
    gradient.addColorStop(0.9, 'hsl(217, 61%, 33%)');
    gradient.addColorStop(1, 'transparent');
    starCtx.fillStyle = gradient;
    starCtx.beginPath();
    starCtx.arc(radius, radius, radius, 0, Math.PI * 2);
    starCtx.fill();
    this.canvas = canvas;
  }
  /* 随机数 */
  private random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  /* 创建坐标 */
  private createPoint() {
    let { renderCtx, isMeteor, radius } = this;
    let { width, height } = renderCtx.canvas;
    let x = this.random(0, isMeteor ? width * 2 : width);
    let y = isMeteor ? -3 : this.random(0, height);
    return { x, y };
  }
  /* 闪烁 */
  private blink() {
    if (this.isBlink) {
      if (this.alpha < 0) {
        this.alpha += 0.01;
      } else {
        this.alpha -= 0.01;
      }
    }
  }
  /* 流星 */
  private meteor() {
    let { renderCtx } = this;
    let { width, height } = renderCtx.canvas;
    if (this.x < 0 || this.y > height) {
      let { x, y } = this.createPoint();
      this.x = x;
      this.y = y;
    }
    this.x -= 1 * this.radius / 10;
    this.y += 2 * this.radius / 10;
  }
  /* 绘制 */
  public render() {
    let { renderCtx, canvas, isMeteor, isBlink } = this;
    isBlink && this.blink();
    isMeteor && this.meteor();
    renderCtx.save();
    renderCtx.globalAlpha = this.alpha;
    renderCtx.drawImage(canvas, this.x, this.y, this.radius, this.radius);
    renderCtx.restore();
    return this;
  }
}

export default Star;
