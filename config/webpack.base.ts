import webpack from 'webpack';
import { resolveByRootDir, exampleEntry, DIST } from '../script/util';

let isProduction = process.env.NODE_ENV === 'production';

let { entry, variable } = exampleEntry();
let mainEntry = { ...entry };
let indexEntry = `index.${Date.now()}`;
mainEntry[indexEntry] = resolveByRootDir('index.ts');

const config: webpack.Configuration = {
  entry: mainEntry,
  output: {
    path: resolveByRootDir(DIST),
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
      {
        test: /\.(png|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images/',
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
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env.ExampleModules': JSON.stringify(variable),
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.WatchIgnorePlugin([/scss\.d\.ts/]),
  ],
};

export { indexEntry };

export default config;
