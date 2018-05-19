import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import ClockCanvas from './canvas';

const moduleName = 'clock';

export default class Clock extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvas.push(new ClockCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Clock().render();
}
