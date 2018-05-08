export function getQuery() {
  let search = window.location.search;
  let query = Object.create(null);
  if (!search) {
    return query;
  }
  let reg = /\?(\w+)=(\w+)/g;
  let matchs = null;
  while ((matchs = reg.exec(search))) {
    query[matchs[1]] = matchs[2];
  }
  return query;
}

export function isSignleModule(m: string) {
  let query = getQuery();
  return query && query.module === m;
}
