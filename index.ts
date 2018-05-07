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

function success() {
  console.log('load module success');
}

function fail() {
  console.log('load module fail');
}

function main() {
  let query = getQuery();
  let example = query.module || 'main';
  let script = document.createElement('script');
  script.onload = success;
  script.onerror = fail;
  script.src = process.env.ExampleModules[example];
  document.body.appendChild(script);
}

/* 主函数 */
main();
