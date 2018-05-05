import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolveByRootDir, resolveExpamleDir } from '../script/util';

let examples = resolveExpamleDir().reduce((examplesObj, subDir) => {
  examplesObj[subDir.join('/')] = resolveByRootDir(...subDir, 'index.ts');
  return examplesObj;
}, {});

const config: webpack.Configuration = {
  mode: 'production',
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
  optimization: {
    splitChunks: {},
    minimize: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackPlugin({
      title: 'canvas demo',
      chunks: ['index'],
    }),
  ],
};

export default config;
