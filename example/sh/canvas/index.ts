import Canvas from 'common/canvas';
import BgCanvas from './bgCanvas';
import ImgCanvas from './imgCanvas';
import MeteorCanvas from './meteorCanvas';
import styles from '../index.scss';

class ShCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  images: HTMLImageElement[];
  bgCanvas: BgCanvas;
  imgCanvas: ImgCanvas;
  meteorCanvas: MeteorCanvas;
  promise: Promise<void>;
  hasLoadImg: boolean;
  constructor() {
    super();
    this.images = [];
    this.hasLoadImg = false;
    this.ctx = this.getContext('2d');
    this.promise = this.loadImages();
  }
  private loadImages() {
    let count = 40;
    let promises = [];
    for (let i = 0; i < count; i++) {
      let url = require(`../img/${i + 1}.jpeg`);
      promises.push(
        new Promise((resolve) => {
          let img = new Image();
          img.src = url;
          img.onload = () => {
            this.images.push(img);
            resolve();
          };
          img.onerror = resolve;
        }),
      );
    }
    return Promise.all(promises).then(() => void 0);
  }
  /* 开始 */
  private startSh() {
    let { width, height, ctx } = this;
    ctx.clearRect(0, 0, width, height);
    this.bgCanvas.render();
    this.meteorCanvas.render();
    this.ctx.drawImage(this.bgCanvas.el, 0, 0);
    this.ctx.drawImage(this.meteorCanvas.el, 0, 0);
    if (this.hasLoadImg) {
      this.imgCanvas.render();
      this.ctx.drawImage(this.imgCanvas.el, 0, 0);
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
    this.startSh();
    await this.promise;
    this.hasLoadImg = true;
    this.imgCanvas = new ImgCanvas(this.width, this.height, this.images);
    return this;
  }
}

export default ShCanvas;
