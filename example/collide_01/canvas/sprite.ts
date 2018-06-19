/* 精灵，一般代表某一个具体的物体 */

interface SpriteOption {
  type?: string;
  name?: string;
  visible?: boolean;
  fillStyle?: string;
}

type RectSpriteOption = SpriteOption & {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CircleSpriteOption = SpriteOption & {
  x: number;
  y: number;
  radius: number;
};

export default class Sprite {
  public type: string;
  public name: string;
  public visible: boolean;
  public fillStyle: string;
  constructor({ type, fillStyle, name = 'anonymous', visible = false }: SpriteOption = {}) {
    this.type = type;
    this.name = name;
    this.visible = visible;
    this.fillStyle = fillStyle;
  }
}

export class RectSprite extends Sprite {
  public left: number;
  public top: number;
  public width: number;
  public height: number;
  constructor(options: RectSpriteOption) {
    super(options);
    this.type = 'rect';
    this.left = options.left;
    this.top = options.top;
    this.width = options.width;
    this.height = options.height;
  }
}

export class CircleSprite extends Sprite {
  public x: number;
  public y: number;
  public radius: number;
  constructor(options: CircleSpriteOption) {
    super(options);
    this.type = 'circle';
    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius;
  }
}
