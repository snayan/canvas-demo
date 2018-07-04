/* 游戏实例 */
import { FONT } from 'common/CONSTANT';
import browser from 'common/browser';
import { transToRadian, transToAngle, distance, getQuery } from 'common/util';
import Engine from './engine';
import TimeSystem from './timeSystem';
import { Sprite, ImageSprite, CircleSprite, RectSprite } from './sprite';
import Collide from './collide';

const G: number = 9.8;

const query = getQuery();

class Game extends Engine {
  private lastFrameTime: number; //最后一帧绘制的时间
  private lastFpsTime: number; //上一次fps更新的时间【fps没必要每一帧都更新，大致0.5s更新一次就可以了，所以与lastFrameTime不一致】
  private ballHistory: Array<{ x: number; y: number; timestamp: number }>; //小球经历的路径轨迹
  public name: string; //名称
  public fps: number; //fps
  public ctx: CanvasRenderingContext2D; //canvas 绘制环境
  public timeSystem: TimeSystem; //时间系统
  public collide: Collide; //碰撞检测
  public rate: number; //游戏速率，可以调节游戏快慢
  public isDestroyed: boolean; //游戏是否销毁
  public width: number; //宽
  public height: number; //高
  public sprites: Sprite[]; //精灵
  public ball: CircleSprite; //小球，单独保存，方便后续多次使用
  public bucket: ImageSprite; //桶，单独保存，方便后续多次使用
  public score: number; //得分
  public launchAngle: number; //发射角度
  public isLaunching: boolean; //是否准备发射
  public isBallFlying: boolean; //小球是否在飞行
  public isHit: boolean; // 小球是否落桶
  public launchX: number; //小球发射点的X坐标
  public launchY: number; //小球发射点的Y坐标
  public lastMouseX: number; //鼠标最后移动的X坐标
  public lastMouseY: number; //鼠标最后移动的Y坐标
  public meterPerPixel: number; //一像素对应多少米
  public openDevDoor: boolean; //是否开启开发者后门
  public hitMessage: string; //进球提示语
  public hitMessageOpacity: number; //提示语opacity
  constructor(name: string, ctx: CanvasRenderingContext2D) {
    super();
    this.lastFrameTime = 0;
    this.lastFpsTime = 0;
    this.ballHistory = [];
    this.name = name;
    this.ctx = ctx;
    this.fps = 0;
    this.rate = 1;
    this.isDestroyed = true;
    this.sprites = [];
    this.score = 0;
    this.launchAngle = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isLaunching = false;
    this.isBallFlying = false;
    this.isHit = false;
    this.meterPerPixel = 0.02666666666666667;
    this.openDevDoor = query.admin === '1';
    this.hitMessage = '好球';
    this.hitMessageOpacity = 0;
  }

  /* 计算fps */
  private calculateFps(now: number) {
    if (now - this.lastFpsTime > 500) {
      let elapsed = now - this.lastFrameTime;
      if (this.lastFrameTime && elapsed) {
        this.fps = Math.round(1000 / elapsed);
      }
      this.lastFpsTime = now;
    }
  }

  /* 计算初始发射角度 */
  private calculateAngle() {
    let { ball, lastMouseX, lastMouseY } = this;
    let deltaX = lastMouseX - ball.x;
    let deltaY = ball.y - lastMouseY;
    let angle = Math.ceil(transToAngle(Math.atan(deltaY / deltaX)));
    if (lastMouseX < ball.x) {
      angle = 180 + angle;
    }
    if (lastMouseY > ball.x && deltaY < 0) {
      angle = 360 + angle;
    }
    this.launchAngle = angle % 360;
  }

  /* 计算初始发射速度 */
  private calculateSpeed() {
    let { ball, lastMouseX, lastMouseY, meterPerPixel } = this;
    ball.horizontalVelocity = ((lastMouseX - ball.x) * 1) / 10;
    ball.verticalVelocity = ((lastMouseY - ball.y) * 1) / 10;
  }

