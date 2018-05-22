import CommonRender from 'common/render';
import Canvas from 'common/canvas';
import { isSingleModule } from 'common/util';
import browser from 'common/browser';
import ShCanvas from './canvas';

const moduleName = 'sh';

export default class Sh extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new ShCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Sh().render();
}
