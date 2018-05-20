import CommonRender from 'common/render';
import Canvas from 'common/canvas';
import { isSingleModule } from 'common/util';
import browser from 'common/browser';
import ShCanvas from './canvas';

const moduleName = 'sh';

export default class Sh extends CommonRender {
  canvas: Canvas[];
  constructor() {
    super(moduleName);
    this.canvas.push(new ShCanvas());
  }

}

if (isSingleModule(moduleName)) {
  new Sh().render();
}
