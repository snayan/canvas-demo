/* 分轴离定理 */

import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import CollideCanvas from './canvas';

const moduleName = 'collide_03';

export default class Collide01 extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new CollideCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Collide01().render();
}
