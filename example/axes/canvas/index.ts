import Canvas from 'common/canvas';
import Grid from './grid';
import Axes from './axes';

class AxesCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  grid: Grid;
  axes: Axes;
  constructor() {
    super();
    this.ctx = this.getContext('2d');
  }
  initAxes() {
    let { width, height, ctx } = this;
  }
  render(container: HTMLElement) {
    super.render(container);
    this.grid = new Grid(this.ctx);
    this.axes = new Axes(this.ctx);
    this.grid.render();
    this.axes.render();
  }
}

export default AxesCanvas;
