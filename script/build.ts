import process from 'process';
import webpack from 'webpack';
import ora from 'ora';
import config from '../config/webpack.pro';

let spinner = new ora();
spinner.start('start build\n');

webpack(config, (error: Error, stats: webpack.Stats) => {
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
