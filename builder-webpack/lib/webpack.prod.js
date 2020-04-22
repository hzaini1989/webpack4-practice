const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')


const prodConfig = {
  mode:'production',
  plugins:[
    new OptimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require('cssnano')
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',// 本地文件或者cdn文件
          global:'React'
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global:'ReactDOM'
        },
      ],
    })
  ],
  optimization: {
    splitChunks:{
      minSize:0,
      cacheGroups :{
        commons:{
          name:'common',
          chunks:'all',
          minChunks:2
        }
      }
    }
  },
}

module.exports = merge(baseConfig,prodConfig)



