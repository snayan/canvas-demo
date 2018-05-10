import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base';

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    splitChunks: false,
    minimize: false,
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()],
};

export default merge(baseConfig, config);
