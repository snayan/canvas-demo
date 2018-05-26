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
