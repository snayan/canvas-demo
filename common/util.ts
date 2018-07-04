import storage from 'common/storage';

/* translate query to object */
export function getQuery() {
  let search = window.location.search;
  let query = Object.create(null);
  if (!search) {
    return query;
  }
  let reg = /[\?|&](\w+)=(\w+)/g;
  let matches = null;
  while ((matches = reg.exec(search))) {
    query[matches[1]] = matches[2];
  }
  return query;
}

/* if there is single module */
export function isSingleModule(m: string) {
  let query = getQuery();
  return query && query.module === m;
}

/* translate window point to canvas point  */
export function windowToCanvas(canvas: HTMLCanvasElement, x, y) {
  let box = canvas.getBoundingClientRect();
  return { x: x - box.left * (canvas.width / box.width), y: y - box.top * (canvas.height / box.height) };
}

/* export random between min and max */
export function random(min, max) {
  return Math.random() * (max - min) + min;
}

/* The distance between two points */
export function distance(x1: number, y1: number, x2: number, y2: number) {
  let x = Math.abs(x1 - x2);
  let y = Math.abs(y1 - y2);
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

/* throttle function */
export function throttle(fn, delay) {
  let lastTime = Date.now();
  let timer = null;
  return function(...args) {
    let currentTime = Date.now();
    if (currentTime - lastTime > delay) {
      window.clearTimeout(timer);
      fn.apply(null, args);
      lastTime = currentTime;
    }
    window.clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(null, args);
      lastTime = currentTime;
    }, delay);
  };
}

/* 是否支持passive */
export const isSupportPassive = (function() {
  const IS_SUPPORT_PASSIVE = 'IS_SUPPORT_PASSIVE';
  let isSupportPassive = storage.get(IS_SUPPORT_PASSIVE);
  if (isSupportPassive != null) {
    return isSupportPassive;
  }
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function() {
        isSupportPassive = true;
      },
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}
  storage.set(IS_SUPPORT_PASSIVE, isSupportPassive);
  return isSupportPassive;
})();

/* 保留小数位 */
export function RoundDecimal(value: number, digital: number = 2) {
  digital = Math.max(0, digital);
  return Number(value.toFixed(digital));
}

/* 转换弧度为角度 */
export function transToAngle(radian: number) {
  return (180 * radian) / Math.PI;
}

/* 转换角度为弧度 */
export function transToRadian(angle: number) {
  return (Math.PI * angle) / 180;
}
