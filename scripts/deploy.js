'use strict'

global.DEPLOYING = true

const path = require('path')
const fs = require('fs.extra')
const ghpages = require('gh-pages')
const webpack = require('webpack')
const config = require('../webpack.config')

fs.rmrfSync('./dist')
fs.mkdirRecursiveSync('./dist')
fs.copyRecursive('static', './dist', function(err, stats) {
  if (err) {
    console.error(err)
    return
  }
  
  webpack(config, function(err, stats) {
    if (err) {
      console.error(err)
      return
    }
    
    const publishOpts = {
      logger: console.log.bind(console),
      tag: bump(),
      message: 'Deploy'
    }

    ghpages.publish('dist', publishOpts, function(err, stats) {
      if (err) {
        console.error(err)
        return
      }
    })
  })
})

function bump() {
  const config = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  const matches = (config.version || '').match(/(\d*)\.(\d*)\.(\d*)/)
  if (matches) {
    const major = matches[1], minor = matches[2], patch = matches[3]
    
    config.version = [major, minor, 1 + parseInt(patch)].join('.')
    
  } else {
    config.version = '1.0.0'
  }
  
  fs.writeFileSync('package.json', JSON.stringify(config, null, 2))
  console.log('version', config.version)
  
  return config.version
}
