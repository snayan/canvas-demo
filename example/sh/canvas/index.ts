import Canvas from 'common/canvas';
import BgCanvas from './bgCanvas';
import ImgCanvas from './imgCanvas';
import MeteorCanvas from './meteorCanvas';
import LoadingCanvas from './loadingCanvas';
import styles from '../index.scss';

class ShCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  images: HTMLImageElement[];
  bgCanvas: BgCanvas;
  imgCanvas: ImgCanvas;
  meteorCanvas: MeteorCanvas;
  loadingCanvas: LoadingCanvas;
  promise: Promise<void>;
  constructor() {
    super();
    this.images = [];
    this.ctx = this.getContext('2d');
    this.promise = this.loadImages();
  }
  private loadImages() {
    let count = 34;
    return new Promise((resolve) => {
      for (let i = 0; i < count; i++) {
        let url = require(`../img/${i + 1}.jpg`);
        let img = new Image();
        img.src = url;
        img.onload = () => {
          this.images.push(img);
          let l = this.images.length;
          if (l > 5 || l === count) {
            resolve();
          }
        };
      }
    }).then(() => void 0);
  }
  /* 开始 */
  private startSh() {
    let { width, height, ctx } = this;
    ctx.clearRect(0, 0, width, height);
    this.bgCanvas.render();
    this.meteorCanvas.render();
    this.ctx.drawImage(this.bgCanvas.el, 0, 0);
    this.ctx.drawImage(this.meteorCanvas.el, 0, 0);
    if (this.imgCanvas) {
      this.imgCanvas.render();
      this.ctx.drawImage(this.imgCanvas.el, 0, 0);
    } else {
      this.loadingCanvas.render();
      this.ctx.drawImage(this.loadingCanvas.el, 0, 0);
    }
    requestAnimationFrame(this.startSh.bind(this));
  }
  /* 渲染 */
  public async render(container: HTMLElement) {
    super.render(container, styles.sh);
    this.container.innerHTML = '';
    this.container.appendChild(this.el);
    this.bgCanvas = new BgCanvas(this.width, this.height);
    this.meteorCanvas = new MeteorCanvas(this.width, this.height);
    this.loadingCanvas = new LoadingCanvas(this.width, this.height);
    this.startSh();
    await this.promise;
    this.imgCanvas = new ImgCanvas(this.width, this.height, this.images);
    return this;
  }
}

export default ShCanvas;
