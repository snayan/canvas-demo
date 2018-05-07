import * as path from 'path';
import * as fs from 'fs';

export function resolveByRootDir(...paths: string[]) {
  return path.resolve(__dirname, '../', ...paths);
}

export function resolveExpamleDir() {
  let example = resolveByRootDir('example');
  return fs.readdirSync(example);
}

export function exampleEntry() {
  let modules = resolveExpamleDir();
  let current = Date.now();
  let buildEntry = modules.reduce((entries, example) => {
    entries[`${example}.${current}`] = resolveByRootDir('example', example, 'index.ts');
    return entries;
  }, {});
  let globalVariable = modules.reduce((variable, example) => {
    variable[example] = `${example}.${current}.js`;
    return variable;
  }, {});
  return {
    entry: buildEntry,
    variable: globalVariable,
  };
}

export function createIndex() {
  let index = resolveByRootDir('index.ts');
  fs.access(index, fs.constants.R_OK | fs.constants.W_OK, (err: NodeJS.ErrnoException) => {
    if (err) {
      throw err;
    }
  });
}
