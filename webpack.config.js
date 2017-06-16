var path = require('path');
var webpack = require('webpack');

var LIBRARY_NAME = 'mpe';

// Plugins
var nodeProductionEnvPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"',
});
var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
  },
});

// Loaders
var babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    // Using require.resolve to fix dependency issues when using `npm link`
    presets: [require.resolve('babel-preset-es2015')],
  },
};

// Env-specific options
var env = process.env.WEBPACK_ENV;

if (env === 'dev') {
  var webpackConfig = {
    name: 'global',
    devtool: 'source-map',
    entry: {
      mpe: './src/global.js',
    },
    output: {
      path: path.join(__dirname, 'lib'),
      filename: '[name].js',
      libraryTarget: 'var',
      library: LIBRARY_NAME,
    },
    module: {
      loaders: [babelLoader],
    },
  };
}
if (env === 'build') {
  var webpackConfig = [
    {
      name: 'umd',
      entry: { index: './src' },
      output: {
        path: path.join(__dirname, 'lib'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: LIBRARY_NAME,
        umdNamedDefine: true,
      },
      target: 'node',
      module: {
        loaders: [babelLoader],
      },
      plugins: [nodeProductionEnvPlugin],
    },
    {
      name: 'global',
      entry: {
        mpe: './src/global.js',
      },
      output: {
        path: path.join(__dirname, 'lib'),
        filename: '[name].js',
        libraryTarget: 'var',
        library: LIBRARY_NAME,
      },
      module: {
        loaders: [babelLoader],
      },
      plugins: [nodeProductionEnvPlugin],
    },
    {
      name: 'globalMinified',
      entry: { mpe: './src/global.js' },
      output: {
        path: path.join(__dirname, 'lib'),
        filename: '[name].min.js',
        libraryTarget: 'var',
        library: LIBRARY_NAME,
      },
      module: {
        loaders: [babelLoader],
      },
      plugins: [uglifyPlugin, nodeProductionEnvPlugin],
    },
  ];
}

module.exports = webpackConfig;
