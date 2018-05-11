import webpack from 'webpack';
import merge from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { resolveByRootDir } from '../script/util';
import baseConfig from './webpack.base';

const config: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    splitChunks: {},
    minimize: true,
  },
  plugins: [new CleanWebpackPlugin(['docs'], { root: resolveByRootDir() })],
};

export default merge(baseConfig, config);
