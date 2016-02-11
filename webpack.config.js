'use strict'

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'debug';
const GOOGLE_APIS_HOST = process.env.GOOGLE_APIS_HOST;
const environment = {NODE_ENV, GOOGLE_APIS_HOST}

console.log('environment:', environment)

module.exports = {
  devtool: getDevtool(),
  output: {
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: getTSLoader()
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
  entry: getEntryPoints(),
  plugins: getPlugins()
};

function getTSLoader() {
  if (NODE_ENV === 'debug') {
    return 'ts'
    
  } else {
    return [
      'babel?plugins=transform-es3-member-expression-literals',
      'ts'
    ].join('!')
  }
}

function getPlugins() {
  if (NODE_ENV === 'debug') {
    return [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({'process.env': JSON.stringify(environment)})
    ]
  } else {
    return [
      new webpack.DefinePlugin({'process.env': JSON.stringify(environment)})
    ]
  }
}

function getDevtool() {
  if (NODE_ENV === 'debug') {
    return 'eval-source-map'
  }
}

function getEntryPoints() {
  const common = [
    './node_modules/es5-shim/es5-shim.js',
    './node_modules/es5-shim/es5-sham.js',
    './node_modules/es6-shim/es6-shim.js',
    './node_modules/es6-shim/es6-sham.js',
    'normalize.css',
    './style.less',
    './src/app.tsx'
  ]
  if (NODE_ENV === 'debug') {
    return [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      ...common
    ]

  } else {
    return common
  }
}
