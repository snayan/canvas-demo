import Canvas from 'common/canvas';
import Star from './star';

class BgCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  font: string;
  starCount: number;
  stars: Star[];
  meteorCount: number;
  meteors: Star[];
  constructor(width, height) {
    super();
    this.ctx = this.getContext('2d');
    this.starCount = 280;
    this.stars = [];
    this.meteorCount = 20;
    this.meteors = [];
    this.initCanvasSize(width, height);
    this.createStars();
  }
  /* 画背景 */
  private drawBg(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'hsla(217, 84%, 6%, 2)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }
  /* 生成星星 */
  private createStars() {
    let { starCount, width, height, ctx } = this;
    let option;
    for (let i = 0; i < starCount; i++) {
      option = {
        isBlink: false,
        isMeteor: false,
      };
      this.stars.push(new Star(ctx, option));
    }
  }
  /* 画星星 */
  private drawStars() {
    for (let star of this.stars) {
      star.render();
    }
  }
  /* 渲染 */
  public render() {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawBg(this.ctx);
    this.drawStars();
    return this;
  }
}

export default BgCanvas;
