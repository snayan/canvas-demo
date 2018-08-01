/* 分离抽判别法 */

import { distance } from 'common/util';
import Sprite, { Polygon, Circle } from './sprite';

export default class Collide {
  constructor() {
    if (this instanceof Collide) {
      return this;
    }
    return new Collide();
  }

  /* 检查是否满足判断碰撞的条件
    比如，可以过滤掉不可见sprite，或者在当前帧下根本就不会发送碰撞，
    常用手法：空间分割法
  */
  public isCandidateForCollide(sprite: Sprite, otherSprite: Sprite) {
    return sprite.visible && otherSprite.visible && sprite !== otherSprite;
  }

  /* 判断是否发生碰撞 */
  public didCollide(sprite: Sprite, otherSprite: Sprite) {
    if (sprite.type === 'circle' && otherSprite.type === 'circle') {
      // 圆和圆发生碰撞检测
      let x1 = (sprite as Circle).x;
      let y1 = (sprite as Circle).y;
      let r1 = (sprite as Circle).radius;
      let x2 = (otherSprite as Circle).x;
      let y2 = (otherSprite as Circle).y;
      let r2 = (otherSprite as Circle).radius;
      return distance(x1, y1, x2, y2) <= r1 + r2;
    }
    let axes1 = sprite.type === 'circle' ? (sprite as Circle).getAxes(otherSprite as Polygon) : (sprite as Polygon).getAxes();
    let axes2 = otherSprite.type === 'circle' ? (otherSprite as Circle).getAxes(sprite as Polygon) : (otherSprite as Polygon).getAxes();
    // 第一步：获取所有的投影轴
    // 第二步：获取多边形在各个投影轴的投影
    // 第三步：判断是否存在一条投影轴上，多边形的投影不相交，如果存在不相交的投影则直接返回false，如果有所的投影轴上的投影都存在相交，则说明相碰了。
    let axes = [...axes1, ...axes2];
    for (let axis of axes) {
      let projections1 = sprite.getProjection(axis);
      let projections2 = otherSprite.getProjection(axis);
      if (!projections1.overlaps(projections2)) {
        return false;
      }
    }
    return true;
  }
}
