import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import CircleCanvas from './canvas/circle';

const moduleName = 'cutout';

export default class Cutout extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new CircleCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Cutout().render();
}
