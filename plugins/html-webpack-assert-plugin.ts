import webpack from 'webpack';
import path from 'path';
import { resolveByRootDir, DIST } from '../script/util';

class HtmlWebpackAssertPlugin {
  chunks: string[];
  title: string;
  constructor({ chunks, title }: { chunks: string[]; title: string }) {
    this.chunks = chunks;
    this.title = title;
  }
  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync('emit', (compilation, callback) => {
      //  generated file:
      var filelist = `
<!DOCTYPE html>
<html>
    <head>
    <meta charset="UTF-8">
    <title>${this.title}</title>
    </head>
<body>
    ${this.chunks
      .map((chunk) => {
        let url = this.assert(compilation, chunk);
        url = path.relative(resolveByRootDir(), path.join(DIST, url));
        return `<script type="text/javascript" src="${url}"></script>`;
      })
      .join('\n')}
</body>
</html>`;
      // Insert this list into the webpack build as a new file asset:
      compilation.assets[path.relative(resolveByRootDir(DIST), 'index.html')] = {
        source: function() {
          return filelist;
        },
        size: function() {
          return filelist.length;
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
