import CommonRender from 'common/render';
import { isSingleModule } from 'common/util';
import AnimateCanvas from './canvas/animateCanvas';

const moduleName = 'animate';

export default class Time extends CommonRender {
  constructor() {
    super(moduleName);
    let duration = 3000;
    this.canvasInstances.push(new AnimateCanvas(duration, 'linear'));
    this.canvasInstances.push(new AnimateCanvas(duration, 'easeIn'));
    this.canvasInstances.push(new AnimateCanvas(duration, 'easeOut'));
    this.canvasInstances.push(new AnimateCanvas(duration, 'easeInOut'));
  }
  public createButton() {
    let btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.left = '50%';
    btn.style.top = '10px';
    btn.style.width = 80 + 'px';
    btn.style.height = 30 + 'px';
    btn.style.textAlign = 'center';
    btn.style.border = 'none';
    btn.style.background = 'green';
    btn.style.color = 'white';
    btn.style.borderRadius = '10px';
    btn.style.transform = 'translateX(-50%)';
    btn.style.zIndex = '3';
    btn.innerText = 'start';
    (this.el.lastChild as HTMLElement).style.position = 'relative';
    this.el.lastChild.appendChild(btn);
    btn.addEventListener(
      'click',
      () => {
        setTimeout(() => {
          this.canvasInstances.forEach((instance: AnimateCanvas) => {
            if (instance.checked) {
              instance.reset();
              instance.start();
            }
          });
        });
      },
      false,
    );
  }
}

if (isSingleModule(moduleName)) {
  let time = new Time();
  time.render().then(() => time.createButton());
}
