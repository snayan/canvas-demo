import Canvas from 'common/canvas';
import browser from 'common/browser';
import { windowToCanvas } from 'common/util';
import Cursor from './cursor';
// import Word from './word';

interface Line {
  left: number;
  bottom: number;
  width: number;
  height: number;
  words: string[];
}

class EditorCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  cursor: Cursor;
  margin: number;
  lineHeight: number;
  lines: Line[];
  currentLine: number;
  fontSize: number;
  letterSpace: number;
  editorAreaWidth: number;
  editorAreaHeight: number;
  editorAreaLeft: number;
  editorAreaTop: number;
  focus: boolean;
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.letterSpace = 0;
    this.fontSize = browser.pc ? 24 : 16;
    this.lineHeight = this.fontSize * 2;
    this.margin = 20;
    this.lines = [];
    this.currentLine = -1;
    this.focus = false;
  }

  /* 计算行数据 */
  calculateLines() {
    let { lineHeight, editorAreaLeft, editorAreaTop, editorAreaWidth } = this;
    for (let i = 0, j = this.lines.length; i < j; i++) {
      this.lines[i] = {
        left: editorAreaLeft,
        bottom: editorAreaTop + lineHeight * (i + 1) + 0.5,
        width: editorAreaWidth,
        height: lineHeight,
        words: [],
      };
    }
  }

  /* 计算字间距 */
  calculateLetterSpace() {
    let { ctx, lines } = this;
    let wordWidth = ctx.measureText('M').width;
    let lineWidth = lines[0].width;
    let words = Math.floor(lineWidth / (wordWidth + wordWidth / 2));
    this.letterSpace = (lineWidth - words * wordWidth) / (words - 1);
  }

  /* 计算编辑器可编辑区域 */
  calculateEditorArea() {
    let { margin, lineHeight, width, height } = this;
    let lines = Math.floor((height - margin * 2 - lineHeight) / lineHeight);
    this.lines.length = lines;
    this.editorAreaLeft = margin;
    this.editorAreaTop = margin + lineHeight;
    this.editorAreaWidth = width - margin * 2;
    this.editorAreaHeight = lines * lineHeight;
  }

  /* 判断当前坐标是否在编辑器内 */
  isPointInEditor(x, y) {
    let { ctx, margin, editorAreaLeft, editorAreaTop, editorAreaWidth, editorAreaHeight } = this;
    ctx.rect(editorAreaLeft, editorAreaTop - 0.5, editorAreaWidth, editorAreaHeight - 1);
    return ctx.isPointInPath(x, y);
  }

  /* 测量当前行已经使用的宽度 */
  measureLineText(num) {
    let { ctx, lines, letterSpace } = this;
    let line = lines[num];
    let words = line.words;
    let wordsNum = words.length;
    if (wordsNum === 0) {
      return 0;
    }
    let wordsWidth = ctx.measureText(words.join('')).width;
    let spacesWidth = letterSpace * (wordsNum - 1);
    return wordsWidth + spacesWidth;
  }

  /* 找出下一个字的位置 */
  findNextWord() {
    let { ctx, currentLine, lines, letterSpace, editorAreaLeft } = this;
    let line = lines[currentLine];
    let words = line.words;
    let wordsNum = words.length;
    let wordsWidth = ctx.measureText(words.join('')).width;
    let spacesWidth = letterSpace * wordsNum;
    return {
      left: editorAreaLeft + wordsWidth + spacesWidth,
      bottom: line.bottom - 1,
    };
  }

  /* 根据当前的坐标找出当前行 */
  findLineByPoint(x, y) {
    let { editorAreaTop } = this;
    if (!this.isPointInEditor(x, y)) {
      return -1;
    }
    let heightToEditor = y - editorAreaTop;
    let line = Math.floor(heightToEditor / this.lineHeight);
    return line;
  }

  /* 根据当前的坐标找出当前字的位置 */
  findCursorByLine(num) {
    let { ctx, lines, letterSpace, editorAreaLeft, editorAreaWidth } = this;
    let line = lines[num];
    if (line) {
      let words = line.words;
      let wordsNum = words.length;
      let wordsWidth = ctx.measureText(words.join('')).width;
      let spacesWidth = letterSpace * wordsNum;
      return {
        left: editorAreaLeft + wordsWidth + spacesWidth,
        bottom: line.bottom - 1,
      };
    }
    return null;
  }

  /* 绑定聚焦事件 */
  bindFocusEvent() {
    this.container.addEventListener(
      'click',
      (e) => {
        let { x, y } = windowToCanvas(this.el, e.x, e.y);
        let line = this.findLineByPoint(x, y);
        if (this.currentLine === line) {
          return false;
        }
        let cursor = this.findCursorByLine(line);
        if (cursor) {
          this.cursor.move(cursor.left, cursor.bottom);
          this.currentLine = line;
          this.focus = true;
        }
        return true;
      },
      false,
    );
  }

  /* 绑定输入事件 */
  bindInputEvent() {
    this.container.addEventListener('keyup', (e) => {
      let { key } = e;
      let { ctx, focus, editorAreaWidth, letterSpace } = this;
      if (!focus) {
        return false;
      }
      let wordWidth = ctx.measureText(key).width;
      while (this.measureLineText(this.currentLine) + wordWidth + letterSpace > editorAreaWidth) {
        this.currentLine += 1;
        if (this.currentLine >= this.lines.length) {
          return false;
        }
      }
      let nextWord = this.findNextWord();
      this.cursor.move(nextWord.left + wordWidth + 2, nextWord.bottom);
      ctx.fillText(key, nextWord.left, nextWord.bottom);
      this.lines[this.currentLine].words.push(key);
      return true;
    });
  }

  /* 绘制纸 */
  drawPaper() {
    let { ctx, lines, lineHeight } = this;
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    let topLine = lines[0];
    if (topLine) {
      ctx.moveTo(topLine.left, topLine.bottom - lineHeight);
      ctx.lineTo(topLine.left + topLine.width, topLine.bottom - lineHeight);
    }
    for (let { left, bottom, width, height } of lines) {
      ctx.moveTo(left, bottom);
      ctx.lineTo(left + width, bottom);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* 绘制日期头 */
  drawDateHeader() {
    let { ctx, lines, lineHeight } = this;
    let topLine = lines[0];
    ctx.save();
    ctx.fillStyle = '#666';
    if (topLine) {
      let now = new Date();
      let header = 'DATE：' + now.getFullYear() + ' - ' + ('0' + (now.getMonth() + 1)).slice(-2) + ' - ' + ('0' + now.getDate()).slice(-2);
      let textWidth = ctx.measureText(header).width;
      ctx.fillText(header, topLine.left + topLine.width - textWidth - 10, topLine.bottom - lineHeight - 10);
    }
    ctx.restore();
  }

  /* 绘制文字 */
  drawWords() {
    let { ctx, lines, letterSpace } = this;
    for (let { left, bottom, height, words, width } of lines) {
      for (let word of words) {
        console.log(word);
      }
    }
  }

  /* 清空画布  */
  erase() {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
  }

  /* 绘制 */
  draw() {
    let { ctx } = this;
    this.erase();
    this.drawPaper();
    this.drawDateHeader();
    this.drawWords();
  }

  /* 绘制 */
  render(container: HTMLElement) {
    super.render(container);
    container.contentEditable = 'true';
    this.ctx.font = `${this.fontSize}px sans-serif`;
    this.ctx.lineWidth = 0.5;
    this.ctx.textBaseline = 'bottom';
    this.cursor = new Cursor(this.ctx);
    this.calculateEditorArea();
    this.calculateLines();
    this.calculateLetterSpace();
    this.bindFocusEvent();
    this.bindInputEvent();
    this.draw();
    console.log(this);
  }
}

export default EditorCanvas;
