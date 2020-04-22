const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugin = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];

      // /Users/andy/Documents/demo/webpack-game/src/index/index.js
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];

      entry[pageName] = entryFile;
      return htmlWebpackPlugin.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `/src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['vendors', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        }),
      );
    });

  // console.log(entries)

  return {
    entry,
    htmlWebpackPlugin,
  };
};

const { entry, htmlWebpackPlugin } = setMPA();

module.exports = {
  entry,
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
          // 'eslint-loader'
        ],
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecesion: 8,
            },
          },
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ].concat(htmlWebpackPlugin),
  stats: 'errors-only',
};
