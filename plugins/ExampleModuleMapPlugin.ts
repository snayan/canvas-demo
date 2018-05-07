import * as webpack from 'webpack';

type Compilation = webpack.compilation.Compilation & {
  hooks: {
    htmlWebpackPluginAlterChunks: {
      tap: (name: string, cb: (data: any, cb: any) => void) => void;
    };
    htmlWebpackPluginBeforeHtmlGeneration: {
      tapAsync: (name: string, cb: (data: any, cb: any) => void) => void;
    };
    htmlWebpackPluginAfterHtmlProcessing: {
      tapAsync: (name: string, cb: (data: any, cb: any) => void) => void;
    };
  };
};

class ExampleModuleMapPlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap('ExampleModuleMapPlugin', (compilation: Compilation) => {
      let fileMap;
      // let fileMap = compilation.chunks.reduce((file, chunk) => {
      //   file[chunk.name.replace('example/', '')] = chunk.files[0];
      //   return file;
      // }, {});
      // console.log(fileMap);
      // new webpack.DefinePlugin({a:JSON.stringify('1')}).apply(compiler);
      compilation.hooks.htmlWebpackPluginAlterChunks.tap('ExampleModuleMapPlugin', (data, pluginRef) => {
        fileMap = data.reduce((file, chunk) => {
          file[chunk.names[0].replace('example/', '')] = chunk.files[0];
          return file;
        }, {});
        // console.log(pluginRef.plugin.options);
        
        pluginRef.plugin.options.chunks = 'index';
      });
      compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync('ExampleModuleMapPlugin', (data, cb) => {
        console.log(data);
        cb(null, data);
      });
      // compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('ExampleModuleMapPlugin', (data, cb) => {
      //   data.html += `The Magic Footer`;
      //   console.log(data);
      //   cb(null, data);
      //   // callback();
      // });
    });
  }
}

export default ExampleModuleMapPlugin;
