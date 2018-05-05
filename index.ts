function getQuery() {
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

function createScriptDom(src) {
  let script = document.createElement('script');
  script.src = src;
  return script;
}

function loadScript() {
  let query = getQuery();
  let src = query ? query.module : 'index';
  let script = createScriptDom(src);
  document.body.appendChild(script);
}

loadScript();
