process.env.NODE_ENV = 'production';

import webpack from 'webpack';
import merge from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackAssertPlugin from '../plugins/html-webpack-assert-plugin';
import { resolveByRootDir, DIST } from '../script/util';
import baseConfig, { indexEntry } from './webpack.base';

const config: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    splitChunks: {},
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
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
    new HtmlWebpackAssertPlugin({
      title: 'canvas demo',
      chunks: [indexEntry],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
  ],
};

export default merge(baseConfig, config);
