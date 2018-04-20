const path = require('path');
const WebpackNodeExternals = require('webpack-node-externals');
const base = require('./webpack.base.js');

module.exports = Object.assign({}, base, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../server/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist-server/'),
    filename: 'index.js',
  },
  externals: [WebpackNodeExternals()],
});
