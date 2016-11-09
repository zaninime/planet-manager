const NODE_ENV = process.env.NODE_ENV || 'development';

const webpack = require('webpack');
const path = require('path');

const join = path.join;
const resolve = path.resolve;

const getConfig = require('hjs-webpack');

const isDev = NODE_ENV === 'development';

// devServer config
const devHost   = process.env.HOST || '0.0.0.0';
const devPort   = process.env.PORT || 3001;

//const publicPath  = (isDev && setPublicPath) ? `//${devHost}:${devPort}/` : '';
const publicPath = '';

const root = resolve(__dirname);
const src = join(root, 'app');
const dest = join(root, 'dist', 'android');
//const css = join(src, 'styles');

var config = getConfig({
  cache: true,
  isDev: isDev,
  in: join(src, 'app.js'),
  out: dest,
  html: function (context) {
    return {
      'index.html': context.defaultTemplate({
        title: 'Planet Manager',
        publicPath,
        meta: {}
      })
    };
  }
});

if (!isDev) {
  config.devtool = 'source-map';
}

config.output.publicPath = '';
config.resolve.root = [__dirname];

config.resolve.extensions.push('.android.js');

const defines = {
  __NODE_ENV__: JSON.stringify(NODE_ENV),
  __DEBUG__: isDev
};

config.plugins = [
  new webpack.DefinePlugin(defines)
].concat(config.plugins);

config.plugins = config.plugins.filter(
  e => e.constructor.name !== 'UglifyJsPlugin'
).concat(new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false },
  output: { comments: false },
  sourceMap: true
}));

// Dev
if (isDev) {
  config.devServer.port = devPort;
  config.devServer.hostname = devHost;
}

module.exports = config;
