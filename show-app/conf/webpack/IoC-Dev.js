'use strict';

/**
 * Default dev server configuration.
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const WebpackBaseConfig = require('./Base');

class WebpackIoCDevConfig extends WebpackBaseConfig {

  constructor(workers) {
    super(workers);
    let entry = {
      attendee:[
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../../attendee/src/client.js')
      ],
      actor:[
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../../actor/src/client.js')
      ],
      admin:[
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../../admin/src/client.js')
      ],
      guide:[
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../../guide/src/client.js')
      ],
      host:[
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../../host/src/client.js')
      ],
      navtest:[
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../../navtest/src/client.js')
      ],
    };

    workers.map(worker => {
      entry[worker] = [
        'webpack-dev-server/client?http://0.0.0.0:8000/',
        'webpack/hot/only-dev-server',
        `${this.customPathAbsolute}/custom/${worker}.js`
      ];
    });
    this.config = {
      devtool: 'cheap-module-source-map',
      entry,
      mode: 'development',
      output: {
        path: path.resolve('./dist'),
        filename: 'assets/[name].[hash].js',
        publicPath: '/',
        globalObject: 'this'
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({ adapter: 'webrtc-adapter' }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../../attendee/src/index.html'),
          templateParameters: {
          },
          chunks: ['attendee'],
          filename: 'attendee/index.html'
        }),
        new PreloadWebpackPlugin({
          rel: 'preload',
          fileWhitelist: [/worker/],
          include: 'allAssets'
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../../actor/src/index.html'),
          templateParameters: {
          },
          chunks: ['actor'],
          filename: 'actor/index.html'
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../../admin/src/index.html'),
          templateParameters: {
          },
          chunks: ['admin'],
          filename: 'admin/index.html'
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../../guide/src/index.html'),
          templateParameters: {
          },
          chunks: ['guide'],
          filename: 'guide/index.html'
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../../host/src/index.html'),
          templateParameters: {
          },
          chunks: ['host'],
          filename: 'host/index.html'
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../../navtest/src/index.html'),
          templateParameters: {
          },
          chunks: ['navtest'],
          filename: 'navtest/index.html'
        }),
      ]
    };
  }
}

module.exports = WebpackIoCDevConfig;
