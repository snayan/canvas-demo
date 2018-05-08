import * as path from 'path';
import * as fs from 'fs';
import * as opn from 'opn';
import childProcess from 'child_process';

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

export function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

export function openBrowser(url) {
  try {
    var options = { app: undefined };
    opn(url, options).catch(() => {});
  } catch (err) {
    return false;
  }
}
