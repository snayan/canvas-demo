abstract class Canvas {
  readonly el: HTMLCanvasElement;
  public abstract width: number;
  public abstract height: number;
  constructor() {
    this.el = document.createElement('canvas');
  }
  public getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes) {
    return this.el.getContext(contextId, contextAttributes);
  }
  public initCanvasSize() {
    this.el.width = this.width;
    this.el.height = this.height;
  }
  public abstract render(): void;
}

export default Canvas;
