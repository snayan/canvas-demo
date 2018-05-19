import { WIDTH, HEIGHT } from './CONSTANT';

abstract class Canvas {
  readonly el: HTMLCanvasElement;
  public width: number;
  public height: number;
  public container: HTMLElement;
  constructor() {
    this.el = document.createElement('canvas');
  }
  public initCanvasSize(width, height) {
    this.el.width = width;
    this.el.height = height;
    this.width = width;
    this.height = height;
  }
  public getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes) {
    return this.el.getContext(contextId, contextAttributes);
  }
  public render(container: HTMLElement, className?: string) {
    this.container = container;
    this.container.classList.add(className);
    let { width, height } = container.getBoundingClientRect();
    this.initCanvasSize(width || WIDTH, height || HEIGHT);
  }
}

export default Canvas;