  /* 创建桶 */
  private createBucketSprite() {
    let { ctx, sprites, openDevDoor } = this;
    let options = {
      src: require('../img/bucket.png'),
      loadCallBack: (sprite: ImageSprite) => {
        let { ctx, width, height } = sprite;
        sprite.left = ctx.canvas.width - width - 20;
        sprite.top = ctx.canvas.height - height - 40;
        sprite.mockLeft = sprite.left + 40;
        sprite.mockTop = sprite.top + 10;
        sprite.mockWidth = sprite.width - 50;
        sprite.mockHeight = sprite.height - 12;
      },
      artist: {
        draw: (sprite: ImageSprite) => {
          let { ctx, el, left, top, width, height } = sprite;
          ctx.save();
          sprite.applyStyle();
          ctx.drawImage(el, left, top, width, height);
          if (openDevDoor) {
            ctx.strokeStyle = 'rgba(0,0,0,0.6)';
            ctx.setLineDash([4, 2]);
            ctx.beginPath();
            ctx.strokeRect(sprite.mockLeft, sprite.mockTop, sprite.mockWidth, sprite.mockHeight);
          }
          ctx.restore();
        },
      },
    };
    this.bucket = new ImageSprite('bucket', ctx, options);
    sprites.push(this.bucket);
  }

  /* 创建小球 */
  private createBallSprite() {
    let { ctx, sprites } = this;
    let platform = sprites.filter((sprite) => sprite.name === 'platform')[0] as RectSprite;
    if (platform) {
      let radius = 10;
      let platformWidth = platform.width;
      let options = {
        x: platform.left + platformWidth / 2,
        y: platform.top - radius - 1,
        radius: radius,
        fillStyle: 'rgba(128, 216, 83, 1)',
        strokeStyle: 'rgba(128, 216, 83, 1)',
        horizontalVelocity: 0,
        verticalVelocity: 0,
      };
      this.ball = new CircleSprite('ball', ctx, options);
      this.ball.addBehavior({ execute: this.updateBallPosition.bind(this) });
      this.ball.addBehavior({ execute: this.updateBallSpeed.bind(this) });
      this.ball.addBehavior({ execute: this.didCollide.bind(this) });
      this.launchX = this.ball.x;
      this.launchY = this.ball.y;
      sprites.push(this.ball);
    }
  }

  /* 创建分数 */
  private createScoreSprite() {
    let { ctx, width, sprites } = this;
    let options = {
      left: width / 2,
      top: 30,
      fillStyle: 'rgb(216, 153, 83)',
      artist: {
        draw: (sprite: RectSprite) => {
          let { ctx, fillStyle, strokeStyle, left, top } = sprite;
          ctx.save();
          ctx.fillStyle = fillStyle;
          ctx.font = FONT;
          ctx.textAlign = 'center';
          ctx.fillText(this.score + '', left, top);
          ctx.restore();
        },
      },
    };
    sprites.push(new RectSprite('score', ctx, options));
  }

  /* 创建平台 */
  private createPlatform() {
    let { ctx, sprites } = this;
    let platformHeight = 10;
    let platformWidth = 60;
    let options = {
      width: platformWidth,
      height: platformHeight,
      left: 20,
      top: ctx.canvas.height - platformHeight - 40,
      fillStyle: 'rgba(88, 84, 216, 0.5)',
      strokeStyle: 'rgba(88, 84, 216, 0.5)',
    };
    sprites.push(new RectSprite('platform', ctx, options));
  }

  /* 创建提示 */
  private createGuidePlatSprite() {
    let { ctx, sprites } = this;
    let options = {
      left: 20,
      top: 20,
      width: browser.pc ? 250 : 140,
      height: browser.pc ? 100 : 50,
      fillStyle: 'rgba(242, 238, 234, 0.3)',
      strokeStyle: 'rgba(114, 64, 142, 0.3)',
      artist: {
        draw: (sprite: RectSprite) => {
          let { ctx, fillStyle, strokeStyle, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, left, top, width, height } = sprite;
          let { horizontalVelocity, verticalVelocity } = this.ball;
          ctx.save();
          ctx.fillStyle = fillStyle;
          ctx.strokeStyle = strokeStyle;
          ctx.rect(left, top, width, height);
          ctx.fill();
          ctx.stroke();
          ctx.textAlign = 'center';
          ctx.font = FONT;
          ctx.fillStyle = 'rgb(114, 64, 142, 0.5)';
          let mWidth = ctx.measureText('M').width;
          let mHeight = mWidth + mWidth / 6;
          let textMargin = (height - mHeight * 2) / 2;
          textMargin -= textMargin / 4;
          ctx.fillText(`速度：${Math.sqrt(horizontalVelocity * horizontalVelocity + verticalVelocity * verticalVelocity).toFixed(2)}m/s`, left + width / 2, top + textMargin + mHeight);
          ctx.fillText(`角度：${this.launchAngle}度`, left + width / 2, top + textMargin + mHeight * 2 + textMargin / 2);
          ctx.restore();
        },
      },
    };
    sprites.push(new RectSprite('guideWire', ctx, options));
  }

