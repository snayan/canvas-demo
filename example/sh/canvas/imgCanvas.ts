import Canvas from 'common/canvas';
import { FONT } from 'common/CONSTANT';
import styles from '../index.scss';

class ImgCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  font: string;
  images: HTMLImageElement[];
  index: number;
  angle: number;
  nextAngle: number;
  maxAngle: number;
  marginLeft: number;
  marginTop: number;
  alpha: number;
  duration: number;
  show: number;
  constructor(width: number, height: number, images: HTMLImageElement[]) {
    super();
    this.ctx = this.getContext('2d');
    this.images = images;
    this.initCanvasSize(width, height);
    this.marginLeft = 20;
    this.marginTop = Math.floor(this.marginLeft * height / width);
    this.maxAngle = 45;
    this.angle = this.random(-this.maxAngle, this.maxAngle);
    this.nextAngle = this.random(-this.maxAngle, this.maxAngle);
    this.index = 0;
    this.alpha = 1;
    this.duration = 180;
    this.show = this.duration;
  }
  /* 随机数 */
  private random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  /* 旋转坐标 */
  public rotate(angle) {
    let { ctx } = this;
    ctx.rotate(angle * Math.PI / 180);
  }
  /* 平移坐标到图片中心 */
  private translate() {
    let { ctx, width, height } = this;
    ctx.translate(width / 2, height / 2);
  }
  /* 剪辑图片区域 */
  private clip() {
    let { ctx, marginLeft, marginTop, width, height } = this;
    ctx.beginPath();
    ctx.rect(marginLeft, marginTop, width - marginLeft * 2, height - marginTop * 2);
    ctx.clip();
  }
  /* 计算宽高 */
  private computeSize(img: HTMLImageElement) {
    let { width, height } = this;
    let imgW = img.width;
    let imgH = img.height;
    let dstW = width;
    let dstH = dstW * imgH / imgW;
    return { dstW, dstH };
  }
  private renderImage() {
    let { ctx, width, height, alpha, index, images } = this;
    let img = images[index];
    let next = (this.index + 1) % images.length;
    let nextImg = images[next];
    let dst = this.computeSize(nextImg);
    let dstW = dst.dstW;
    let dstH = dst.dstH;
    ctx.save();
    this.rotate(this.nextAngle);
    ctx.globalAlpha = 1 - alpha;
    this.ctx.drawImage(nextImg, -dstW / 2, -dstH / 2, dstW, dstH);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = alpha;
    dst = this.computeSize(img);
    dstW = dst.dstW;
    dstH = dst.dstH;
    this.rotate(this.angle);
    this.ctx.drawImage(img, -dstW / 2, -dstH / 2, dstW, dstH);
    ctx.restore();
  }
  /* 渲染 */
  public render() {
    let { ctx, width, height, maxAngle } = this;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    this.clip();
    this.translate();
    if (this.duration <= 0) {
      this.alpha = 1;
      this.index += 1;
      this.angle = this.nextAngle;
      this.nextAngle = this.random(-maxAngle, maxAngle);
      this.duration = this.show;
    }
    if (this.duration < 30) {
      this.alpha -= 1 / 30;
    }
    if (this.index >= this.images.length) {
      this.index = 0;
    }
    this.duration -= 1;
    this.renderImage();
    ctx.restore();
    return this;
  }
}

export default ImgCanvas;
