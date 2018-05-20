import Canvas from 'common/canvas';
import BgCanvas from './bgCanvas';
import ImgCanvas from './imgCanvas';
import MeteorCanvas from './meteorCanvas';
import LoadingCanvas from './loadingCanvas';
import ApologizeCanvas from './apologizeCanvas';
import styles from '../index.scss';

let bgm = require('../audio/bgm.mp3');

class ShCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  images: HTMLImageElement[];
  bgCanvas: BgCanvas;
  imgCanvas: ImgCanvas;
  meteorCanvas: MeteorCanvas;
  loadingCanvas: LoadingCanvas;
  apologizeCanvas: ApologizeCanvas;
  imgPromise: Promise<void>;
  audioPromise: Promise<boolean>;
  audioElement: HTMLAudioElement;
  hasInteract: boolean;
  showLoading: boolean;
  constructor() {
    super();
    this.images = [];
    this.ctx = this.getContext('2d');
    this.imgPromise = this.loadImages();
    this.audioPromise = this.loadBgm();
    this.hasInteract = false;
    this.showLoading = true;
    this.onClickBtn();
  }
  /* 加载图片 */
  private loadImages() {
    let count = 33;
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
  /* 加载BGM */
  private loadBgm() {
    let audio = document.createElement('audio');
    document.body.appendChild(audio);
    this.audioElement = audio;
    let playPromise;
    audio.muted = false;
    audio.loop = true;
    audio.src = bgm;
    audio.load();
    playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      return playPromise.then(() => true).catch(() => false);
    } else {
      return Promise.resolve(false);
    }
  }
  /* 点击按钮 */
  private onClickBtn() {
    this.el.addEventListener('click', (e: MouseEvent) => {
      let { x, y } = e;
      let { ctx, width, height } = this;
      let { btnLeft, btnTop, btnWidth, btnHeight } = this.apologizeCanvas;
      ctx.beginPath();
      ctx.rect(btnLeft, btnTop, btnWidth, btnHeight);
      if (ctx.isPointInPath(x, y)) {
        this.hasInteract = true;
        this.apologizeCanvas.drop();
        try {
          let playPromise = this.audioElement.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(() => true).catch(() => false);
          }
        } catch (e) {}
      }
    });
  }
  /* 开始 */
  private startSh() {
    let { width, height, ctx, showLoading, hasInteract } = this;
    ctx.clearRect(0, 0, width, height);
    this.bgCanvas.render();
    this.meteorCanvas.render();
    this.ctx.drawImage(this.bgCanvas.el, 0, 0);
    this.ctx.drawImage(this.meteorCanvas.el, 0, 0);
    if (showLoading) {
      this.loadingCanvas.render();
      this.ctx.drawImage(this.loadingCanvas.el, 0, 0);
    } else if (!this.apologizeCanvas.isOut) {
      this.apologizeCanvas.render();
      this.ctx.drawImage(this.apologizeCanvas.el, 0, 0);
    } else {
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
    this.loadingCanvas = new LoadingCanvas(this.width, this.height);
    this.startSh();
    await this.imgPromise;
    await this.audioPromise;
    this.showLoading = false;
    this.apologizeCanvas = new ApologizeCanvas(this.width, this.height);
    this.imgCanvas = new ImgCanvas(this.width, this.height, this.images);
    return this;
  }
}

export default ShCanvas;
