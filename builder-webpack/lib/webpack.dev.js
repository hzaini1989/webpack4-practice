const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')


const devConfig = {
  mode:'production',//
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer:{
    contentBase:'./dist',
    hot:true,
    stats:'errors-only'
  },
  devtool:'source-map'

}

module.exports = merge(baseConfig,devConfig)