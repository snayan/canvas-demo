/* 精灵🧚‍♀️ */

enum SpriteType {
  Circle,
  Rect,
  Image,
}

export interface Behavior {
  execute(sprite: Sprite, now: number, lastFrameTime: number, fps: number): void;
  [attr: string]: any;
}

export interface Artist {
  draw(sprite: Sprite): void;
  [attr: string]: any;
}

export abstract class Sprite {
  name: string;
  type: SpriteType;
  fillStyle: string;
  lineWidth: number;
  strokeStyle: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowColor: string;
  ctx: CanvasRenderingContext2D;
  horizontalVelocity: number;
  verticalVelocity: number;
  isVisible: boolean;
  behaviors: Behavior[];
  artist: Artist;
  mockLeft?:number;
  mockTop?:number;
  mockWidth?:number;
  mockHeight?:number;
  constructor(name, ctx, option) {
    this.name = name;
    this.ctx = ctx;
    this.isVisible = option.isVisible || true;
    this.type = option.type || SpriteType.Rect;
    this.fillStyle = option.fillStyle || this.ctx.fillStyle;
    this.lineWidth = option.lineWidth || this.ctx.lineWidth;
    this.strokeStyle = option.strokeStyle || this.ctx.strokeStyle;
    this.shadowOffsetX = option.shadowOffsetX || this.ctx.shadowOffsetX;
    this.shadowOffsetY = option.shadowOffsetY || this.ctx.shadowOffsetY;
    this.shadowBlur = option.shadowBlur || this.ctx.shadowBlur;
    this.shadowColor = option.shadowColor || this.ctx.shadowColor;
    this.horizontalVelocity = option.horizontalVelocity || 0;
    this.verticalVelocity = option.verticalVelocity || 0;
    this.behaviors = option.behaviors || [];
  }

  /* 应用样式 */
  public applyStyle() {
    let { ctx, fillStyle, lineWidth, strokeStyle, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor } = this;
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
  }

  /* 添加行为 */
  public addBehavior(behaviors: Behavior[] | Behavior) {
    Array.isArray(behaviors) ? this.behaviors.concat(behaviors) : this.behaviors.push(behaviors);
  }

  /* 更新 */
  public update(now: number, lastFrameTime: number, fps: number) {
    for (let behavior of this.behaviors) {
      behavior.execute(this, now, lastFrameTime, fps);
    }
  }

  /* 绘制 */
  public draw() {
    if (this.artist && typeof this.artist.draw === 'function') {
      this.artist.draw(this);
    }
  }
}

/* 圆形精灵 */
export class CircleSprite extends Sprite {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  anticlockwise: boolean;
  constructor(name, ctx, options: any = {}) {
    super(name, ctx, { ...options, type: SpriteType.Circle });
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.radius = options.radius || 10;
    this.startAngle = options.startAngle || 0;
    this.endAngle = options.endAngle || Math.PI * 2;
    this.anticlockwise = options.anticlockwise || false;
    this.artist = options.artist || {
      draw: function(sprite: CircleSprite) {
        let { ctx, x, y, radius, startAngle, endAngle, anticlockwise } = sprite;
        ctx.save();
        sprite.applyStyle();
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },
    };
  }
}

/* 矩形精灵 */
export class RectSprite extends Sprite {
  left: number;
  top: number;
  width: number;
  height: number;
  constructor(name, ctx, option) {
    super(name, ctx, { ...option, type: SpriteType.Rect });
    this.left = option.left || 0;
    this.top = option.top || 0;
    this.width = option.width || 10;
    this.height = option.height || 10;
    this.artist = option.artist || {
      draw: function(sprite: RectSprite) {
        let { ctx, left, top, width, height } = sprite;
        ctx.save();
        sprite.applyStyle();
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },
    };
  }
}

/* 图片精灵 */
export class ImageSprite extends Sprite {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  isLoaded: boolean;
  isLoading: boolean;
  el: HTMLImageElement;
  loadCallBack: (sprite: ImageSprite) => void;
  constructor(name, ctx, option) {
    super(name, ctx, { ...option, type: SpriteType.Image, isVisible: false });
    this.src = option.src;
    this.left = option.left || 0;
    this.top = option.top || 0;
    this.isLoaded = false;
    this.isLoading = false;
    this.el = document.createElement('img');
    this.loadCallBack = option.loadCallBack;
    this.artist = option.artist || {
      draw: function(sprite: ImageSprite) {
        let { ctx, el, left, top, width, height } = sprite;
        ctx.save();
        sprite.applyStyle();
        ctx.drawImage(el, left, top, width, height);
        ctx.restore();
      },
    };
    this.loadImage();
  }

  /* 加载图片 */
  private loadImage(cb?) {
    if (this.isLoading || this.isLoaded) {
      return;
    }
    let callback = () => {
      this.isVisible = true;
      this.isLoaded = true;
      this.isLoading = false;
      if (!this.width) {
        this.width = this.el.width;
      }
      if (!this.height) {
        this.height = this.el.height;
      }
      if (typeof this.loadCallBack === 'function') {
        this.loadCallBack(this);
      }
      if (typeof cb === 'function') {
        cb.call(this);
      }
    };
    this.isLoading = true;
    this.el.addEventListener('load', callback);
    this.el.addEventListener('error', callback);
    this.el.src = this.src;
  }

  /* 绘制 */
  public async draw() {
    if (!this.isLoaded) {
      return this.loadImage(this.draw);
    }
    super.draw();
  }
}
