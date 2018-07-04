/* 游戏引擎 */

import TimeSystem from './timeSystem';

abstract class Engine {
  public abstract name: string;
  public abstract fps: number;
  public abstract timeSystem: TimeSystem;
  public abstract rate: number;

  /* 开始游戏 */
  public abstract start(): void;

  /* 暂停 */
  public abstract pause(): void;

  /* 恢复 */
  public abstract unPause(): void;

  /* 播放音乐 */
  public abstract playSound(): void;

  /* 设置游戏运行速率
    0.0~1.0之间的值
    0:时间恒定，
    0.5:时间以正常速率的一半流失
    1:正常时间的流逝
  */
  public abstract setTimeRate(rate: number): void;

  /* 销毁游戏 */
  public abstract destroy(): void;

  /* 判断是否暂停 */
  public isPaused() {
    return this.timeSystem.isPaused;
  }

  /* 获取游戏时长 */
  public getGameTime() {
    return this.timeSystem.getElapsed();
  }
}

export default Engine;
