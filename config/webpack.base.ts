import webpack from 'webpack';
import { resolveByRootDir, DIST } from '../script/util';

let isProduction = process.env.NODE_ENV === 'production';

const config: webpack.Configuration = {
  entry: resolveByRootDir('index.ts'),
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
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images/',
              publicPath: isProduction ? `${DIST}/images/` : '',
            },
          },
        ],
      },
      {
        test: /\.(mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'media/',
              publicPath: isProduction ? `${DIST}/media/` : '',
            },
          },
        ],
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
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
};

export default config;
