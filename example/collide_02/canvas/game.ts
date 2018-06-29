/* 游戏实例 */

import Engine from './engine';
import TimeSystem from './timeSystem';
import { Sprite } from './sprite';

class Game extends Engine {
  private lastFrameTime: number;
  public name: string;
  public fps: number;
  public ctx: CanvasRenderingContext2D;
  public timeSystem: TimeSystem;
  public rate: number;
  public isDestroyed: boolean;
  public width: number;
  public height: number;
  public sprites: Sprite[];
  constructor(name: string, ctx: CanvasRenderingContext2D) {
    super();
    this.name = name;
    this.ctx = ctx;
    this.timeSystem = new TimeSystem();
    this.fps = 0;
    this.rate = 1;
    this.isDestroyed = true;
    this.lastFrameTime = 0;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.sprites = [];
  }

  /* 计算fps */
  private calculateFps(now: number) {
    let elapsed = now - this.lastFrameTime;
    if (this.lastFrameTime && elapsed) {
      this.fps = 1000 / elapsed;
    }
  }

  /* 擦除游戏 */
  private erase() {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
  }

  /* 更新精灵 */
  private updateSprites(now: number) {
    let { lastFrameTime, fps } = this;
    for (let sprite of this.sprites) {
      if (sprite.isVisible) {
        sprite.update(now, lastFrameTime, fps);
      }
    }
  }

  /* 绘制精灵 */
  private drawSprites() {
    for (let sprite of this.sprites) {
      if (sprite.isVisible) {
        sprite.draw();
      }
    }
  }

  /* 持续的绘制游戏 */
  private animate(now: number) {
    this.erase();
    this.calculateFps(now);
    this.updateSprites(now);
    this.drawSprites();
    this.lastFrameTime = now;
    window.requestAnimationFrame(this.animate.bind(this));
  }

  /* 开始 */
  public start() {
    this.isDestroyed = false;
    this.timeSystem.start();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  /* 暂停 */
  public paused() {
    this.timeSystem.paused();
  }

  /* 恢复 */
  public unPaused() {
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

  /* 销毁 */
  public destroy() {
    this.calculateFps = null;
    this.isDestroyed = true;
  }
}

export default Game;
