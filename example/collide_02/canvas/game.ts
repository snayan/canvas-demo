/* 游戏实例 */

import Engine from './engine';
import TimeSystem from './timeSystem';

class Game extends Engine {
  name: string;
  fps: number;
  gameTime: number;
  ctx: CanvasRenderingContext2D;
  timeSystem: TimeSystem;
  rate: number;
  constructor(name: string, ctx: CanvasRenderingContext2D) {
    super();
    this.name = name;
    this.ctx = ctx;
    this.timeSystem = new TimeSystem();
    this.fps = 0;
    this.gameTime = 0;
    this.rate = 1;
  }

  /* 开始 */
  public start() {
    this.timeSystem.start();
  }

  /* 暂停/恢复 */
  public togglePaused() {}

  /* 播放声音 */
  public playSound() {}

  /* 销毁 */
  public destroy() {}

  /* 设置游戏速率 */
  public setTimeRate(rate: number) {
    this.rate = rate;
    this.timeSystem.setTransducer((now) => {
      return now * rate;
    });
  }
}

export default Game;
