import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolveByRootDir, exampleEntry } from '../script/util';

let { entry, variable } = exampleEntry();
let mainEntry = { ...entry };
let indexEntry = `index.${Date.now()}`;
mainEntry[indexEntry] = resolveByRootDir('index.ts');

const config: webpack.Configuration = {
  entry: mainEntry,
  output: {
    path: resolveByRootDir('docs'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [resolveByRootDir('example'), resolveByRootDir('common'), 'node_modules'],
    alias: {
      '@': resolveByRootDir('example'),
      common: resolveByRootDir('common'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [resolveByRootDir('index.ts'), resolveByRootDir('example'), resolveByRootDir('common')],
        exclude: /node_modules/,
      },
    ],
  },
  target: 'web',
  stats: {
    assets: true,
    colors: true,
    errors: true,
    warnings: true,
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
