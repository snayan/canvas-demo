/* 游戏引擎 */

import TimeSystem from './timeSystem';

abstract class Engine {
  public abstract name: string;
  public abstract fps: number;
  public abstract gameTime: number;
  public abstract timeSystem: TimeSystem;
  public abstract rate: number;

  /* 开始游戏 */
  public abstract start(): void;

  /* 暂停/恢复 */
  public abstract togglePaused(): void;

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
}

export default Engine;
