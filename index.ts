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

const ExampleModules: string[] = (<any>window).ExampleModules;

function loadExampleModule() {
  let query = getQuery();
  let modules = query && query.module ? [query.module] : ExampleModules;
}

function main() {
  console.log();
}

main();
