import Canvas from 'common/canvas';
import Loading from '@/loading';
import { windowToCanvas } from 'common/util';
import browser from 'common/browser';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

class ZoomCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  loading: Loading;
  image: HTMLImageElement;
  zoomRadius: number;
  scale: number;
  areaRect: Rect;
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.scale = 1.5;
  }

  /* 加载图片 */
  private loadImages() {
    let url = require(`../img/1.jpeg`);
    let img = new Image();
    img.src = url;
    img.onload = () => {
      this.image = img;
      this.loading.stop();
      setTimeout(this.drawImage.bind(this), 200);
    };
  }

  /* 绘制图片 */
  private drawImage() {
    let { ctx, image, width, height } = this;
    if (image) {
      let imgWidth = image.width;
      let imgHeight = image.height;
      let isHorizontal = width > height;
      let drawWidth;
      let drawHeight;
      let dstX;
      let dstY;
      if (isHorizontal) {
        drawHeight = height;
        drawWidth = (drawHeight * imgWidth) / imgHeight;
        dstX = (width - drawWidth) / 2;
        dstY = 0;
      } else {
        drawWidth = width;
        drawHeight = (drawWidth * imgHeight) / imgWidth;
        dstX = 0;
        dstY = (height - drawHeight) / 2;
      }
      this.areaRect = {
        left: dstX,
        top: dstY,
        width: drawWidth,
        height: drawHeight,
      };
      ctx.drawImage(image, dstX, dstY, drawWidth, drawHeight);
      ctx.rect(dstX, dstY, drawWidth, drawHeight);
      ctx.clip();
    }
  }

  /* 绘制放大镜🔍 */
  private drawZoom(e: MouseEvent | TouchEvent) {
    let { ctx, zoomRadius, loading, width, height, image, scale, areaRect } = this;
    e.preventDefault();
    if (!loading.isLoading) {
      let x;
      let y;
      if (browser.pc) {
        e = e as MouseEvent;
        x = e.x;
        y = e.y;
      } else {
        x = (e as TouchEvent).changedTouches[0].pageX;
        y = (e as TouchEvent).changedTouches[0].pageY;
      }
      let center = windowToCanvas(this.ctx.canvas, x, y);
      ctx.clearRect(0, 0, width, height);
      this.drawImage();
      ctx.save();
      ctx.lineWidth = zoomRadius * 0.1;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center.x, center.y, zoomRadius, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(
        ctx.canvas,
        center.x - zoomRadius,
        center.y - zoomRadius,
        zoomRadius * 2,
        zoomRadius * 2,
        center.x - zoomRadius - (zoomRadius * 2 * scale - zoomRadius * 2) / 2,
        center.y - zoomRadius - (zoomRadius * 2 * scale - zoomRadius * 2) / 2,
        zoomRadius * 2 * scale,
        zoomRadius * 2 * scale,
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  /* 绑定鼠标移动事件 */
  private bindMouseMove() {
    this.container.addEventListener(browser.pc ? 'mousemove' : 'touchmove', this.drawZoom.bind(this), false);
  }

  /* 渲染 */
  render(container: HTMLElement) {
    super.render(container);
    let { ctx, width, height } = this;
    this.loading = new Loading(ctx);
    this.loading.start();
    this.zoomRadius = Math.min(width, height) / 8;
    this.loadImages();
    this.bindMouseMove();
  }
}

export default ZoomCanvas;
