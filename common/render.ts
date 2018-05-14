/* render class */

import Canvas from './canvas';
import { isSignleModule } from './util';
import Github, { GitHubApiResult } from './github';

abstract class CommonRender {
  public isSignleModule: boolean;
  public el: HTMLDivElement;
  public moduleName: string;
  public github: Github;
  public abstract canvas: Canvas;
  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.el = document.createElement('div');
    this.isSignleModule = isSignleModule(moduleName);
    this.github = new Github(moduleName);
  }

  private renderCanvas() {
    let container = document.createElement('div');
    this.canvas.render();
    container.appendChild(this.canvas.el);
    this.el.appendChild(container);
  }

  private async renderCode() {
    let contents = await this.github.getCanvasFiles();
    let container = document.createElement('div');
    let nav = document.createElement('nav');
    let code = document.createElement('div');
    let navs = [];
    let codes = [];
    for (let { name, content } of contents) {
      navs.push(`<span>${name}</span>`);
      codes.push(`<div>${window.atob(content)}</div>`);
    }
    nav.innerHTML = navs.join('');
    code.innerHTML = codes.join('');
    container.appendChild(nav);
    container.appendChild(code);
    this.el.appendChild(container);
  }

  public async render() {
    isSignleModule && (await this.renderCode());
    this.renderCanvas();
    this.el.className = ` signle ${this.moduleName}`;
    document.body.appendChild(this.el);
    return this;
  }
}

export default CommonRender;
