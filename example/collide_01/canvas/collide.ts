/* 外接图形判别法 */

import { distance } from 'common/util';
import Sprite, { RectSprite, CircleSprite } from './sprite';

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
    let sType = sprite.type;
    let oType = otherSprite.type;
    if (sType === 'rect' && oType === 'rect') {
      return this.didRectCollide(sprite as RectSprite, otherSprite as RectSprite);
    } else if (sType === 'circle' && oType === 'circle') {
      return this.didCircleCollide(sprite as CircleSprite, otherSprite as CircleSprite);
    } else if (sType === 'rect') {
      return this.didRectWidthCircleCollide(sprite as RectSprite, otherSprite as CircleSprite);
    } else {
      return this.didRectWidthCircleCollide(otherSprite as RectSprite, sprite as CircleSprite);
    }
  }

  /* 判断是否两个矩形发生碰撞 */
  private didRectCollide(sprite: RectSprite, otherSprite: RectSprite) {
    let horizontal = sprite.left + sprite.width > otherSprite.left && sprite.left < otherSprite.left + otherSprite.width;
    let vertical = sprite.top < otherSprite.top + otherSprite.height && sprite.top + sprite.height > otherSprite.top;
    return horizontal && vertical;
  }

  /* 判断是否两个圆发生碰撞 */
  private didCircleCollide(sprite: CircleSprite, otherSprite: CircleSprite) {
    return distance(sprite.x, sprite.y, otherSprite.x, otherSprite.y) < sprite.radius + otherSprite.radius;
  }

  /* 判断是否矩形和圆形发生碰撞 */
  private didRectWidthCircleCollide(rectSprite: RectSprite, circleSprite: CircleSprite) {
    let closePoint = { x: undefined, y: undefined };
    if (circleSprite.x < rectSprite.left) {
      closePoint.x = rectSprite.left;
    } else if (circleSprite.x < rectSprite.left + rectSprite.width) {
      closePoint.x = circleSprite.x;
    } else {
      closePoint.x = rectSprite.left + rectSprite.width;
    }
    if (circleSprite.y < rectSprite.top) {
      closePoint.y = rectSprite.top;
    } else if (circleSprite.y < rectSprite.top + rectSprite.height) {
      closePoint.y = circleSprite.y;
    } else {
      closePoint.y = rectSprite.top + rectSprite.height;
    }
    return distance(circleSprite.x, circleSprite.y, closePoint.x, closePoint.y) < circleSprite.radius;
  }
}
