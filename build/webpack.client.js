const path = require('path');
const base = require('./webpack.base.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

module.exports = Object.assign({}, base, {
  plugins: base.plugins.concat([
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../html/index.html'),
    }),
    new WebpackManifestPlugin(),
  ]),
});
