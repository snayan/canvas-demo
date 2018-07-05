import Canvas from 'common/canvas';
import { random } from 'common/util';
import { windowToCanvas } from 'common/util';
import { FONT } from 'common/CONSTANT';
import browser from 'common/browser';
import Sprite, { RectSprite, CircleSprite } from './sprite';
import Collide from './collide';

interface Point {
  left: number;
  top: number;
}

export default class CollideCanvas extends Canvas {
  rects: RectSprite[];
  draggingSprite: Sprite;
  lastMovePoint: Point;
  circles: CircleSprite[];
  ctx: CanvasRenderingContext2D;
  collide: Collide;
  isCollide: boolean;
  collideColor: string;
  constructor() {
    super();
    this.rects = [];
    this.circles = [];
    this.ctx = this.getContext('2d');
    this.isCollide = false;
    this.collideColor = 'rgba(244, 85, 65, 0.8)';
    this.collide = new Collide();
  }

  /* 随机创建矩形 */
  private createRect() {
    let { width, height, rects } = this;
    let colors = ['rgba(66, 134, 244, 0.5)', 'rgba(65, 244, 223, 0.5)'];
    let createRectSprite = (i) => {
      let rectLength = Math.min(Math.min(width, height) / 5, 100);
      rectLength += (rectLength / 4) * i;
      let x = Math.floor(random(0, width));
      let y = Math.floor(random(0, height));
      if (x + rectLength > width) {
        x = x - rectLength;
      }
      if (y + rectLength > height) {
        y = y - rectLength;
      }
      return new RectSprite({
        name: `rect_${i}`,
        left: x,
        top: y,
        width: rectLength,
        height: rectLength,
        fillStyle: colors[i % 2],
        visible: true,
      });
    };
    const count = 2;
    for (let i = 0, j = count; i < j; i++) {
      do {
        this.draggingSprite = createRectSprite(i);
        this.didCollide();
      } while (this.isCollide);
      rects[i] = this.draggingSprite as RectSprite;
      this.draggingSprite = null;
    }
  }

  /* 随机创建圆 */
  private createCircle() {
    let { width, height, circles } = this;
    let colors = ['rgba(244, 235, 65, 0.5)', 'rgba(66, 244, 86,0.5)'];
    let radius = Math.min(Math.min(width, height) / 10, 50);
    let createCircleSprite = (i) => {
      let x = Math.floor(random(radius, width));
      let y = Math.floor(random(radius, height));
      if (x + radius > width) {
        x = x - radius;
      }
      if (y + radius > height) {
        y = y - radius;
      }
      return new CircleSprite({ name: `circle_${i}`, x, y, radius, fillStyle: colors[i % 2], visible: true });
    };
    const count = 2;
    for (let i = 0, j = count; i < j; i++) {
      do {
        this.draggingSprite = createCircleSprite(i);
        this.didCollide();
      } while (this.isCollide);
      circles[i] = this.draggingSprite as CircleSprite;
      this.draggingSprite = null;
    }
  }

  /* 写个标题 */
  private drawTitle() {
    let { ctx, width, height, isCollide, collideColor } = this;
    ctx.save();
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.fillStyle = isCollide ? collideColor : 'rgba(66, 134, 244, 0.8)';
    let h = ctx.measureText('M').width;
    ctx.fillText(isCollide ? '碰撞了' : '碰撞检测：外接图形法', width / 2, h + h / 6 + 10);
    ctx.restore();
  }

  /* 绘制外接矩形 */
  private drawRect() {
    let { ctx, rects, draggingSprite } = this;
    ctx.save();
    for (let [i, { left, top, width, height, fillStyle, visible }] of rects.entries()) {
      if (visible && rects[i] !== draggingSprite) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /* 绘制圆形 */
  private drawCircle() {
    let { circles, ctx, draggingSprite } = this;
    ctx.save();
    for (let [i, { fillStyle, visible, x, y, radius }] of circles.entries()) {
      if (visible && circles[i] !== draggingSprite) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.fill();
      }
    }
  }

  /* 绘制拖动中的图形 */
  private drawDraggingSprite() {
    let { ctx, draggingSprite } = this;
    if (this.draggingSprite) {
      ctx.save();
      ctx.fillStyle = draggingSprite.fillStyle;
      ctx.beginPath();
      if (draggingSprite.type === 'rect') {
        let { left, top, width, height } = draggingSprite as RectSprite;
        ctx.rect(left, top, width, height);
      } else {
        let { x, y, radius } = draggingSprite as CircleSprite;
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      }
      ctx.fill();
      ctx.restore();
    }
  }

  /* 绘制发生了碰撞的提示框 */
  private drawCollideTip() {
    let { ctx, isCollide, collideColor, width, height } = this;
    if (isCollide) {
      ctx.save();
      ctx.strokeStyle = collideColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, width, height);
      ctx.restore();
    }
  }

