export type TimingFunc = (percent: number) => number;

class TimeSysTem {
  private startTime: number;
  public isRunning: boolean;
  public timeFunc: TimingFunc;
  public duration: number;
  constructor(duration, timeFunc = TimeSysTem.linear()) {
    this.timeFunc = timeFunc;
    this.duration = duration;
    this.isRunning = false;
  }
  public start(timeFunc?: TimingFunc) {
    if (typeof timeFunc === 'function') {
      this.timeFunc = timeFunc;
    }
    this.startTime = Date.now();
    this.isRunning = true;
  }

  public getElapsedTime() {
    if (this.isOver()) {
      return this.duration;
    }
    let actualElapsed = Date.now() - this.startTime;
    let percent = actualElapsed / this.duration;
    return actualElapsed * (this.timeFunc(percent) / percent);
  }
  public stop() {
    this.startTime = null;
    this.isRunning = false;
  }

  public isOver() {
    return !this.isRunning || Date.now() - this.startTime > this.duration;
  }

  static linear() {
    return function(percent: number) {
      return percent;
    };
  }
  static easeIn(strength: number = 1) {
    return function(percent: number) {
      return Math.pow(percent, strength * 2);
    };
  }
  static easeOut(strength: number = 1) {
    return function(percent: number) {
      return 1 - Math.pow(1 - percent, strength * 2);
    };
  }
  static easeInOut() {
    return function(percent: number) {
      return percent - Math.sin(percent * Math.PI * 2) / (2 * Math.PI);
    };
  }
}

export default TimeSysTem;
