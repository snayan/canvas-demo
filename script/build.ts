import * as process from 'process';
import * as child_process from 'child_process';
import * as webpack from 'webpack';
import * as ora from 'ora';
import config from '../config/webpack.pro';

process.env.NODE_ENV = 'production';

let spinner = new ora.default();
spinner.start('start build\n');

const exec = child_process.exec;

exec(`rm -rf ${config.output.path}`, (err) => {
  if (err) {
    throw err;
  }
  webpack.default(config, (error: Error, stats: webpack.Stats) => {
    spinner.stop();
    if (error) {
      throw error;
    }
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: true,
        chunks: false,
        chunkModules: false,
      }) + '\n\n',
    );

    if (stats.hasErrors()) {
      process.exit(1);
    }
  });
});
