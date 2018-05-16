import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import ClockCanvas from './canvas';

const moduleName = 'clock';

export default class Clock extends CommonRender {
  canvas: ClockCanvas;
  constructor() {
    super(moduleName);
    this.canvas = new ClockCanvas();
  }
}

if (isSingleModule(moduleName)) {
  new Clock().render();
}
