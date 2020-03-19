const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');

const ROOT = path.resolve(__dirname, 'app');
const DESTINATION = path.resolve(__dirname, 'dist/');
const isProd = (process.env.NODE_ENV === 'production');
const PUBLIC_URL = isProd? process.env.PUBLIC_URL : '/'

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      API_URL: JSON.stringify(process.env.API_URL),
    }
  }),
  new webpack.ProgressPlugin(),
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: './index.html',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new ExtractTextPlugin({
    filename: 'style.[hash].css',
    allChunks: true,
  }),
]

if (!isProd) {
  plugins.push(new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerPort: 9191
  }))
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  watch: !isProd,
  context: ROOT,
  entry: {
    app: './index.tsx'
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: DESTINATION,
    chunkFilename: 'js/[name].[hash].bundle.js',
    publicPath: PUBLIC_URL
  },
  // TODO: change after release to '' : 'cheap-module-eval-source-map'
  // devtool: isProd ? 'eval-source-map' : 'cheap-module-eval-source-map',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, DESTINATION),
    allowedHosts: [
      ''
    ],
    historyApiFallback: true,
    disableHostCheck: true,
    compress: true,
    port: 9999
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'async',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        },
        vendor: {
          chunks: 'all',
          test: /node_modules/
        }
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', 'jsx', '.js', '.svg', '.png', '.jpeg', 'jpg',
      '.json', '.css', '.scss', '.saas'
    ],
    modules: [
      ROOT,
      'node_modules'
    ]
  },
  plugins: plugins,
  node: {
    fs: 'empty',
    fsevents: 'empty'
  },
  target: 'web',
  module: {
    rules: [{
        test: /\.ts$/,
        enforce: 'pre',
        exclude: /(node_modules)/,
        loader: 'tslint-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        options: {
          useCache: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory([
                {
                  libraryName: '@material-ui/icons',
                  libraryDirectory: 'esm',
                  camel2DashComponentName: false
                },
                {
                  camel2DashComponentName: false,
                  libraryDirectory: "esm",
                  libraryName: "@material-ui/core"
                },
                {
                  camel2DashComponentName: false,
                  libraryDirectory: "esm",
                  libraryName: "@material-ui/core/styles"
                },
                {
                  camel2DashComponentName: false,
                  libraryDirectory: "esm",
                  libraryName: "@material-ui/core/colors"
                },
                {
                  libraryName: '@material-ui/lab',
                  libraryDirectory: 'esm',
                  camel2DashComponentName: false
                },
                {
                  libraryName: 'date-fns',
                  libraryDirectory: 'esm',
                  camel2DashComponentName: false,
                }
              ])
            ]
          }),
        }
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
          }, 'resolve-url-loader', 'postcss-loader', 'sass-loader']
        }),
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 512,
            quality: 85,
            name: '[path][name].[ext]',
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
