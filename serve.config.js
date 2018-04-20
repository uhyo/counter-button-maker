const path = require('path');
// const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const convert = require('koa-connect');
const config = require('config');

module.exports = {
  host: '0.0.0.0',
  content: path.join(__dirname, '../'),
  add: (app, middleware, options) => {
    // proxy to application server
    // webpack-serve setting for path fallbacks.
    /*
    const historyOptions = {};

    app.use(convert(history(historyOptions)));
    */
    // proxy to application server.
    app.use(
      convert(
        proxy(['/*'], {
          target: `http://localhost:${config.server.port}`,
        }),
      ),
    );
  },
};
