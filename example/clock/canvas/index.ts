import Canvas from 'common/canvas';
import { FONT } from 'common/CONSTANT';

class ClockCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  radius: number;
  centerRadius: number;
  marginBound: number;
  font: string;
  secondPointerLength: number;
  minutePointerLength: number;
  hourPointerLength: number;
  constructor() {
    super();
    this.ctx = this.getContext('2d');
  }
  /* 初始化变量 */
  private initVariable() {
    this.radius = Math.min(this.width, this.height) / 2 * 0.8;
    this.radius = Math.min(this.radius, 200);
    this.centerRadius = 10;
    this.marginBound = 20;
    this.font = FONT;
    this.secondPointerLength = this.radius - this.marginBound;
    this.minutePointerLength = this.secondPointerLength * 0.8;
    this.hourPointerLength = this.secondPointerLength * 0.6;
  }
  /* 初始化画布属性 */
  private setCtxAttribute() {
    let { ctx } = this;
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;
    ctx.font = this.font;
  }
  /* 画圆盘 */
  private drawDisc(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  /* 画刻度 */
  private drawScale(ctx: CanvasRenderingContext2D) {
    let angle;
    let radius = this.radius - this.marginBound;
    let scales = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0, l = scales.length; i < l; i++) {
      angle = Math.PI / 6 * (i - 2);
      ctx.fillText(scales[i], radius * Math.cos(angle), radius * Math.sin(angle));
    }
    ctx.restore();
  }
  /* 画圆心 */
  private drawCenterArc(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, this.centerRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  /* 画时针 */
  private drawHourPointer(ctx: CanvasRenderingContext2D, hour: number) {
    let angle = Math.PI / 6 * (hour - 3);
    this.drawPointer(ctx, angle, this.hourPointerLength);
  }
  /* 画分针 */
  private drawMinutePointer(ctx: CanvasRenderingContext2D, minute: number) {
    let angle = Math.PI / 30 * (minute - 15);
    ctx.save();
    ctx.fillStyle = '#4286f4';
    ctx.strokeStyle = '#4286f4';
    this.drawPointer(ctx, angle, this.minutePointerLength);
    ctx.restore();
  }
  /* 画秒针 */
  private drawSecondPointer(ctx: CanvasRenderingContext2D, second: number) {
    let angle = Math.PI / 30 * (second - 15);
    ctx.save();
    ctx.rotate(angle);
    ctx.lineWidth = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, this.centerRadius * 0.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#e01619';
    ctx.beginPath();
    ctx.arc(0, 0, this.centerRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a52729';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.secondPointerLength, 0);
    ctx.stroke();
    ctx.restore();
  }
  /* 画指针 */
  private drawPointer(ctx: CanvasRenderingContext2D, angle: number, length: number) {
    let radian = Math.PI * 45 / 180;
    let x = this.centerRadius * Math.cos(radian);
    let y = this.centerRadius * Math.sin(radian);
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(x, -y);
    ctx.lineTo(length, 0);
    ctx.lineTo(x, y);
    ctx.arc(0, 0, this.centerRadius, radian, Math.PI * 2 - radian);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  /* 开始 */
  private startClock() {
    let { ctx, width, height } = this;
    ctx.clearRect(-width / 2, -height / 2, width, height);
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    this.drawDisc(ctx);
    this.drawCenterArc(ctx);
    this.drawScale(ctx);
    this.drawHourPointer(ctx, hour);
    this.drawMinutePointer(ctx, minute);
    this.drawSecondPointer(ctx, second);
    window.requestAnimationFrame(this.startClock.bind(this));
  }
  /* 渲染 */
  public render(container: HTMLElement) {
    super.render(container);
    this.initVariable();
    this.setCtxAttribute(); //设置ctx的属性必须在设置canvas宽高之后设置，否则无效
    this.ctx.translate(this.width / 2, this.height / 2);
    this.startClock();
  }
}

export default ClockCanvas;
