import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import EditorCanvas from './canvas/editor';

const moduleName = 'editor';

class Editor extends CommonRender {
  constructor() {
    super(moduleName);
    this.canvasInstances.push(new EditorCanvas());
  }
}

if (isSingleModule(moduleName)) {
  new Editor().render();
}

export default Editor;
