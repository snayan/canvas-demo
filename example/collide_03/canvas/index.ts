import Canvas from 'common/canvas';
import { random } from 'common/util';
import { windowToCanvas } from 'common/util';
import { FONT } from 'common/CONSTANT';
import browser from 'common/browser';
import Sprite, { Polygon, Circle } from './sprite';
import Collide from './collide';

interface Point {
  x: number;
  y: number;
}

export default class CollideCanvas extends Canvas {
  draggingSprite: Sprite;
  lastMovePoint: Point;
  polygons: Polygon[];
  circles: Circle[];
  ctx: CanvasRenderingContext2D;
  collide: Collide;
  isCollide: boolean;
  collideColor: string;
  constructor() {
    super();
    this.polygons = [];
    this.circles = [];
    this.ctx = this.getContext('2d');
    this.isCollide = false;
    this.collideColor = 'rgba(244, 85, 65, 0.8)';
    this.collide = new Collide();
  }

  /* 随机创建多边形 */
  private createPolygon() {
    let { width, height, polygons } = this;
    let colors = ['rgba(66, 134, 244, 0.5)', 'rgba(65, 244, 223, 0.5)'];
    let createPolygon = (i) => {
      let radius = Math.min(Math.min(width, height) / 10, 50);
      radius += (radius / 4) * i;
      let x = Math.floor(random(0, width));
      let y = Math.floor(random(0, height));
      if (x + radius > width) {
        x = x - radius;
      }
      if (y + radius > height) {
        y = y - radius;
      }
      return new Polygon({
        name: `polygon_${i}`,
        x: x,
        y: y,
        radius: radius,
        edges: 5 + i,
        fillStyle: colors[i % 2],
        visible: true,
      });
    };
    const count = 2;
    for (let i = 0, j = count; i < j; i++) {
      do {
        this.draggingSprite = createPolygon(i);
        this.didCollide();
      } while (this.isCollide);
      polygons[i] = this.draggingSprite as Polygon;
      this.draggingSprite = null;
    }
  }

  /* 随机创建圆 */
  private createCircle() {
    let { width, height, circles } = this;
    let colors = ['rgba(244, 235, 65, 0.5)', 'rgba(66, 244, 86,0.5)'];
    let radius = Math.min(Math.min(width, height) / 10, 50);
    let createCircle = (i) => {
      let x = Math.floor(random(radius, width));
      let y = Math.floor(random(radius, height));
      if (x + radius > width) {
        x = x - radius;
      }
      if (y + radius > height) {
        y = y - radius;
      }
      return new Circle({ name: `circle_${i}`, x, y, radius, fillStyle: colors[i % 2], visible: true });
    };
    const count = 2;
    for (let i = 0, j = count; i < j; i++) {
      do {
        this.draggingSprite = createCircle(i);
        this.didCollide();
      } while (this.isCollide);
      circles[i] = this.draggingSprite as Circle;
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
    ctx.fillText(isCollide ? '碰撞了' : '碰撞检测：分离轴法', width / 2, h + h / 6 + 10);
    ctx.restore();
  }

  /* 绘制多边形 */
  private drawPolygon() {
    let { ctx, polygons } = this;
    polygons.forEach((polygon) => polygon.render(ctx));
  }

  /* 绘制圆形 */
  private drawCircle() {
    let { circles, ctx } = this;
    circles.forEach((circle) => circle.render(ctx));
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
    let { el, ctx, polygons, circles } = this;
    let { x, y } = windowToCanvas(el, ex, ey);
    for (let polygon of polygons) {
      if (polygon.visible && polygon.isPointInPath(ctx, x, y)) {
        this.draggingSprite = polygon;
        this.lastMovePoint = { x, y };
        break;
      }
    }
    if (!this.draggingSprite) {
      for (let circle of circles) {
        if (circle.visible && circle.isPointInPath(ctx, x, y)) {
          this.draggingSprite = circle;
          this.lastMovePoint = { x, y };
          break;
        }
      }
    }
  }

  /* 鼠标移动 */
  private mouseMove({ ex, ey }) {
    let { el, ctx, collide, polygons, draggingSprite, width, height, lastMovePoint } = this;
    let { x, y } = windowToCanvas(el, ex, ey);
    if (draggingSprite) {
      this.moveSprite(draggingSprite as Circle | Polygon, x, y);
      this.lastMovePoint = { x, y };
      this.didCollide();
      this.draw();
    }
  }

  /* 鼠标放开 */
  private mouseUp() {
    this.draggingSprite = null;
    this.lastMovePoint = null;
  }

  /* 移动图形 */
  private moveSprite(sprite: Circle | Polygon, x: number, y: number) {
    let { width, height, lastMovePoint } = this;
    let dx = x - lastMovePoint.x;
    let dy = y - lastMovePoint.y;
    sprite.move(dx, dy);
  }

  /* 判断是否发送碰撞了 */
  private didCollide() {
    let { polygons, circles, draggingSprite, collide } = this;
    this.isCollide = false;
    let sprites = [...polygons, ...circles];
    if (draggingSprite) {
      for (let sprite of sprites) {
        if (collide.isCandidateForCollide(draggingSprite, sprite)) {
          if (collide.didCollide(draggingSprite, sprite)) {
            this.isCollide = true;
            console.log(`occur collide: ${draggingSprite.name} and ${sprite.name}`);
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
    this.drawPolygon();
    this.drawCircle();
    this.drawCollideTip();
  }

  /* 渲染 */
  public render(container: HTMLElement) {
    super.render(container);
    this.createPolygon();
    this.createCircle();
    this.draw();
    this.bindEvent();
  }
}
