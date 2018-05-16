/* render class */
import { Base64 } from 'js-base64';
import Canvas from '../canvas';
import { isSingleModule } from '../util';
import Github, { GitHubApiResult } from '../github';
import Prism from 'prismjs';
import styles from './index.scss';

abstract class CommonRender {
  public isSingleModule: boolean;
  public el: HTMLDivElement;
  public moduleName: string;
  public github: Github;
  public abstract canvas: Canvas;
  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.el = document.createElement('div');
    this.isSingleModule = isSingleModule(moduleName);
    this.github = new Github(moduleName);
  }

  private loading() {
    let el = document.createElement('i');
    el.className = styles.loading;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
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
    let naves = [];
    let codes = [];
    for (let { name, content } of contents) {
      naves.push(`<span>${name}</span>`);
      codes.push(`<div><pre class="language-typescript">${Prism.highlight(Base64.decode(content), Prism.languages.javascript, 'typescript')}</pre></div>`);
    }
    nav.className = styles.codesTab;
    nav.innerHTML = naves.join('');
    code.className = styles.codesSection;
    code.innerHTML = codes.join('');
    container.className = styles.codes;
    container.appendChild(nav);
    container.appendChild(code);
    this.el.appendChild(container);
  }

  public async render() {
    let removeLoading = this.loading();
    this.isSingleModule && (await this.renderCode());
    this.renderCanvas();
    this.el.className = styles.single;
    setTimeout(() => {
      this.el.classList.add(styles.loaded);
    }, 0);
    document.body.insertBefore(this.el, document.body.firstChild);
    removeLoading();
    return this;
  }
}

export default CommonRender;
