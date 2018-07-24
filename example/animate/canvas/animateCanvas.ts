import Canvas from 'common/canvas';
import TimeSysTem, { TimingFunc } from './timeSystem';
import Ball from './ball';

export default class AnimateCanvas extends Canvas {
  public time: TimeSysTem;
  public ball: Ball;
  public ctx: CanvasRenderingContext2D;
  public padding: number;
  public timeType: string;
  public checked: boolean;
  constructor(duration: number, timeType: string) {
    super();
    this.time = new TimeSysTem(duration, this.mapTimingFunc(timeType));
    this.ctx = this.getContext('2d');
    this.padding = 30;
    this.timeType = timeType;
    this.checked = false;
  }

  private mapTimingFunc(timeType: string) {
    switch (timeType) {
      case 'easeIn':
        return TimeSysTem.easeIn();
      case 'easeOut':
        return TimeSysTem.easeOut();
      case 'easeInOut':
        return TimeSysTem.easeInOut();
      default:
        return TimeSysTem.linear();
    }
  }

  /* 绘制小球 */
  private drawBall() {
    let { ctx } = this;
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'red';
    this.ball.render(this.ctx);
  }

  /* 绘制平台 */
  private drawPlatform() {
    let { width, height, padding, ctx } = this;
    let distance = width - padding * 2;
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
  }

  /* 创建小球  */
  private createBall() {
    let { width, height, padding, ctx } = this;
    let ballRadius = 20;
    this.ball = new Ball(this.padding, height - padding - ballRadius - ctx.lineWidth * 2, ballRadius);
    this.ball.addBehavior([Ball.rotate, Ball.move]);
    this.ball.setMoveSpeed((width - padding * 2) / this.time.duration);
  }

  /* 创建按钮 */
  private createCheckBtn() {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.right = this.padding * 2 + 'px';
    div.style.bottom = this.height / 4 + 'px';
    div.style.width = 120 + 'px';
    div.style.height = 60 + 'px';
    div.style.textAlign = 'right';
    let check = document.createElement('input');
    check.type = 'checkbox';
    check.value = this.timeType;
    let label = document.createElement('label');
    label.innerText = this.timeType;
    div.appendChild(check);
    div.appendChild(label);
    this.el.parentElement.style.position = 'relative';
    this.el.parentElement.appendChild(div);
    check.addEventListener(
      'change',
      (e) => {
        this.checked = (e.target as HTMLInputElement).checked;
      },
      false,
    );
  }

  /* 设置 */
  public setTimingFunc(timingFunc: TimingFunc) {
    if (!(this.time instanceof TimeSysTem)) {
      throw new Error('please create Time instance before invoke setTimingFunc');
    }
    this.time.timeFunc = timingFunc;
  }

  /* 开始 */
  public start() {
    if (!this.time.isRunning) {
      this.time.start();
    }
    this.animate();
  }

  /* 停止 */
  public stop() {
    this.time.stop();
  }

  /* 重置 */
  public reset() {
    this.time.stop();
    this.ball.reset();
  }

  /* 绘制 */
  public draw() {
    let { width, height, ctx } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawPlatform();
    this.drawBall();
  }

  public animate() {
    if (!this.time.isOver()) {
      this.ball.update(this.time.getElapsedTime());
      this.draw();
      window.requestAnimationFrame(this.animate.bind(this));
    }
  }

  /* 绘制 */
  public render(container: HTMLElement) {
    super.render(container);
    let { width, height, padding, ctx } = this;
    if (width - padding * 2 < 100) {
      this.padding = 0;
    }
    if (height < padding) {
      this.padding = 0;
    }
    this.createCheckBtn();
    this.createBall();
    this.draw();
  }
}
