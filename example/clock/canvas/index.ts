import Canvas from 'common/canvas';

class ClockCanvas extends Canvas {
  el: HTMLCanvasElement;
  constructor() {
    super();
    this.el = document.createElement('canvas');
  }
  getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes) {
    return this.el.getContext(contextId, contextAttributes);
  }
}

export default ClockCanvas;
