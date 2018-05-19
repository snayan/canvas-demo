import Canvas from 'common/canvas';
import { FONT } from 'common/CONSTANT';
import StarFactory from './StarFactory';
import styles from '../index.scss';

class ShCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  font: string;
  starCount: number;
  starFactory: StarFactory;
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.starCount = 160;
    this.starFactory = new StarFactory(this.ctx);
  }
  /* 随机数 */
  private random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private createX() {
    return this.random(0, this.width);
  }
  private createY() {
    return this.random(0, this.height);
  }
  private createR() {
    return this.random(10, 50);
  }
  private createA() {
    return this.random(0, 1);
  }
  /* 画背景 */
  private drawBg(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'hsla(217, 84%, 6%, 2)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }
  /* 画星星 */
  private drawStars(ctx: CanvasRenderingContext2D) {
    ctx.save();
    let { width, height, starCount, starFactory } = this;
    for (let i = 0; i < this.starCount; i++) {
      starFactory.create(this.createX(), this.createY(), this.createR(), this.createA());
    }
    ctx.restore();
  }
  /* 开始 */
  private startSh() {
    let { width, height, ctx } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawBg(ctx);
    this.drawStars(ctx);
  }
  /* 渲染 */
  public render(container: HTMLElement) {
    super.render(container, styles.sh);
    this.container.innerHTML = '';
    this.container.appendChild(this.el);
    this.startSh();

    return this;
  }
}

export default ShCanvas;
