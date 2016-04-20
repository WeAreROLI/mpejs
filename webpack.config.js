var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
module.exports = {
    entry: {
        index: './src/index.js',
        sandbox: './src/sandbox.js'
    },
    output: {
        path: path.join(__dirname, 'lib'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
              test: path.join(__dirname, 'src'),
              loader: 'babel-loader',
              query: {
                  presets: [require.resolve('babel-preset-es2015')]
              }
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
      files: {
        js: [
          'lib/sandbox.js'
        ]
      },
      filename: 'sandbox.html',
      title: 'Web MIDI Sandbox',
      templateContent: 'Open the developer console to begin.'
    })]
};
