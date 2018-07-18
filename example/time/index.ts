import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import LinearCanvas from './canvas/linear';
import EaseInCanvas from './canvas/ease_in';
import EaseOutCanvas from './canvas/ease_out';
import EaseInOutCanvas from './canvas/ease_in_out';

const moduleName = 'time';

export default class Time extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new LinearCanvas());
    this.canvasInstances.push(new EaseInCanvas());
    this.canvasInstances.push(new EaseOutCanvas());
    this.canvasInstances.push(new EaseInOutCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Time().render();
}
