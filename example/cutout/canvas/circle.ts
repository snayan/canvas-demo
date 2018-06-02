import Canvas from 'common/canvas';
import { FONT } from 'common/CONSTANT';

class Circle extends Canvas {
  private outRadius: number;
  private innerRadius: number;
  private strokeStyle: string;
  private fillStyle: string;
  private ctx: CanvasRenderingContext2D;
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.strokeStyle = '#FF6347';
    this.fillStyle = 'rgba(100,140,230,0.5)';
  }
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
  drawRule() {
    let arrowLength = 10;
    let arrowCount = 6;
    let angel = Math.PI / 4;
    let { ctx, width, height, outRadius, innerRadius } = this;
    ctx.save();
    ctx.translate(width / 2, height / 2);

    /* 画外圆箭头 */
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, outRadius, 0, Math.PI * 2, false);
    for (let i = 1; i <= arrowCount; i++) {
      ctx.rotate(2 * Math.PI / arrowCount);
      ctx.moveTo(outRadius, 0);
      ctx.lineTo(outRadius - arrowLength * Math.cos(angel), -arrowLength * Math.sin(angel));
      ctx.moveTo(outRadius, 0);
      ctx.lineTo(outRadius + arrowLength * Math.cos(angel), -arrowLength * Math.sin(angel));
    }
    ctx.stroke();
    ctx.restore();

    /* 画内圆箭头 */
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.strokeStyle = 'orange';
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true);
    for (let i = 1; i <= arrowCount; i++) {
      ctx.rotate(2 * Math.PI / arrowCount);
      ctx.moveTo(innerRadius, 0);
      ctx.lineTo(innerRadius - arrowLength * Math.cos(angel), arrowLength * Math.sin(angel));
      ctx.moveTo(innerRadius, 0);
      ctx.lineTo(innerRadius + arrowLength * Math.cos(angel), arrowLength * Math.sin(angel));
    }
    ctx.stroke();
    ctx.restore();

    /* 画直线箭头 */
    ctx.strokeStyle = 'green';
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width / 2, 0);
    ctx.lineTo(width / 2 - arrowLength * Math.cos(angel), -arrowLength * Math.sin(angel));
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2 - arrowLength * Math.cos(angel), arrowLength * Math.sin(angel));
    ctx.stroke();

    ctx.restore();
  }
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
  render(container: HTMLElement) {
    super.render(container);
    let { ctx, width, height } = this;
    let min = Math.min(width, height);
    this.outRadius = 0.8 * min / 2;
    this.innerRadius = this.outRadius * 0.6;
    ctx.clearRect(0, 0, width, height);
    this.drawCircle();
    this.drawText();
    this.drawRule();
  }
}

export default Circle;
