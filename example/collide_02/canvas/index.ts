import Canvas from 'common/canvas';
import browser from 'common/browser';
import { windowToCanvas } from 'common/util';
import Game from './game';

export default class CollideCanvas extends Canvas {
  game: Game;
  constructor() {
    super();
  }

  /* touch start or mouse down */
  private startMove({ x, y }) {
    let { game } = this;
    if (!game.isBallFlying) {
      game.isLaunching = true;
      game.lastMouseX = x;
      game.lastMouseY = y;
      game.calculateInitLaunchData();
    }
  }

  /* touch move or mouse move */
  private moving({ x, y }) {
    let { game } = this;
    if (game.isLaunching && !game.isBallFlying) {
      let ball = game.ball;
      game.lastMouseX = x;
      game.lastMouseY = y;
      game.calculateInitLaunchData();
    }
  }

  /* touch end or mouse up */
  private endMove({ x, y }) {
    let { game } = this;
    if (game.isLaunching && !game.isBallFlying) {
      game.lastMouseX = x;
      game.lastMouseY = y;
      game.calculateInitLaunchData();
      game.launchBall();
      game.isLaunching = false;
    }
  }

  /* 监听事件 */
  private addEventListener() {
    let { el } = this;
    let handleEvent = (handler: (point: { x: number; y: number }) => void) => (e: MouseEvent | TouchEvent) => {
      let x;
      let y;
      e.preventDefault();
      if (browser.pc) {
        e = e as MouseEvent;
        x = e.x;
        y = e.y;
      } else {
        e = e as TouchEvent;
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
      }
      handler.call(this, windowToCanvas(el, x, y));
    };

    el.addEventListener(browser.pc ? 'mousedown' : 'touchstart', handleEvent(this.startMove), false);
    el.addEventListener(browser.pc ? 'mousemove' : 'touchmove', handleEvent(this.moving), false);
    el.addEventListener(browser.pc ? 'mouseup' : 'touchend', handleEvent(this.endMove), false);
    el.addEventListener(browser.pc ? 'mouseleave' : 'touchcancel', handleEvent(this.endMove), false);
  }

  /* 渲染 */
  public render(container: HTMLElement) {
    super.render(container);
    this.addEventListener();
    this.game = new Game('game001', this.getContext('2d'));
    this.game.start();
  }
}
