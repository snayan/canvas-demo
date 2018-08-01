/* 投影 */

export default class Projection {
  min: number;
  max: number;
  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }
  /* 投影是否重叠 */
  overlaps(p: Projection) {
    return this.max > p.min && p.max > this.min;
  }
}
