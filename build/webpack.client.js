const path = require('path');
const base = require('./webpack.base.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = Object.assign({}, base, {
  plugins: base.plugins.concat([
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../html/index.html'),
    }),
  ]),
  serve: {
    host: '0.0.0.0',
    add: (app, middleware, options) => {
      // webpack-serve setting for path fallbacks.
      const historyOptions = {};

      app.use(convert(history(historyOptions)));
    },
  },
});
