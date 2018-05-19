import Canvas from 'common/canvas';
import Star from './star';

class BgCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  font: string;
  meteorCount: number;
  meteors: Star[];
  constructor(width, height) {
    super();
    this.ctx = this.getContext('2d');
    this.meteorCount = 50;
    this.meteors = [];
    this.initCanvasSize(width, height);
    this.createMeteor();
  }
  /* 生成流星 */
  private createMeteor() {
    let { meteorCount, width, height, ctx } = this;
    let option;
    for (let i = 0; i < meteorCount; i++) {
      setTimeout(() => {
        option = {
          isBlink: false,
          isMeteor: true,
        };
        this.meteors.push(new Star(ctx, option));
      }, i * 300);
    }
  }
  /* 画流星 */
  private drawMeteor() {
    for (let star of this.meteors) {
      star.render();
    }
  }
  /* 渲染 */
  public render() {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawMeteor();
    return this;
  }
}

export default BgCanvas;
