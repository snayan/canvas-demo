import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import AxesCanvas from './canvas';

const moduleName = 'axes';

export default class Axes extends CommonRender {
  canvasInstances: AxesCanvas[];
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new AxesCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Axes().render();
}
