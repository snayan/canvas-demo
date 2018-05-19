/* 星星 */

class Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  ctx: CanvasRenderingContext2D;
  isBlink: boolean;
  constructor(x, y, r, a, isBlink) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.alpha = a;
    this.isBlink = isBlink;
  }
  public render() {}
}

class StarFactory {
  r: number;
  stars: Star[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    let r = 50;
    this.r = r;
    this.stars = [];
    this.ctx = ctx;
    this.canvas = document.createElement('canvas');
    this.canvas.width = r * 2;
    this.canvas.height = r * 2;
    let starCtx = this.canvas.getContext('2d');
    let gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
    gradient.addColorStop(0.025, '#ccc');
    gradient.addColorStop(0.1, 'hsl(217, 61%, 33%)');
    gradient.addColorStop(0.25, 'hsl(217, 64%, 6%)');
    gradient.addColorStop(1, 'transparent');
    starCtx.fillStyle = gradient;
    starCtx.beginPath();
    starCtx.arc(r, r, r, 0, Math.PI * 2);
    starCtx.fill();
  }
  public create(x, y, radius, alpha, isBlink = true) {
    let { r } = this;
    let star = new Star(x - r / 2, y - r / 2, radius, alpha, isBlink);
    this.stars.push(star);
    this.renderStar(star);
  }
  public renderStar(star: Star) {
    let { ctx, canvas } = this;
    ctx.save();
    ctx.globalAlpha = star.alpha;
    ctx.drawImage(canvas, star.x, star.y, star.r, star.r);
    ctx.restore();
  }
}

export default StarFactory;