  /* 监听事件 */
  private bindEvent() {
    let { width, height, el } = this;
    let transPoint = (e: MouseEvent | TouchEvent) => {
      let ex;
      let ey;
      e.preventDefault();
      if (browser.pc) {
        ex = (e as MouseEvent).x;
        ey = (e as MouseEvent).y;
      } else {
        ex = (e as TouchEvent).touches[0].pageX;
        ey = (e as TouchEvent).touches[0].pageY;
      }
      return { ex, ey };
    };
    let bindListener = (fn) => (e) => fn.call(this, transPoint(e));
    if (browser.pc) {
      el.addEventListener('mousedown', bindListener(this.mouseDown), false);
      el.addEventListener('mousemove', bindListener(this.mouseMove), false);
      el.addEventListener('mouseup', this.mouseUp.bind(this), false);
      el.addEventListener('mouseleave', this.mouseUp.bind(this), false);
    } else {
      el.addEventListener('touchstart', bindListener(this.mouseDown), false);
      el.addEventListener('touchmove', bindListener(this.mouseMove), false);
      el.addEventListener('touchend', this.mouseUp.bind(this), false);
      el.addEventListener('touchcancel', this.mouseUp.bind(this), false);
    }
  }

  /* 鼠标按下 */
  private mouseDown({ ex, ey }) {
    let { el, ctx, rects, circles } = this;
    let { x, y } = windowToCanvas(el, ex, ey);
    for (let [index, { left, top, width, height, visible }] of rects.entries()) {
      if (visible) {
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        if (ctx.isPointInPath(x, y)) {
          this.draggingSprite = rects[index];
          this.lastMovePoint = { left: x, top: y };
          break;
        }
      }
    }
    if (!this.draggingSprite) {
      for (let circle of circles) {
        if (circle.visible) {
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
          if (ctx.isPointInPath(x, y)) {
            this.draggingSprite = circle;
            this.lastMovePoint = { left: x, top: y };
            break;
          }
        }
      }
    }
  }

  /* 鼠标移动 */
  private mouseMove({ ex, ey }) {
    let { el, ctx, collide, rects, draggingSprite, width, height, lastMovePoint } = this;
    let { x, y } = windowToCanvas(el, ex, ey);
    if (draggingSprite) {
      if (draggingSprite.type === 'rect') {
        this.moveRect(draggingSprite as RectSprite, x, y);
      } else if (draggingSprite.type === 'circle') {
        this.moveCircle(draggingSprite as CircleSprite, x, y);
      }
      this.lastMovePoint = { left: x, top: y };
      this.didCollide();
      this.draw();
    }
  }

  /* 鼠标放开 */
  private mouseUp() {
    this.draggingSprite = null;
    this.lastMovePoint = null;
  }

  /* 移动矩形 */
  private moveRect(rect: RectSprite, x: number, y: number) {
    let { width, height, lastMovePoint } = this;
    rect.left += x - lastMovePoint.left;
    rect.top += y - lastMovePoint.top;
    rect.left = Math.max(0, rect.left);
    rect.left = Math.min(width - rect.width, rect.left);
    rect.top = Math.max(0, rect.top);
    rect.top = Math.min(height - rect.height, rect.top);
  }

  /* 移动圆 */
  private moveCircle(circle: CircleSprite, x: number, y: number) {
    let { width, height, lastMovePoint } = this;
    circle.x += x - lastMovePoint.left;
    circle.y += y - lastMovePoint.top;
    circle.x = Math.max(circle.radius, circle.x);
    circle.x = Math.min(width - circle.radius, circle.x);
    circle.y = Math.max(circle.radius, circle.y);
    circle.y = Math.min(height - circle.radius, circle.y);
  }

  /* 判断是否发送碰撞了 */
  private didCollide() {
    let { rects, circles, draggingSprite, collide } = this;
    this.isCollide = false;
    if (draggingSprite) {
      for (let rect of rects) {
        if (collide.isCandidateForCollide(draggingSprite, rect)) {
          if (collide.didCollide(draggingSprite, rect)) {
            this.isCollide = true;
            console.log(`occur collide: ${draggingSprite.name} and ${rect.name}`);
          }
        }
      }
      for (let circle of circles) {
        if (collide.isCandidateForCollide(draggingSprite, circle)) {
          if (collide.didCollide(draggingSprite, circle)) {
            this.isCollide = true;
            console.log(`occur collide: ${draggingSprite.name} and ${circle.name}`);
          }
        }
      }
    }
  }

  /* 绘制 */
  private draw() {
    let { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    this.drawTitle();
    this.drawRect();
    this.drawCircle();
    this.drawDraggingSprite();
    this.drawCollideTip();
  }

  /* 渲染 */
  public render(container: HTMLElement) {
    super.render(container);
    this.createRect();
    this.createCircle();
    this.draw();
    this.bindEvent();
  }
}
