import Canvas from 'common/canvas';

class ButtonCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  btnWidth: number;
  btnHeight: number;
  btnLeft: number;
  btnTop: number;
  constructor(width, height) {
    super();
    this.ctx = this.getContext('2d');
    this.btnWidth = 160;
    this.btnHeight = 40;
    this.btnLeft = width / 2 - this.btnWidth / 2;
    this.btnTop = 0.75 * height;
    this.initCanvasSize(width, height);
    // this.initCanvasSize(this.btnWidth + this.shadowOffsetX * this.shadowBlur, this.btnHeight + this.shadowOffsetY * this.shadowBlur);
  }
  private clearShadow() {
    let { ctx } = this;
    ctx.shadowOffsetX = 0; // 阴影Y轴偏移
    ctx.shadowOffsetY = 0; // 阴影X轴偏移
    ctx.shadowBlur = 0; // 模糊尺寸
    ctx.shadowColor = null; // 颜色
  }
  /* 画按钮 */
  private drawBtn() {
    let { ctx, btnLeft, btnTop, btnWidth, btnHeight } = this;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowOffsetX = 3; // 阴影Y轴偏移
    ctx.shadowOffsetY = 3; // 阴影X轴偏移
    ctx.shadowBlur = 4; // 模糊尺寸
    ctx.shadowColor = '#cea3a3'; // 颜色
    ctx.fillRect(btnLeft, btnTop, btnWidth, btnHeight);
    ctx.restore();
    ctx.save();
    ctx.font = `18px sans-serif`;
    ctx.fillStyle = '#916c2b';
    let height = ctx.measureText('M').width;
    this.letterSpacingText('接受道歉', btnTop + btnHeight / 2 + height / 2, 6);
    ctx.restore();
  }
  /* 写字 */
  private drawText() {
    let { ctx, width, height } = this;
    ctx.save();
    ctx.font = `18px sans-serif`;
    ctx.fillStyle = '#ffffff';
    let drawHeight = 0.3 * height;
    this.letterSpacingText('小猪猪', drawHeight, 30);
    this.letterSpacingText('对不起', drawHeight + 60, 10);
    this.letterSpacingText('不要生气', drawHeight + 120, 10);
    ctx.restore();
  }
  private letterSpacingText(text, y, letterSpacing) {
    let { ctx, width } = this;
    let arrText = text.split('');
    let originWidth = ctx.measureText(text).width;
    let actualWidth = originWidth + letterSpacing * (arrText.length - 1);
    let x = width / 2 - actualWidth / 2;
    // 开始逐字绘制
    arrText.forEach((letter) => {
      let letterWidth = ctx.measureText(letter).width;
      ctx.fillText(letter, x, y);
      x = x + letterWidth + letterSpacing;
    });
  }
  public destroy() {
    this.el.remove();
  }
  /* 渲染 */
  public render() {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawText();
    this.drawBtn();
    return this;
  }
}

export default ButtonCanvas;
