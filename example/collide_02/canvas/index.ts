import Canvas from 'common/canvas';
import Game from './game';

export default class CollideCanvas extends Canvas {
  game: Game;
  constructor() {
    super();
    this.game = new Game('game001', this.getContext('2d'));
  }
  render(container: HTMLElement) {
    super.render(container);
    this.game.start();
  }
}
