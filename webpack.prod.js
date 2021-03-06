'use strict';
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const FriendlyErrorsWebpackPlugin= require('friendly-errors-webpack-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HappyPack = require('happypack');
const TerserPlugin = require('terser-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgecssPlugin= require('purgecss-webpack-plugin');


const smp = new SpeedMeasureWebpackPlugin()
const PATHS = {
  src: path.join(__dirname, 'src')
}

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
        chunks:['vendors',pageName],
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
    filename:'[name]_[chunkhash:8].js'
  },
  mode:'production',
  module:{
    rules:[
      {
        test: /.js$/,
        include: path.resolve('src'),
        use:[
          // {
          //   loader:'thread-loader',
          //   options:{
          //     workers:3
          //   }
          // },
          // 'babel-loader',
          // 'eslint-loader'
          'happypack/loader'
        ]
      },
      {
        test:/.css$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test:/.less$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader:'postcss-loader',
            options:{
              plugins:()=>[
                require('autoprefixer')({
                  overrideBrowserslist:['last 2 version','>1%','ios 7']
                })
              ]
            }
          },
          {
            loader:'px2rem-loader',
            options:{
              remUnit:75,
              remPrecesion:8
            }
          }
        ]
      },
      {
        test:/.(png|jpg|jpeg|gif)$/,
        use:[
          {
            loader:'file-loader',
            options:{
              name:'[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'[name]_[contenthash:8].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require('cssnano')
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',// 本地文件或者cdn文件
    //       global:'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
    //       global:'ReactDOM'
    //     },
    //   ],
    // })
    // new BundleAnalyzerPlugin(),
    new HappyPack({
      loaders: [ 'babel-loader' ]
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./build/library/library.json')
    }),
    new HardSourceWebpackPlugin(),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,{ nodir:true })
    })
  ].concat(htmlWebpackPlugin),
  // optimization: {
  //   splitChunks:{
  //     minSize:0,
  //     cacheGroups :{
  //       commons:{
  //         name:'common',
  //         chunks:'all',
  //         minChunks:2
  //       }
  //     }
  //   },
  //   minimizer:[
  //     new TerserPlugin({
  //       parallel:true,
  //       cache: true
  //     })
  //   ]
  // },
  resolve:{
    alias:{
      'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
      'react-dom':path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
    },
    extensions: ['.js'],
    mainFields: ['main']
  },
  // stats:'errors-only'
}