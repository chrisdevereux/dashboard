'use strict'

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer')

const config = getConfig()
console.log('config:', config)

module.exports = {
  devtool: getDevtool(),
  output: {
    path: 'dist',
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
        loader: 'style!css!postcss'
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
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
  plugins: getPlugins(),
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          'Chrome >=36',
          'Firefox >= 4',
          'IE >= 8',
          '> 1%'
        ]
      })
    ]
  }
};

function getTSLoader() {
  if (config.NODE_ENV === 'debug') {
    return 'ts'
    
  } else {
    return [
      'babel?plugins=transform-es3-member-expression-literals',
      'ts'
    ].join('!')
  }
}

function getPlugins() {
  if (config.NODE_ENV === 'debug') {
    return [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({'process.env': JSON.stringify(config)})
    ]
    
  } else {
    return [
      new webpack.DefinePlugin({'process.env': JSON.stringify(config)}),
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: false
      //   }
      // }),
      // new webpack.optimize.OccurrenceOrderPlugin(true),
      // new webpack.optimize.DedupePlugin()
    ]
  }
}

function getDevtool() {
  if (config.NODE_ENV === 'debug') {
    return 'eval-source-map'
  }
}

function getEntryPoints() {
  const common = [
    'normalize.css',
    './style.less',
    './src/app.tsx'
  ]
  if (config.NODE_ENV === 'debug') {
    return [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      ...common
    ]

  } else {
    return [
      './node_modules/es5-shim/es5-shim.js',
      './node_modules/es5-shim/es5-sham.js',
      './node_modules/es6-shim/es6-shim.js',
      './node_modules/es6-shim/es6-sham.js',
      ...common
    ]
  }
}

function getConfig() {
  if (global.DEPLOYING) {
    return {NODE_ENV: 'production'}

  } else {
    return {
      NODE_ENV: process.env.NODE_ENV || 'debug',
      GOOGLE_APIS_HOST: process.env.GOOGLE_APIS_HOST || null
    }
  }
}
