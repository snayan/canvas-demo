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

export const STORAGE_PREFIX = 'CANVAS_DEMO';

export function setStorage(name, value) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}_${name}`, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export function getStorage(name) {
  try {
    return JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}_${name}`));
  } catch (e) {
    return null;
  }
}
