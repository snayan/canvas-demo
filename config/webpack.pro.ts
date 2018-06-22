process.env.NODE_ENV = 'production';

import webpack from 'webpack';
import merge from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import { resolveByRootDir, DIST } from '../script/util';
import baseConfig from './webpack.base';

const config: webpack.Configuration = {
  mode: 'production',
  devtool: false,
  output: {
    path: resolveByRootDir(DIST),
    filename: '[name].[chunkhash].js',
    publicPath: '/canvas-demo/' + DIST + '/',
  },
  optimization: {
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
        cache: true,
        uglifyOptions: {
          ecma: 6,
          mangle: true,
          compress: {
            drop_debugger: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              importLoaders: 2,
              modules: true,
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([DIST], { root: resolveByRootDir() }),
    new HtmlWebpackPlugin({
      template: 'template.html',
      filename: '../index.html',
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'workbox',
      exclude: [/\.htm$/, /\.html$/],
    }),
  ],
};

export default merge(baseConfig, config);
