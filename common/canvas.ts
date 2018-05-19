import { WIDTH, HEIGHT } from './CONSTANT';

abstract class Canvas {
  readonly el: HTMLCanvasElement;
  public width: number;
  public height: number;
  public container: HTMLElement;
  constructor() {
    this.el = document.createElement('canvas');
  }
  private initCanvasSize() {
    this.el.width = this.width;
    this.el.height = this.height;
  }
  public getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes) {
    return this.el.getContext(contextId, contextAttributes);
  }
  public render(container: HTMLElement, className?: string) {
    this.container = container;
    this.container.classList.add(className);
    let { width, height } = container.getBoundingClientRect();
    this.width = width || WIDTH;
    this.height = height || HEIGHT;
    this.initCanvasSize();
  }
}

export default Canvas;
