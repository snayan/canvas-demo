/* 精灵，一般代表某一个具体的物体 */

import Vector from './vector';
import Projection from './projection';
import { distance } from 'common/util';

interface SpriteOption {
  type?: string;
  name?: string;
  visible?: boolean;
  fillStyle?: string;
}

type PolygonOption = SpriteOption & {
  edges: number;
  radius: number;
  x: number;
  y: number;
};

type CircleOption = SpriteOption & {
  x: number;
  y: number;
  radius: number;
};

export default abstract class Sprite {
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

  /* 渲染 */
  abstract render(ctx: CanvasRenderingContext2D): void;

  /* 获取所有的投影轴 */
  abstract getAxes(polygon?: Polygon): Vector[];

  /* 获取在指定投影轴上的投影 */
  abstract getProjection(v: Vector): Projection;

  /* 指定点是否在当前图形内 */
  abstract isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean;

  /* 移动 */
  abstract move(x, y): void;
}

export class Polygon extends Sprite {
  public edges: number;
  public radius: number;
  public x: number;
  public y: number;
  public points: { x: number; y: number }[];
  constructor(options: PolygonOption) {
    super(options);
    this.type = 'rect';
    this.edges = options.edges;
    this.radius = options.radius;
    this.x = options.x;
    this.y = options.y;
    this.createPoint();
  }
  private createPoint() {
    let { x, y, edges, radius } = this;
    let angle = (Math.PI * 2) / edges;
    let points = [];
    for (let i = 0; i < edges; i++) {
      let rotateAngle = angle * (i + 1);
      points.push({
        x: Math.cos(rotateAngle) * radius + x,
        y: Math.sin(rotateAngle) * radius + y,
      });
    }
    this.points = points;
  }
  public render(ctx: CanvasRenderingContext2D) {
    let { edges, points, fillStyle } = this;
    ctx.save();
    ctx.fillStyle = fillStyle;
    let first = points[0];
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < edges; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  public getAxes() {
    let points = this.points;
    let axes = [];
    for (let i = 0, j = points.length - 1; i < j; i++) {
      let v1 = new Vector(points[i].x, points[i].y);
      let v2 = new Vector(points[i + 1].x, points[i + 1].y);
      axes.push(
        v1
          .subtract(v2)
          .perpendicular()
          .normalize(),
      );
    }
    let firstPoint = points[0];
    let lastPoint = points[points.length - 1];
    let v1 = new Vector(lastPoint.x, lastPoint.y);
    let v2 = new Vector(firstPoint.x, firstPoint.y);
    axes.push(
      v1
        .subtract(v2)
        .perpendicular()
        .normalize(),
    );
    return axes;
  }
  public getProjection(v: Vector) {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    for (let point of this.points) {
      let p = new Vector(point.x, point.y);
      let dotProduct = p.dotProduct(v);
      min = Math.min(min, dotProduct);
      max = Math.max(max, dotProduct);
    }
    return new Projection(min, max);
  }

  public isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number) {
    let { edges, points } = this;
    let first = points[0];
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < edges; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    return ctx.isPointInPath(x, y);
  }

  public move(x: number, y: number) {
    this.points = this.points.map((point) => ({ x: point.x + x, y: point.y + y }));
  }
}

export class Circle extends Sprite {
  public x: number;
  public y: number;
  public radius: number;
  constructor(options: CircleOption) {
    super(options);
    this.type = 'circle';
    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius;
  }
  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }
  public getAxes(polygon: Polygon) {
    // 对于圆来说，获取其投影轴就是将圆心与他距离多边形最近顶点的连线
    let { x, y } = this;
    let nearestPoint = null;
    let nearestDistance = Number.MAX_SAFE_INTEGER;
    for (let [index, point] of polygon.points.entries()) {
      let d = distance(x, y, point.x, point.y);
      if (d < nearestDistance) {
        nearestDistance = d;
        nearestPoint = point;
      }
    }
    let v1 = new Vector(x, y);
    let v2 = new Vector(nearestPoint.x, nearestPoint.y);
    return [v1.subtract(v2).normalize()];
  }
  public getProjection(v: Vector) {
    let { x, y, radius } = this;
    let v1 = new Vector(x, y);
    let dotProduct = v1.dotProduct(v);
    let scaler = [dotProduct - radius, dotProduct, dotProduct + radius];
    return new Projection(Math.min.call(null, ...scaler), Math.max.call(null, ...scaler));
  }
  public isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    return ctx.isPointInPath(x, y);
  }
  public move(x: number, y: number) {
    this.x = this.x + x;
    this.y = this.y + y;
  }
}
