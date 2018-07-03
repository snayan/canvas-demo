/* 光线投射法 */

import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import CollideCanvas from './canvas';

const moduleName = 'collide_02';

export default class Collide02 extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new CollideCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Collide02().render();
}
