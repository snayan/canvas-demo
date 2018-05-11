import CommonRender from 'common/render';
import { isSignleModule } from 'common/util';
import ClockCanvas from './canvas';

const moduleName = 'clock';

export default class Clock extends CommonRender {
  canvas: ClockCanvas;
  constructor() {
    super(moduleName);
    this.canvas = new ClockCanvas();
  }
}

if (isSignleModule(moduleName)) {
  new Clock().render();
}
