import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import FreeFallCanvas from './canvas/freeFall';

const moduleName = 'free_fall';

export default class FreeFall extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new FreeFallCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new FreeFall().render();
}
