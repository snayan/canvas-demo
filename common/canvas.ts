abstract class Canvas {
  abstract readonly el: HTMLCanvasElement;
  abstract getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D;
}

export default Canvas;
