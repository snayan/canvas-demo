import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { resolveByRootDir, exampleEntry } from '../script/util';

let { entry, variable } = exampleEntry();
let mainEntry = { ...entry };
let indexEntry = `index.${Date.now()}`;
mainEntry[indexEntry] = resolveByRootDir('index.ts');

const config: webpack.Configuration = {
  mode: 'development',
  entry: mainEntry,
  output: {
    path: resolveByRootDir('dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    modules: [resolveByRootDir('example'), resolveByRootDir('common'), 'node_modules'],
    alias: {
      '@': resolveByRootDir('example'),
      commom: resolveByRootDir('common'),
    },
  },
  devtool: 'inline-source-map',
  target: 'web',
  optimization: {
    splitChunks: false,
    minimize: false,
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env.ExampleModules': JSON.stringify(variable),
    }),
    new HtmlWebpackPlugin({
      title: 'canvas demo',
      chunks: [indexEntry],
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
};

export default config;
