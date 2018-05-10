import path from 'path';
import fs from 'fs';
import opn from 'opn';
import webpack from 'webpack';

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

export function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

export function openBrowser(url) {
  try {
    var options = { app: undefined };
    opn(url, options).catch(() => {});
    return true;
  } catch (err) {
    return false;
  }
}

export function formatMessage(stats: webpack.Stats) {
  return stats.toString({
    colors: true,
    hash: false,
    timings: false,
    performance: false,
    version: false,
    assets: false,
    entrypoints: false,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    warnings: true,
    errors: true,
  });
}
