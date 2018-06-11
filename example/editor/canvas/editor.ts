import Canvas from 'common/canvas';
import browser from 'common/browser';
import { windowToCanvas } from 'common/util';
import Cursor from './cursor';

interface Line {
  left: number;
  bottom: number;
  width: number;
  height: number;
  words: string[];
}

interface WordPoint {
  lineNum: number;
  wordIndex: number;
}

class EditorCanvas extends Canvas {
  ctx: CanvasRenderingContext2D;
  cursor: Cursor;
  margin: number;
  lineHeight: number;
  lines: Line[];
  nextWord: WordPoint;
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
    this.nextWord = {
      lineNum: 0,
      wordIndex: 0,
    };
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

  /* 计算一个大致的字的宽度 */
  calculateWordWidth() {
    let { ctx } = this;
    let wordWidth = ctx.measureText('M').width;
    return wordWidth;
  }

  /* 计算字间距 */
  calculateLetterSpace() {
    let { ctx, lines } = this;
    let wordWidth = this.calculateWordWidth();
    let lineWidth = lines[0].width;
    let words = Math.floor(lineWidth / wordWidth);
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
  measureLineText(lineNum, wordIndex) {
    let { ctx, lines, letterSpace } = this;
    let line = lines[lineNum];
    let words = line.words;
    if (!words.length || wordIndex < 0) {
      return 0;
    }
    let wordsWidth = ctx.measureText(words.slice(0, wordIndex + 1).join('')).width;
    let spacesWidth = letterSpace * wordIndex;
    return wordsWidth + spacesWidth;
  }

  /* 找出下一个字的位置 */
  calculateNextWord(x, y) {
    let { ctx, lines, editorAreaLeft } = this;
    let num = this.findLineByPoint(x, y);
    let line = lines[num];
    if (line) {
      let wordsLen = line.words.length;
      let index = 0;
      let lineTextWidth = this.measureLineText(num, index);
      while (lineTextWidth < x - editorAreaLeft && index < wordsLen) {
        index += 1;
        lineTextWidth = this.measureLineText(num, index);
      }
      this.nextWord = {
        lineNum: num,
        wordIndex: index,
      };
    }
  }

  /* 移动下一个位置 */
  advanceNextWord() {
    let { nextWord, lines, editorAreaWidth, letterSpace } = this;
    let { lineNum, wordIndex } = nextWord;
    let line = lines[lineNum];
    let wordWidth = this.calculateWordWidth();
    let lineTextWidth = this.measureLineText(lineNum, wordIndex);
    if (lineTextWidth + wordWidth + letterSpace > editorAreaWidth) {
      lineNum += 1;
      wordIndex = 0;
    } else {
      wordIndex += 1;
    }
    this.nextWord = {
      lineNum,
      wordIndex,
    };
  }

  /* 由于中途添加了字，需重组文字 */
  reorganizeWords(lineNum: number) {
    let { lines, editorAreaWidth } = this;
    let overWords;
    for (let m = lineNum, n = lines.length; m < n; m++) {
      for (let i = 0, j = lines[m].words.length; i < j; i++) {
        if (this.measureLineText(m, i) > editorAreaWidth) {
          overWords = lines[m].words.slice(i);
          lines[m].words = lines[m].words.slice(0, i);
          if (m < n - 1) {
            lines[m + 1].words = [...overWords, ...lines[m + 1].words];
          }
        }
      }
    }
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

  /* 添加文字 */
  addWord(word: string) {
    let { ctx, lines, letterSpace, nextWord } = this;
    let { lineNum, wordIndex } = nextWord;
    let line = lines[lineNum];
    let words = line.words;
    wordIndex = Math.min(wordIndex, words.length);
    words.splice(wordIndex, 0, word);
    this.advanceNextWord();
    this.reorganizeWords(lineNum);
  }

  /* 删除文字 */
  removeWord() {
    let { nextWord, lines } = this;
    let { lineNum, wordIndex } = nextWord;
    if (wordIndex === 0) {
      if (lineNum !== 0 && lines[lineNum - 1].words.length) {
        lineNum = lineNum - 1;
        wordIndex = lines[lineNum].words.length - 1;
      }
    } else {
      wordIndex = wordIndex - 1;
    }
    lines[lineNum].words.splice(wordIndex, 1);
    this.nextWord = { lineNum, wordIndex };
  }

  /* 绑定聚焦事件 */
  bindFocusEvent() {
    this.container.addEventListener(
      'click',
      (e) => {
        let { x, y } = windowToCanvas(this.el, e.x, e.y);
        if (this.isPointInEditor(x, y)) {
          this.focus = true;
          this.calculateNextWord(x, y);
          this.drawCursor();
        }
      },
      false,
    );
  }

  /* 绑定输入事件 */
  bindInputEvent() {
    window.addEventListener('keyup', (e) => {
      let { key } = e;
      let { ctx, focus, editorAreaWidth, letterSpace } = this;
      if (!focus) {
        return false;
      }
      if (e.keyCode === 8) {
        //delete key
        this.removeWord();
      } else {
        this.addWord(key);
      }
      this.draw();
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
    let lineTextWidth;
    for (let i = 0, j = lines.length; i < j; i++) {
      let { words, left, bottom } = lines[i];
      for (let m = 0, n = words.length; m < n; m++) {
        lineTextWidth = this.measureLineText(i, m - 1);
        if (m > 0) {
          lineTextWidth += letterSpace;
        }
        ctx.fillText(words[m], left + lineTextWidth, bottom);
      }
    }
  }

  /* 绘制光标 */
  drawCursor() {
    let { cursor, focus, nextWord, lines, letterSpace } = this;
    if (focus) {
      let { lineNum, wordIndex } = nextWord;
      let line = lines[lineNum];
      cursor.move(line.left + this.measureLineText(lineNum, wordIndex - 1), line.bottom);
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
    this.drawCursor();
    this.drawWords();
  }

  /* 绘制 */
  render(container: HTMLElement) {
    super.render(container);
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
  }
}

export default EditorCanvas;
