/* 时间系统 */

/* 秒表 */
export class StopWatch {
  private startTime: number;
  private running: boolean;
  private elapsed: number;
  constructor() {
    this.startTime = 0;
    this.elapsed = 0;
    this.running = false;
  }

  /* 开始 */
  public start() {
    this.startTime = Date.now();
    this.running = true;
    this.elapsed = 0;
  }

  /* 停止 */
  public stop() {
    this.running = false;
    this.elapsed = Date.now() - this.startTime;
  }

  /* 获取流逝的时间 */
  public getElapsedTime() {
    return this.running ? Date.now() - this.startTime : this.elapsed;
  }

  /* 重置 */
  public reset() {
    this.startTime = Date.now();
    this.elapsed = 0;
  }

  /* 是否在运行 */
  public isRunning() {
    return this.running;
  }
}

/* 动画计时器 */
export class AnimationTimer extends StopWatch {
  duration: number;
  transducer: (percent: number) => number;
  constructor(duration = 1000, transducer = AnimationTimer.makeLinear()) {
    super();
    this.duration = duration;
    this.transducer = transducer;
  }

  /* 时间抽扭曲 */
  public getElapsedTime() {
    if (!this.isRunning() || !this.duration) {
      return 0;
    }
    /* 实际流逝的时间 */
    let elapsed = super.getElapsedTime();
    let percentComplete = elapsed / this.duration;
    return elapsed * (this.transducer(percentComplete) / percentComplete);
  }

  /* 判断是否过期 */
  public isExpired() {
    return this.getElapsedTime() > this.duration;
  }

  /* 线性 */
  static makeLinear() {
    return function(percentComplete) {
      return percentComplete;
    };
  }

  /* 淡入 */
  static makeEaseIn(strength = 1) {
    return function(percentComplete) {
      return Math.pow(percentComplete, strength * 2);
    };
  }

  /* 淡出 */
  static makeEaseOut(strength = 1) {
    return function(percentComplete) {
      return 1 - Math.pow(1 - percentComplete, strength * 2);
    };
  }

  /* 淡入淡出 */
  static makeEaseInOut() {
    return function(percentComplete) {
      return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI);
    };
  }

  /* 弹簧 */
  static makeElastic(passes = 3) {
    return function(percentComplete) {
      return (1 - Math.cos(percentComplete * Math.PI * passes)) * (1 - percentComplete) + percentComplete;
    };
  }

  /* 弹跳 */
  static makeBounce(bounces) {
    let fn = AnimationTimer.makeElastic(bounces);
    return function(percentComplete) {
      percentComplete = fn(percentComplete);
      return percentComplete <= 1 ? percentComplete : 2 - percentComplete;
    };
  }
}

/* 游戏时间系统 */
class TimeSystem {
  private transducerStartTime: number;
  private elapsed: number;
  public isStart: boolean;
  public isPaused: boolean;
  public transducer: (now: number) => number;
  constructor() {
    this.elapsed = 0;
    this.isPaused = false;
    this.isStart = false;
    this.transducer = (elapsed: number) => elapsed;
    this.transducerStartTime = 0;
  }

  /* 计算已经流逝的时间  */
  private calculateElapsed(now: number) {
    let { transducerStartTime, transducer, isPaused } = this;
    if (!this.isPaused) {
      let transducerElapsed = now - transducerStartTime;
      if (typeof transducer === 'function') {
        transducerElapsed = transducer(transducerElapsed);
      }
      this.elapsed += transducerElapsed;
      this.transducerStartTime = now;
    }
  }

  /* 启动时间系统 */
  public start(now: number = Date.now()) {
    if (now == undefined) {
      now = Date.now();
    }
    this.elapsed = 0;
    this.isStart = true;

    this.transducerStartTime = now;
  }

  /* 重置 */
  public reset() {
    this.elapsed = 0;
    this.isStart = false;
    this.transducerStartTime = Date.now();
  }

  /* 暂停 */
  public paused(now: number = Date.now()) {
    if (now == undefined) {
      now = Date.now();
    }
    if (!this.isPaused) {
      this.calculateElapsed(now);
      this.isPaused = true;
    }
  }

  /* 恢复 */
  public unPaused() {
    if (this.isPaused) {
      this.transducerStartTime = Date.now();
      this.isPaused = false;
    }
  }
  /* 获取经过的时间 */
  public getElapsed(now: number = Date.now()) {
    let { transducerStartTime, transducer, isPaused } = this;
    if (this.isPaused) {
      return this.elapsed;
    }
    let transducerElapsed = now - transducerStartTime;
    if (typeof transducer === 'function') {
      transducerElapsed = transducer(transducerElapsed);
    }
    return this.elapsed + transducerElapsed;
  }

  /* 修改时间流逝传感器 */
  public setTransducer(transducerFunction: (now: number) => number, duration?: number, now: number = Date.now()) {
    let { transducer } = this;
    this.calculateElapsed(now);
    this.transducer = transducerFunction;
    if (Number.isFinite(duration)) {
      setTimeout(this.setTransducer.bind(this, transducer), duration);
    }
  }

  static;
}

export default TimeSystem;
