import CommonRender from 'common/render';
import ClockCanvas from './canvas';

export default class Clock extends CommonRender {
  constructor() {
    super('clock');
    this.canvas = new ClockCanvas();
  }
}
