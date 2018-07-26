import Canvas from 'common/canvas';
import Ball from './ball';

export default class FreeFallCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  ball: Ball;
  padding: number;
  lastFrameTime: number;
  fps: number;
  lastCalculateFpsTime: number;
  isStart: boolean;
  radius: number;
  timer: number;
  speed: number; //初始速度,单位为：m/s
  distance: number; //小球距离地面高度,单位为米
  pixelPerMiter: number; //每米对应多少像素
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.padding = 80;
    this.radius = 20;
    this.isStart = false;
  }

  /* 初始化 */
  private init() {
    this.fps = 0;
    this.lastFrameTime = 0;
    this.speed = 5; // 设置小球初速速度为:5m/s
    this.distance = 50; //设置小球距离地面高度为:50m
    let pixel = this.height - this.padding * 2;
    if (this.distance <= 0) {
      this.pixelPerMiter = 0;
    } else {
      this.pixelPerMiter = (this.height - this.padding * 2) / this.distance;
    }
  }

  /* 创建小球 */
  private createBall() {
    let { width, height, padding, speed, radius, pixelPerMiter, distance } = this;
    this.ball = new Ball(width / 2, padding - radius, radius, { verticalHeight: distance, pixelPerMiter, useGravity: true, useRebound: true });
    this.ball.setSpeed(speed);
    this.ball.addBehavior(Ball.move);
  }

  /* 创建开始按钮 */
  private createStartButton() {
    let { padding, radius } = this;
    let btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.right = radius * 2 * 1.4 + 'px';
    btn.style.top = padding - radius * 2 + 'px';
    btn.style.width = radius * 2 * 1.4 + 'px';
    btn.style.height = radius * 2 + 'px';
    btn.style.textAlign = 'center';
    btn.style.border = 'none';
    btn.style.background = 'green';
    btn.style.color = 'white';
    btn.style.borderRadius = '6px';
    btn.style.zIndex = '3';
    btn.innerText = 'start';
    (this.el.parentElement as HTMLElement).style.position = 'relative';
    this.el.parentElement.appendChild(btn);
    btn.addEventListener('click', this.start.bind(this), false);
  }

  /* 计算Fps */
  private calculateFps(frame) {
    let { fps, lastFrameTime, lastCalculateFpsTime } = this;
    if (lastFrameTime && (fps === 0 || frame - lastCalculateFpsTime > 1000)) {
      this.fps = 1000 / (frame - lastFrameTime);
      this.lastCalculateFpsTime = frame;
    }
  }

  /* 绘制 */
  private draw() {
    let { ctx, width, height, padding } = this;
    // 绘制地面
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    // 绘制小球
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'red';
    this.ball.render(ctx);
  }

  /* 更新 */
  private update() {
    if (this.fps) {
      this.ball.update(1000 / this.fps);
    }
  }

  /* 动画 */
  private animate(frame) {
    let { width, height, ctx } = this;
    ctx.clearRect(0, 0, width, height);
    this.calculateFps(frame);
    this.update();
    this.draw();
    this.lastFrameTime = frame;
    this.timer = window.requestAnimationFrame(this.animate.bind(this));
  }

  /* 开始下落 */
  public start() {
    window.cancelAnimationFrame(this.timer);
    this.isStart = true;
    this.ball.reset();
    this.animate(0);
  }

  /* 停止 */
  public stop() {
    this.isStart = false;
  }

  /* 渲染 */
  public render(container: HTMLElement) {
    super.render(container);
    this.init();
    this.createBall();
    this.createStartButton();
    this.draw();
  }
}
