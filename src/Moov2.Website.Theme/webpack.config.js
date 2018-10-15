const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = [{
  name: 'js',
  entry: './Assets/js/index.js',
  output: {
    path: path.resolve(__dirname, './wwwroot/Scripts'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /.*\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  resolve: {
    modules: [
      './Assets/js/src',
      './node_modules/fontfaceobserver',
      './node_modules/shoestring/dist'
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, './Assets/js/vendor/modernizr.min.js'), to: path.resolve(__dirname, './wwwroot/Scripts/vendor/modernizr.min.js') },
      { from: path.resolve(__dirname, './Assets/js/vendor/picturefill.min.js'), to: path.resolve(__dirname, './wwwroot/Scripts/vendor/picturefill.min.js') }
    ])
  ]
}, {
  name: 'js-tests',
  entry: './Assets/js/tests/suite.js',
  output: {
    path: path.resolve(__dirname, './wwwroot/Scripts/tests'),
    filename: 'suite.bundle.js'
  },
  module: {
    rules: [{
      test: /.*\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  resolve: {
    modules: [
      './Assets/js/src',
      './Assets/js/tests/src',
      './node_modules/fontfaceobserver',
      './node_modules/shoestring/dist'
    ]
  }
}, {
  name: 'css',
  entry: {
    main: './Assets/css/Site.scss'
  },
  output: {
    path: path.resolve(__dirname, './wwwroot/Styles')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'Site',
          test: /\.scss$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [autoprefixer('last 1 version', 'ie 10')]
            }
          }
        }, {
          loader: 'sass-loader'
        }],
      }, {
        test: /\.(png|jpg|gif|.svg)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, './Assets/content/'), to: path.resolve(__dirname, './wwwroot/Content/') }
    ])
  ]
}]