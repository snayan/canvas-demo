/* render class */

import Canvas from './canvas';
import { isSignleModule } from './util';

abstract class CommonRender {
  public isSignleModule: boolean;
  public el: HTMLDivElement;
  public moduleName: string;
  public abstract canvas: Canvas;
  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.el = document.createElement('div');
    this.isSignleModule = isSignleModule(moduleName);
  }
  private renderToHtml() {
    if (this.isSignleModule) {
      this.el.classList.add('signle');
    }
    this.el.classList.add(this.moduleName);
    this.el.appendChild(this.canvas.el);
    document.body.appendChild(this.el);
    this.canvas.render();
  }
  public aloneRender() {}
  public collectRender() {}
  public render() {
    this.renderToHtml();
    return isSignleModule ? this.aloneRender() : this.collectRender();
  }
}

export default CommonRender;
