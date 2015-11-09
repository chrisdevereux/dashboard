'use strict'

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'preview';
const environment = {
  NODE_ENV
};

module.exports = {
  devtool: 'eval-source-map',
  output: {
    publicPath: '/'
  },
  resolve: ['.js', '.jsx', '.ts', '.tsx'],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file"
      }
    ]
  },
  entry: (
    NODE_ENV === 'preview' ? [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'normalize.css',
      './style.less',
      './src/app.tsx'
    ] : []
  ),
  plugins: (
    NODE_ENV === 'preview' ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(environment)
      })
    ] : [,
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(environment)
      })
    ]
  )
};
