import Canvas from 'common/canvas';
import { FONT } from 'common/CONSTANT';
import Star from './star';
import styles from '../index.scss';

class ShCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  font: string;
  starCount: number;
  stars: Star[];
  meteorCount: number;
  meteors: Star[];
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.starCount = 280;
    this.stars = [];
    this.meteorCount = 20;
    this.meteors = [];
  }
  /* 随机数 */
  private random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
  /* 画星星 */
  private drawStars() {
    for (let star of this.stars) {
      star.render();
    }
  }
  /* 画流星 */
  private drawMeteor() {
    for (let star of this.meteors) {
      star.render();
    }
  }
  /* 开始 */
  private startSh() {
    let { width, height, ctx } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawBg(this.ctx);
    this.drawStars();
    this.drawMeteor();
    requestAnimationFrame(this.startSh.bind(this));
  }
  /* 渲染 */
  public render(container: HTMLElement) {
    super.render(container, styles.sh);
    this.container.innerHTML = '';
    this.container.appendChild(this.el);
    this.createStars();
    this.createMeteor();

    this.startSh();
    return this;
  }
}

export default ShCanvas;
