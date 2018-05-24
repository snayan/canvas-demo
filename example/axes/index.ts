import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';

const moduleName = 'axes';

class Axes extends CommonRender {
  constructor() {
    super(moduleName);
  }
}

if (isSingleModule(moduleName)) {
  new Axes().render();
}
