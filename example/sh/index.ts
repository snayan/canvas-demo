import CommonRender from 'common/render';
import Canvas from 'common/canvas';
import { isSingleModule } from 'common/util';
import browser from 'common/browser';
import ShCanvas from './canvas';

let bgm = require('./audio/bgm.mp3');

const moduleName = 'sh';

export default class Sh extends CommonRender {
  canvas: Canvas[];
  constructor() {
    super(moduleName);
    this.canvas.push(new ShCanvas());
  }
  loadBgm() {
    let audio = document.createElement('audio');
    document.body.appendChild(audio);
    audio.src = bgm;
    audio.loop = true;
    audio.autoplay = true;
    audio.muted = false;
    audio.load();
    audio.canPlayType
    audio.onerror = (e) => {
      console.log(e);
    };
    return this;
  }
}

if (isSingleModule(moduleName)) {
  new Sh().render().then((sh) => sh.loadBgm());
}
