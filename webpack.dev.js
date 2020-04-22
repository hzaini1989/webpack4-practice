'use strict';
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin= require('friendly-errors-webpack-plugin')


const setMPA = ()=>{
  const entry = {}
  const htmlWebpackPlugin = []

  const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js'))

  Object.keys(entryFiles)
  .map((index)=>{
    const entryFile = entryFiles[index]

    ///Users/andy/Documents/demo/webpack-game/src/index/index.js
    const match = entryFile.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]

    entry[pageName] = entryFile
    htmlWebpackPlugin.push(
      new HtmlWebpackPlugin({
        template:path.join(__dirname,`/src/${pageName}/index.html`),
        filename:`${pageName}.html`,
        chunks:[pageName],
        inject:true,
        minify:{
          html5:true,
          collapseWhitespace:true,
          preserveLineBreaks:false,
          minifyCSS:true,
          minifyJS:true,
          removeComments:false
        }
      })
    )
    console.log(pageName)

  })

  // console.log(entries)

  return {
    entry,
    htmlWebpackPlugin
  }
}

const { entry,htmlWebpackPlugin } = setMPA()

module.exports = {
  entry:entry,
  output:{
    path : path.join(__dirname,'dist'),
    filename:'[name].js'
  },
  mode:'development',
  module:{
    rules:[
      {
        test: /.js$/,
        use:'babel-loader'
      },
      {
        test:/.css$/,
        use:[
          'style-loader',
          'css-loader'
        ]
      },
      {
        test:/.less$/,
        use:[
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test:/.(png|jpg|jpeg|gif)$/,
        use:[
          {
            loader:'file-loader',
            options:{
              limit:10240
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ].concat(htmlWebpackPlugin),
  devServer:{
    contentBase:'./dist',
    hot:true,
    stats:'errors-only'
  },
  devtool:'source-map'
}