  /* 创建精灵 */
  private createSprites() {
    this.createBucketSprite();
    this.createPlatform();
    this.createBallSprite();
    this.createGuidePlatSprite();
    this.createScoreSprite();
  }

  /* 更新小球位置 */
  private updateBallPosition(ball: CircleSprite, now: number, lastFrameTime: number) {
    let { isBallFlying, meterPerPixel, openDevDoor, ballHistory } = this;
    if (isBallFlying) {
      let { horizontalVelocity, verticalVelocity, x, y } = ball;
      let deltaTime = (now - lastFrameTime) / 1000;
      ball.x += (deltaTime * horizontalVelocity) / meterPerPixel;
      ball.y += (deltaTime * verticalVelocity) / meterPerPixel;
      if (openDevDoor) {
        let last = ballHistory[ballHistory.length - 1];
        if (!last || now - last.timestamp > 10) {
          ballHistory.push({
            x: ball.x,
            y: ball.y,
            timestamp: now,
          });
        }
      }
    }
  }

  /* 更新小球速度 */
  private updateBallSpeed(ball: CircleSprite, now: number, lastFrameTime: number) {
    let { isBallFlying, meterPerPixel } = this;
    if (isBallFlying) {
      let { verticalVelocity } = ball;
      let deltaTime = (now - lastFrameTime) / 1000;
      ball.verticalVelocity = G * deltaTime + verticalVelocity;
    }
  }

  /* 碰撞检测 */
  private didCollide() {
    let { collide, ball, bucket, isBallFlying, isHit } = this;
    if (isHit) {
      ball.isVisible = false;
    }
    if (!isHit && isBallFlying && collide.isCandidateForCollide(ball)) {
      console.log('didCollide');
      if (collide.didCollide(ball, bucket)) {
        console.log('good ball');
        this.score += 2;
        this.isHit = true;
        this.hitMessageOpacity = 1;
      }
    }
    if (isBallFlying && collide.isBallOutCanvas(ball)) {
      this.reset();
    }
  }

  /* 更新精灵 */
  private updateSprites(now: number) {
    let { lastFrameTime, fps } = this;
    for (let sprite of this.sprites) {
      sprite.update(now, lastFrameTime, fps);
    }
  }

  /* 擦除游戏 */
  private erase() {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
  }

  /* 绘制fps值 */
  private drawFps() {
    let { fps, width, height, ctx } = this;
    let text = `fps:${fps}`;
    ctx.save();
    ctx.font = FONT;
    ctx.fillStyle = 'rgb(0, 0, 0, 0.5)';
    let textWidth = ctx.measureText(text).width;
    ctx.fillText(text, width - textWidth - 20, 30);
    ctx.restore();
  }

