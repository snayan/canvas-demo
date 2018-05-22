import Canvas from 'common/canvas';
import Word from './word';

class ApologizeCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  btnWidth: number;
  btnHeight: number;
  btnLeft: number;
  btnTop: number;
  startDrop: boolean;
  lines: Word[][];
  btnText: Word[];
  duration: number;
  isOut: boolean;
  gray: number;
  constructor(width, height) {
    super();
    this.ctx = this.getContext('2d');
    this.btnWidth = 160;
    this.btnHeight = 40;
    this.btnLeft = width / 2 - this.btnWidth / 2;
    this.btnTop = 0.75 * height;
    this.startDrop = false;
    this.lines = [];
    this.btnText = [];
    this.duration = 0;
    this.isOut = false;
    this.gray = 0.98;
    this.initCanvasSize(width, height);
    this.createTextLine();
    this.createBtnText();
  }
  /* 创建文字 */
  private createTextLine() {
    let { ctx, width, height } = this;
    let x;
    let y = 0.3 * height;
    let texts = [{ text: '小猪猪', space: 30, y }, { text: '对不起', space: 10, y: y + 60 }, { text: '不要生气', space: 10, y: y + 120 }];
    for (let [index, { text, space, y }] of texts.entries()) {
      this.lines[index] = [];
      let arrText = text.split('');
      let originWidth = ctx.measureText(text).width;
      let actualWidth = originWidth + space * (arrText.length - 1);
      x = width / 2 - actualWidth / 2;
      for (let letter of arrText) {
        let letterWidth = ctx.measureText(letter).width;
        this.lines[index].push(new Word(letter, x, y, 1));
        x = x + letterWidth + space;
      }
    }
  }
  /* 创建按钮 */
  private createBtnText() {
    let { ctx, btnTop, btnHeight, width } = this;
    let letterHeight = ctx.measureText('M').width;
    let x;
    let y = btnTop + btnHeight / 2 + letterHeight / 2;
    let space = 6;
    let text = '接受道歉';
    let arrText = text.split('');
    let originWidth = ctx.measureText(text).width;
    let actualWidth = originWidth + space * (arrText.length - 1);
    x = width / 2 - actualWidth / 2;
    for (let letter of arrText) {
      let letterWidth = ctx.measureText(letter).width;
      this.btnText.push(new Word(letter, x, y, 1));
      x = x + letterWidth + space;
    }
  }
  /* 画按钮 */
  private drawBtn() {
    let { ctx, btnLeft, btnTop, btnWidth, btnHeight, btnText, startDrop, duration, gray } = this;
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
    for (let letter of btnText) {
      if (startDrop) {
        letter.drop(-0.6, 1);
      }
      ctx.fillText(letter.value, letter.x, letter.y);
    }
    if (startDrop) {
      this.btnLeft -= 0.6;
      this.btnTop += 1 + gray * (duration / 60);
    }
    ctx.restore();
  }
  /* 写字 */
  private drawText() {
    let { ctx, width, height, lines, startDrop, duration } = this;
    ctx.save();
    ctx.font = `18px sans-serif`;
    ctx.fillStyle = '#ffffff';
    let index = Math.floor(duration / 20);
    let line: Word[];
    let letter: Word;
    for (let i = 0, j = lines.length; i < j; i++) {
      line = lines[i];
      for (let m = 0, n = line.length; m < n; m++) {
        letter = line[m];
        if (startDrop && m + i * j <= index) {
          letter.drop(-1, i * 0.2 + 1);
        }
        ctx.fillText(letter.value, letter.x, letter.y);
        this.isOut = i === j - 1 && m === n - 1 && (letter.x > width || letter.y > height);
      }
    }
    ctx.restore();
  }
  /* 开始下落 */
  public drop() {
    this.startDrop = true;
  }
  /* 渲染 */
  public render() {
    let { ctx, width, height, startDrop } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawText();
    this.drawBtn();
    if (startDrop) {
      this.duration += 1;
    }
    return this;
  }
}

export default ApologizeCanvas;
