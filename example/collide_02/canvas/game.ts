/* 游戏实例 */

import Engine from './engine';
import TimeSystem from './timeSystem';
import { throttle } from 'common/util';

class Game extends Engine {
  private lastFrameTime: number;
  private calculateFps: (now: number) => void;
  public name: string;
  public fps: number;
  public ctx: CanvasRenderingContext2D;
  public timeSystem: TimeSystem;
  public rate: number;
  public isDestroyed: boolean;
  constructor(name: string, ctx: CanvasRenderingContext2D) {
    super();
    this.name = name;
    this.ctx = ctx;
    this.timeSystem = new TimeSystem();
    this.fps = 0;
    this.rate = 1;
    this.isDestroyed = true;
    this.lastFrameTime = 0;
    this.calculateFps = throttle((now) => {
      let elapsed = now - this.lastFrameTime;
      if (this.lastFrameTime && elapsed) {
        this.fps = (this.rate * 1000) / elapsed;
      }
    }, 500);
  }

  /* 持续的绘制游戏 */
  private animate(now: number) {
    this.calculateFps(now);
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
