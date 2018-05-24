import webpack from 'webpack';
import path from 'path';
import { resolveByRootDir, DIST } from '../script/util';

class HtmlWebpackAssertPlugin {
  chunks: string[];
  title: string;
  dev: boolean;
  constructor({ chunks, title, dev = true }: { chunks: string[]; title: string; dev?: boolean }) {
    this.chunks = chunks;
    this.title = title;
    this.dev = dev;
  }
  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync('emit', (compilation, callback) => {
      //  generated file:
      var fidelis = `
<!DOCTYPE html>
<html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">
    <title>${this.title}</title>
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
    </head>
<body>
    ${this.chunks
      .map((chunk) => {
        let url = this.assert(compilation, chunk);
        if (!this.dev) {
          url = path.relative(resolveByRootDir(), path.join(DIST, url));
        }
        return `<script type="text/javascript" src="${url}"></script>`;
      })
      .join('\n')}
</body>
</html>`;
      let paths = this.dev ? 'index.html' : path.relative(resolveByRootDir(DIST), 'index.html');
      // Insert this list into the webpack build as a new file asset:
      compilation.assets[paths] = {
        source: function() {
          return fidelis;
        },
        size: function() {
          return fidelis.length;
        },
      };

      callback();
    });
  }
  assert(compilation: webpack.compilation.Compilation, chunk: string) {
    let chunks = compilation.chunks;
    for (let i = 0, j = chunks.length; i < j; i++) {
      if (chunks[i].name === chunk) {
        return chunks[i].files.reduce((s, v) => {
          if (!s && /\.js$/.test(v)) {
            s = v;
          }
          return s;
        }, '');
      }
    }
    return null;
  }
}

export default HtmlWebpackAssertPlugin;
