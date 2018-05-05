import * as webpack from 'webpack';
import { resolveByRootDir, resolveExpamleDir } from '../script/util';

let examples = resolveExpamleDir().reduce((examplesObj, subDir) => {
  examplesObj[subDir.join('/')] = resolveByRootDir(...subDir, 'index.ts');
  return examplesObj;
}, {});

const config: webpack.Configuration = {
  mode: 'development',
  entry: { index: resolveByRootDir('index.ts'), ...examples },
  output: {
    path: resolveByRootDir('dist'),
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    modules: [resolveByRootDir('example'), 'node_modules'],
    alias: {
      '@': resolveByRootDir(),
    },
  },
  target: 'web',
};

export default config;
