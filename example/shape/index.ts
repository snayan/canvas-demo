import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import ShapeCanvas from './canvas/shape';

const moduleName = 'shape';

export default class Shape extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new ShapeCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Shape().render();
}
