/* render class */
import { Base64 } from 'js-base64';
import Canvas from '../canvas';
import { isSingleModule } from '../util';
import Github, { GitHubApiResult } from '../github';
import browser from '../browser';
import Prism from 'prismjs';
import styles from './index.scss';

abstract class CommonRender {
  public isSingleModule: boolean;
  public el: HTMLDivElement;
  public canvasContainer: HTMLDivElement;
  public codesContainer: HTMLDivElement;
  public moduleName: string;
  public github: Github;
  public canvasInstances: Canvas[];
  constructor(moduleName: string) {
    this.canvasInstances = [];
    this.moduleName = moduleName;
    this.el = document.createElement('div');
    this.canvasContainer = document.createElement('div');
    this.codesContainer = document.createElement('div');
    this.isSingleModule = isSingleModule(moduleName);
    this.github = new Github(moduleName);
    if (browser.mobile) {
      this.el.classList.add(styles.mobile);
    }
  }

  private loading() {
    let el = document.createElement('i');
    el.classList.add(styles.loading);
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }
  private renderCanvas() {
    let container = this.canvasContainer;
    let wrap = document.createElement('div');
    wrap.classList.add(styles.result);
    container.style.width = '100%';
    container.style.height = '100%';
    if (browser.mobile) {
      wrap.classList.add(styles.mobileResult);
    }
    wrap.appendChild(container);
    this.el.appendChild(wrap);
    setTimeout(() => {
      for (let canvas of this.canvasInstances) {
        canvas.render(container);
      }
    }, 0);
  }

  private async renderCode() {
    let container = this.codesContainer;
    let code = document.createElement('div');
    let nav = document.createElement('nav');
    let naves = [];
    let codes = [];
    let currentIndex = '0';
    try {
      let contents = await this.github.getCanvasFiles();
      for (let [index, { name, content }] of contents.entries()) {
        naves.push(`<span class='${index === 0 ? styles.activeTab : styles.otherTab}' data-index='${index}'>${name}</span>`);
        codes.push(
          `<div class='${index === 0 ? styles.activeSection : styles.otherSection}' data-index='${index}' ><pre class="language-typescript">${Prism.highlight(
            Base64.decode(content),
            Prism.languages.javascript,
            'typescript',
          )}</pre></div>`,
        );
      }
    } catch (e) {
      let msg = JSON.parse(e.message);
      codes.push(`<div class='${styles.error}'><h4 class='${styles.errorTitle}'>[${msg.status}]${msg.statusText}</h4><p class='${styles.errorTip}'>${msg.body}</p></div>`);
    }
    nav.addEventListener('click', (e: MouseEvent) => {
      let el = e.target as HTMLSpanElement;
      let index = el.dataset['index'];
      if (index === currentIndex) {
        return false;
      }
      let naves = nav.querySelectorAll('span');
      let preCodes = code.querySelector(`div[data-index='${currentIndex}']`);
      let currentCode = code.querySelector(`div[data-index='${index}']`);
      for (let el of naves) {
        el.className = el.dataset['index'] === index ? styles.activeTab : styles.otherTab;
      }
      preCodes.className = styles.otherSection;
      currentCode.className = styles.activeSection;
      currentIndex = index;
      return false;
    });
    nav.className = styles.codesTab;
    nav.innerHTML = naves.join('');
    container.appendChild(nav);
    code.className = styles.codesSection;
    code.innerHTML = codes.join('');
    container.appendChild(code);
    container.className = styles.codes;
    this.el.appendChild(container);
  }

  public async render() {
    let removeLoading = this.loading();
    document.body.insertBefore(this.el, document.body.firstChild);
    if (this.isSingleModule) {
      this.el.classList.add(styles.single);
      browser.pc && (await this.renderCode());
    }
    this.renderCanvas();
    removeLoading();
    setTimeout(() => {
      this.el.classList.add(styles.loaded);
    }, 0);
    return this;
  }
}

export default CommonRender;
