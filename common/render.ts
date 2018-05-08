/* render class */

import Canvas from './canvas';
import { isSignleModule } from './util';

class CommonRender {
  public isSignleModule: boolean;
  public canvas: Canvas;
  public el: HTMLDivElement;
  public demo: string;
  constructor(demo: string) {
    this.demo = demo;
    this.el = document.createElement('div');
    this.isSignleModule = isSignleModule(demo);
    this.render();
  }
  private renderToHtml() {
    if (this.isSignleModule) {
      this.el.classList.add('signle');
    }
    this.el.classList.add(this.demo);
    this.el.appendChild(this.canvas.el);
    document.body.appendChild(this.el);
  }
  public aloneRender() {}
  public collectRender() {}
  public render() {
    this.renderToHtml();
    return isSignleModule ? this.aloneRender() : this.collectRender();
  }
}

export default CommonRender;
