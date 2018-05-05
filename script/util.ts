import * as path from 'path';
import * as fs from 'fs';

export function resolveByRootDir(...paths: string[]) {
  return path.resolve(__dirname, '../', ...paths);
}

export function resolveExpamleDir() {
  let example = resolveByRootDir('example');
  return fs.readdirSync(example).map((v) => ['example', v]);
}

export function createIndex() {
  let index = resolveByRootDir('index.ts');
  fs.access(index, fs.constants.R_OK | fs.constants.W_OK, (err: NodeJS.ErrnoException) => {
    if (err) {
      throw err;
    }
  });
}
