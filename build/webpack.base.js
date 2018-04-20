const webpack = require('webpack');
const path = require('path');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  mode: production ? 'production' : 'development',
  entry: {
    app: path.join(__dirname, '../src/client-init.tsx'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/assets/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [],
};
