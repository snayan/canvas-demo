/* 文字 */

class Word {
  x: number;
  y: number;
  alpha: number;
  value: string;
  gray: number;
  count: number;
  constructor(value, x, y, alpha) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.alpha = alpha;
    this.gray = 0.98;
    this.count = 0;
  }
  public drop(x, y) {
    this.x += x;
    this.y += y + this.gray * this.count;
    this.count += 1 / 60;
    // this.alpha -= 0.1;
  }
}

export default Word;