  /* 绘制背景颜色 */
  private drawBg() {
    let { ctx, width, height } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(65, 202, 244, 0.5)';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  /* 绘制精灵 */
  private drawSprites() {
    for (let sprite of this.sprites) {
      if (sprite.isVisible) {
        sprite.draw();
      }
    }
  }

  /* 绘制指导线 */
  private drawGuideWireLine() {
    let { ctx, sprites, isLaunching, lastMouseX, lastMouseY, ball, launchAngle } = this;
    let radian = transToRadian(launchAngle);
    if (ball && isLaunching) {
      let radius = ball.radius;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgb(249, 117, 192)';
      ctx.moveTo(ball.x + radius * Math.cos(radian), ball.y - radius * Math.sin(radian));
      ctx.lineTo(lastMouseX, lastMouseY);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* 绘制中球提示 */
  private drawHitMessage() {
    let { hitMessage, hitMessageOpacity, isHit, ctx, width, height, fps } = this;
    if (hitMessageOpacity) {
      ctx.save();
      ctx.font = `${browser.pc ? 48 : 32}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.globalAlpha = hitMessageOpacity;
      ctx.fillStyle = 'rgb(38, 165, 40)';
      ctx.fillText(hitMessage, width / 2, height / 4);
      ctx.restore();
      hitMessageOpacity -= 1 / fps;
      this.hitMessageOpacity = Math.max(0, hitMessageOpacity);
    }
  }

  /* 绘制水平参考线*/
  private drawHorizontalLine() {
    let { bucket, ctx, width } = this;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(0, bucket.mockTop);
    ctx.lineTo(width, bucket.mockTop);
    ctx.stroke();
    ctx.restore();
  }

  /* 绘制小球历史轨迹 */
  private drawBallHistory() {
    let { ball, ballHistory, ctx } = this;
    let radius = ball.radius;
    let anticlockwise = ball.anticlockwise;
    ctx.save();
    ctx.strokeStyle = ball.fillStyle;
    ctx.beginPath();
    for (let { x, y } of ballHistory.slice(0, ballHistory.length - 1)) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* 绘制 */
  private draw() {
    this.drawBg();
    this.drawSprites();
    this.drawGuideWireLine();
    this.drawHitMessage();
    if (this.openDevDoor) {
      this.drawFps();
      this.drawHorizontalLine();
      this.drawBallHistory();
    }
  }

  /* 持续的绘制游戏 */
  private animate(now: number) {
    this.erase();
    this.calculateFps(now);
    this.updateSprites(now);
    this.draw();
    this.lastFrameTime = now;
    window.requestAnimationFrame(this.animate.bind(this));
  }

  /* 开始 */
  public start() {
    let canvas = this.ctx.canvas;
    this.isDestroyed = false;
    this.timeSystem = new TimeSystem();
    this.collide = new Collide(canvas);
    this.width = canvas.width;
    this.height = canvas.height;
    this.createSprites();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  /* 重置小球 */
  public resetBall() {
    let { sprites, ball } = this;
    let platform = sprites.filter((sprite) => sprite.name === 'platform')[0] as RectSprite;
    ball.x = platform.left + platform.width / 2;
    ball.y = platform.top - ball.radius - 1;
    ball.horizontalVelocity = 0;
    ball.verticalVelocity = 0;
  }

  /* 重置游戏 */
  public reset() {
    this.lastFrameTime = 0;
    this.lastFpsTime = 0;
    this.ball.isVisible = true;
    this.isDestroyed = false;
    this.launchAngle = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isLaunching = false;
    this.isBallFlying = false;
    this.isHit = false;
    this.timeSystem.reset();
    this.resetBall();
  }

  /* 暂停 */
  public pause() {
    this.timeSystem.paused();
  }

  /* 恢复 */
  public unPause() {
    this.timeSystem.unPaused();
  }

  /* 播放声音 */
  public playSound() {}

  /* 设置游戏速率 */
  public setTimeRate(rate: number) {
    rate = Math.max(0, rate);
    this.rate = rate;
    this.timeSystem.setTransducer((now) => {
      return now * rate;
    });
  }

  /* 初始化发射数据 */
  public calculateInitLaunchData() {
    if (this.ball) {
      this.calculateAngle();
      this.calculateSpeed();
    }
  }

  /* 发射小球 */
  public launchBall() {
    let { ball, isLaunching, lastFrameTime } = this;
    if (isLaunching && ball) {
      this.isBallFlying = true;
      this.ballHistory = [];
      this.isHit = false;
      this.timeSystem.reset();
      this.timeSystem.start(lastFrameTime);
    }
  }

  /* 销毁 */
  public destroy() {
    this.isDestroyed = true;
    this.ballHistory = [];
    this.sprites = [];
    this.score = 0;
    this.launchAngle = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isLaunching = false;
    this.isBallFlying = false;
    this.isHit = false;
    this.timeSystem = null;
    this.collide = null;
    this.ball = null;
    this.bucket = null;
  }
}

export default Game;
