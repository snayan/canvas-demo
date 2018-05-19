import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import ShCanvas from './canvas';

const moduleName = 'sh';

export default class Sh extends CommonRender {
  canvas: ShCanvas;
  constructor() {
    super(moduleName);
    this.canvas = new ShCanvas();
  }
}

if (isSingleModule(moduleName)) {
  new Sh().render();
}
