type Behavior = (ball: Ball, elapsed: number) => void;
interface BallOption {
  verticalHeight?: number;
  pixelPerMiter?: number;
  useGravity?: boolean;
  useRebound?: boolean;
}

const GRAVITY = 9.81; //重力加速度9.8m/s

class Ball {
  public behaviors: Behavior[];
  public radius: number;
  public x: number;
  public y: number;
  public offset: number;
  public moveSpeed: number;
  public currentSpeed: number;
  public pixelPerMiter: number;
  public useGravity: boolean;
  public useRebound: boolean;
  public verticalHeight: number;
  public isStill: boolean;
  constructor(x: number, y: number, radius: number, { verticalHeight = 0, pixelPerMiter = 1, useGravity = false, useRebound = false }: BallOption = {}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.offset = 0;
    this.moveSpeed = 0;
    this.currentSpeed = 0;
    this.behaviors = [];
    this.pixelPerMiter = pixelPerMiter;
    this.useGravity = useGravity;
    this.useRebound = useRebound;
    this.verticalHeight = verticalHeight;
    this.isStill = false;
  }

  /* 设置速度 */
  public setSpeed(speed: number) {
    this.moveSpeed = speed;
    this.currentSpeed = speed;
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
    let { x, y, radius, offset, pixelPerMiter } = this;
    ctx.save();
    ctx.translate(x, y + offset * pixelPerMiter);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /* 重置 */
  public reset() {
    this.offset = 0;
    this.currentSpeed = this.moveSpeed;
  }

  /* 移动 */
  static move(ball: Ball, elapsed: number) {
    //小球是静止状态，不更新
    if (ball.isStill) {
      return;
    }
    let { currentSpeed } = ball;
    let t = elapsed / 1000; //elapsed是毫秒, 而速度单位是m/s，所以要除1000
    //更新速度
    if (ball.useGravity) {
      ball.currentSpeed += GRAVITY * t;
    }
    let distance = ball.currentSpeed * t; 
    if (ball.offset + distance > ball.verticalHeight) {
      //落到地面了
      //使用反弹效果
      if (ball.useRebound) {
        ball.offset = ball.verticalHeight;
        ball.currentSpeed = -ball.currentSpeed * 0.6;
        if ((distance * ball.pixelPerMiter) / t < 1) {
          //当前移动距离小于1px，应该静止了，
          ball.isStill = true;
          ball.currentSpeed = 0;
        }
      } else {
        ball.isStill = true;
        ball.currentSpeed = 0;
        ball.offset = ball.verticalHeight;
      }
    } else {
      ball.offset += distance;
    }
  }
}

export default Ball;
