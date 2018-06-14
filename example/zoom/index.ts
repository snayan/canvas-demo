import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import ZoomCanvas from './canvas/zoom';

const moduleName = 'zoom';

export default class Zoom extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new ZoomCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Zoom().render();
}
