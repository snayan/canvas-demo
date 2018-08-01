/* 坐标系向量 */

import { distance } from 'common/util';

export default class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  /* 获取向量的长度 */
  getMagnitude() {
    return distance(0, 0, this.x, this.y);
  }

  /* 向量相加 */
  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /* 向量相减 */
  subtract(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /* 向量点积 */
  dotProduct(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }

  /* 返回当前向量的法向量 */
  perpendicular() {
    return new Vector(this.y, -this.x);
  }

  /* 单位向量 */
  normalize() {
    let d = this.getMagnitude();
    return d ? new Vector(this.x / d, this.y / d) : new Vector(0, 0);
  }
}
