type Behavior = (ball: Ball, elapsed: number) => void;

class Ball {
  public behaviors: Behavior[];
  public radius: number;
  public x: number;
  public y: number;
  public rotate: number;
  public offset: number;
  public moveSpeed: number;
  public rotateSpeed: number;
  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotate = 0;
    this.offset = 0;
    this.moveSpeed = 0;
    this.rotateSpeed = 0;
    this.behaviors = [];
  }

  /* 设置移动速度 */
  public setMoveSpeed(speed: number) {
    this.moveSpeed = speed;
    this.setRotateSpeed(speed / this.radius);
  }

  /* 设置旋转速度 */
  public setRotateSpeed(speed: number) {
    this.rotateSpeed = speed;
  }

  /* 添加小球 */
  public addBehavior(behavior: Behavior | Behavior[]) {
    if (Array.isArray(behavior)) {
      this.behaviors = [...this.behaviors, ...behavior];
    } else {
      this.behaviors = [...this.behaviors, behavior];
    }
  }

  /* 更新小球 */
  public update(elapsed: number) {
    for (let behavior of this.behaviors) {
      behavior.call(null, this, elapsed);
    }
  }

  /* 绘制小球 */
  public render(ctx: CanvasRenderingContext2D) {
    let { x, y, radius, rotate, offset } = this;
    ctx.save();
    ctx.translate(x + offset, y);
    ctx.rotate(rotate);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
    ctx.moveTo(-radius, 0);
    ctx.lineTo(radius, 0);
    ctx.moveTo(0, -radius);
    ctx.lineTo(0, radius);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /* 重置 */
  public reset() {
    this.rotate = 0;
    this.offset = 0;
  }

  /* 旋转 */
  static rotate(ball: Ball, elapsed: number) {
    let angle = ball.rotateSpeed * elapsed;
    angle = angle % (Math.PI * 2);
    ball.rotate = angle;
  }

  /* 移动 */
  static move(ball: Ball, elapsed: number) {
    let { moveSpeed } = ball;
    let distance = ball.moveSpeed * elapsed;
    ball.offset = distance;
  }
}

export default Ball;
