/* 碰撞检测
光线透射法：通过检测两个物体的速度矢量是否存在交点，且该交点满足一定条件。
优点：适合运动速度快的物体，避免了速度过快，在一帧内被检测物体位置检测失效情况
缺点：适应场景有限，比如球投桶游戏
*/

// import Game from './game';
import { CircleSprite, ImageSprite } from './sprite';

export default class Collide {
  canvas: HTMLCanvasElement;
  constructor(canvas) {
    this.canvas = canvas;
  }

  /* 检查是否满足判断碰撞的条件
    比如，可以过滤掉不可见sprite，或者在当前帧下根本就不会发送碰撞，
    常用手法：空间分割法
  */
  public isCandidateForCollide(ball: CircleSprite) {
    return ball.isVisible && !this.isBallOutCanvas(ball);
  }

  /* 检测小球是否已经落入到canvas外面了 */
  public isBallOutCanvas(ball: CircleSprite) {
    let { width, height } = this.canvas;
    let { x, y, radius } = ball;
    return x + radius < 0 || x - radius > width || y - radius > height;
  }

  /* 是否发生碰撞 */
  public didCollide(ball: CircleSprite, bucket: ImageSprite) {
    let k1 = ball.verticalVelocity / ball.horizontalVelocity;
    let b1 = ball.y - k1 * ball.x;
    let inertSectionY = bucket.mockTop;
    let insertSectionX = (inertSectionY - b1) / k1;
    return (
      insertSectionX > bucket.mockLeft &&
      insertSectionX < bucket.mockLeft + bucket.mockWidth &&
      ball.x > bucket.mockLeft &&
      ball.x < bucket.mockLeft + bucket.mockWidth &&
      ball.y > bucket.mockTop &&
      ball.y < bucket.mockTop + bucket.mockHeight
    );
  }
}
