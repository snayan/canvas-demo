import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import CircleCanvas from './canvas/circle';
import ShapeCanvas from './canvas/shape';

const moduleName = 'cutout';

export default class Cutout extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new CircleCanvas());
    this.canvasInstances.push(new ShapeCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Cutout().render();
}
