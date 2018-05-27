/* translate query to object */
export function getQuery() {
  let search = window.location.search;
  let query = Object.create(null);
  if (!search) {
    return query;
  }
  let reg = /\?(\w+)=(\w+)/g;
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
