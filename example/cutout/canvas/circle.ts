import Canvas from 'common/canvas';
import { FONT } from 'common/CONSTANT';
import browser from 'common/browser';

class Circle extends Canvas {
  private outRadius: number;
  private innerRadius: number;
  private arrowCount: number;
  private arrowLength: number;
  private canShowOutArrow: boolean;
  private canShowInnerArrow: boolean;
  private canShowLineArrow: boolean;
  private animateOutAngle: number;
  private animateInnerAngle: number;
  private fps: number;
  private lastFrameTime: number;
  private lastDrawFps: number;
  private lastDrawFpsTime: number;
  private animateStart: boolean;
  private animateEnd: boolean;
  private ctx: CanvasRenderingContext2D;
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.fps = 0;
    this.lastFrameTime = 0;
    this.lastDrawFps = 0;
    this.lastDrawFpsTime = 0;
    this.animateOutAngle = 0;
    this.animateInnerAngle = 0;
    this.arrowCount = 6;
    this.arrowLength = 10;
    this.canShowOutArrow = false;
    this.canShowInnerArrow = false;
    this.canShowLineArrow = false;
    this.animateEnd = true;
    this.animateStart = false;
  }

  /* 绘制"非零环绕法则" */
  drawText() {
    let text = '非零环绕法则';
    let { ctx, width, height } = this;
    ctx.save();
    ctx.font = FONT;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(100,140,230,1)`;
    let textWidth = ctx.measureText(text).width;
    ctx.translate(width / 2, height / 2);
    ctx.fillText(text, -textWidth / 2, 0);
    ctx.restore();
  }

  /* 绘制“非零环绕法则”规则示意图 */
  drawRule() {
    let { canShowOutArrow, canShowInnerArrow, canShowLineArrow, fps, width } = this;
    if (canShowOutArrow) {
      if (fps && this.animateOutAngle < Math.PI * 2) {
        this.animateOutAngle += Math.PI * 2 / fps;
      }
      this.animateOutAngle = Math.min(Math.PI * 2, this.animateOutAngle);
      if (this.animateOutAngle === Math.PI * 2) {
        this.canShowInnerArrow = true;
      }
      this.drawOutArrow();
    }
    if (canShowInnerArrow) {
      if (fps && this.animateInnerAngle < Math.PI * 2) {
        this.animateInnerAngle += Math.PI * 2 / fps;
      }
      this.animateInnerAngle = Math.min(Math.PI * 2, this.animateInnerAngle);
      if (this.animateInnerAngle === Math.PI * 2) {
        this.canShowLineArrow = true;
      }
      this.drawInnerArrow();
    }
    if (canShowLineArrow) {
      this.drawLineArrow();
      this.animateEnd = true;
    }
  }

  /* 画外圆箭头 */
  drawOutArrow() {
    let angel = Math.PI / 4;
    let { ctx, width, height, outRadius, arrowLength, arrowCount, animateOutAngle } = this;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, outRadius, 0, animateOutAngle, false);
    for (let i = 1; i <= arrowCount; i++) {
      ctx.rotate(2 * Math.PI / arrowCount);
      ctx.moveTo(outRadius, 0);
      ctx.lineTo(outRadius - arrowLength * Math.cos(angel), -arrowLength * Math.sin(angel));
      ctx.moveTo(outRadius, 0);
      ctx.lineTo(outRadius + arrowLength * Math.cos(angel), -arrowLength * Math.sin(angel));
    }
    ctx.stroke();
    ctx.restore();
  }

  /* 画内圆箭头 */
  drawInnerArrow() {
    let angel = Math.PI / 4;
    let { ctx, width, height, innerRadius, arrowLength, arrowCount, animateInnerAngle } = this;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.strokeStyle = '#CD00CD';
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, -animateInnerAngle, true);
    for (let i = 1; i <= arrowCount; i++) {
      ctx.rotate(2 * Math.PI / arrowCount);
      ctx.moveTo(innerRadius, 0);
      ctx.lineTo(innerRadius - arrowLength * Math.cos(angel), arrowLength * Math.sin(angel));
      ctx.moveTo(innerRadius, 0);
      ctx.lineTo(innerRadius + arrowLength * Math.cos(angel), arrowLength * Math.sin(angel));
    }
    ctx.stroke();
    ctx.restore();
  }

  /* 画直线箭头 */
  drawLineArrow() {
    let angel = Math.PI / 4;
    let { ctx, width, height, outRadius, arrowLength } = this;
    let lineLength = outRadius + (browser.pc ? 60 : 30);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.strokeStyle = 'green';
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(lineLength, 0);
    ctx.lineTo(lineLength - arrowLength * Math.cos(angel), -arrowLength * Math.sin(angel));
    ctx.moveTo(lineLength, 0);
    ctx.lineTo(lineLength - arrowLength * Math.cos(angel), arrowLength * Math.sin(angel));
    ctx.stroke();
    ctx.restore();
  }

  /* 绘制圆状体 */
  drawCircle() {
    let { ctx, width, height, outRadius, innerRadius } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(100,140,230,0.5)';
    ctx.strokeStyle = 'rgba(100,140,230,1)';
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.arc(0, 0, outRadius, 0, Math.PI * 2, false);
    ctx.moveTo(innerRadius, 0);
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true);
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowOffsetX = (outRadius - innerRadius) * 0.2;
    ctx.shadowOffsetY = ctx.shadowOffsetX;
    ctx.shadowBlur = (outRadius - innerRadius) * 0.3;
    ctx.fill();
    ctx.shadowColor = undefined;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.restore();
  }

  /* 绘制FPS数值 */
  drawFps() {
    let { ctx, width, height, fps, lastDrawFps, lastDrawFpsTime } = this;
    let now = Date.now();
    if (now - lastDrawFpsTime >= 100) {
      this.lastDrawFps = fps;
      this.lastDrawFpsTime = now;
    }
    ctx.save();
    ctx.font = FONT;
    let textHeight = ctx.measureText('M').width;
    ctx.fillText('FPS：' + lastDrawFps, 10, textHeight + 10);
    ctx.restore();
  }

  /* 动画显示“非零环绕法则” */
  drawAnimateRule() {
    this.animateStart = true;
    this.animateEnd = false;
    window.requestAnimationFrame(this.draw.bind(this));
  }

  /* 绘制 */
  draw(time: number) {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawCircle();
    this.drawText();
    this.drawFps();
    if (this.animateStart) {
      this.computeFps(time);
      this.canShowOutArrow = true;
      this.drawRule();
      if (!this.animateEnd) {
        window.requestAnimationFrame(this.draw.bind(this));
      }
    }
  }

  /* 计算当前fps */
  computeFps(time) {
    let { lastFrameTime } = this;
    if (lastFrameTime && time) {
      this.fps = Math.floor(1000 / (time - lastFrameTime));
    }
    this.lastFrameTime = time;
  }

  render(container: HTMLElement) {
    super.render(container);
    let { ctx, width, height } = this;
    let min = Math.min(width, height);
    this.outRadius = 0.8 * min / 2;
    this.innerRadius = this.outRadius * 0.6;
    this.draw(performance.now());
    setTimeout(this.drawAnimateRule.bind(this), 300);
  }
}

export default Circle;
