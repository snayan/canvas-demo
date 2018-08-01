/* 分轴离定理
  适用于圆和凸多边形
*/

import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import CollideCanvas from './canvas';

const moduleName = 'collide_03';

export default class Collide03 extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new CollideCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Collide03().render();
}
