'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"\\192.168.101.163"',
  
  BASE_API: '"https://api-dev"', //修改为'"https://api-prod"'就行了
  // API_ROOT: '""'
})
