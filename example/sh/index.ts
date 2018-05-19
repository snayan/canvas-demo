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
    try {
      let audio = document.createElement('audio');
      let source = document.createElement('source');
      source.src = bgm;
      source.type = 'audio/mp3';
      audio.appendChild(source);
      document.body.appendChild(audio);
      audio.muted = false;
      audio.loop = true;
      audio
        .play()
        .then(() => console.log(1))
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
    return this;
  }
}

if (isSingleModule(moduleName)) {
  new Sh().render().then((sh) => sh.loadBgm());
}
