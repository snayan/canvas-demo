/* render class */
import { Base64 } from 'js-base64';
import Canvas from '../canvas';
import { isSignleModule } from '../util';
import Github, { GitHubApiResult } from '../github';
import Prism from 'prismjs';
import styles from './index.scss';

console.log(styles);

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
    container.className = styles.result;
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
      codes.push(`<div><pre class="language-typescript">${Prism.highlight(Base64.decode(content), Prism.languages.javascript, 'typescript')}</pre></div>`);
    }
    nav.className = styles.codesTab;
    nav.innerHTML = navs.join('');
    code.className = styles.codesSection;
    code.innerHTML = codes.join('');
    container.className = styles.codes;
    container.appendChild(nav);
    container.appendChild(code);
    this.el.appendChild(container);
  }

  public async render() {
    isSignleModule && (await this.renderCode());
    this.renderCanvas();
    this.el.className = styles.single;
    document.body.insertBefore(this.el, document.body.firstChild);
    return this;
  }
}

export default CommonRender;
