/* 分离抽判别法 */

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
    console.log(sprite, otherSprite);
    return false;
  }
}
