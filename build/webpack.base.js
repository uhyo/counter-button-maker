const webpack = require('webpack');
const path = require('path');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  mode: production ? 'production' : 'development',
  entry: {
    app: path.join(__dirname, '../src/client-init.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
    ],
  },
  plugins: [],
};
