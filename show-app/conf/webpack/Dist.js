'use strict';

/**
 * Dist configuration. Used to build the
 * final output when running npm run dist.
 */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const WebpackBaseConfig = require('./Base');

class WebpackDistConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      mode:'production',
      cache: false,
      devtool: 'source-map',
      plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"production"',
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.ProvidePlugin({ adapter: ['webrtc-adapter', 'default'] }),
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

    // Deactivate hot-reloading if we run dist build on the dev server
    this.config.devServer.hot = false;
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env() {
    return 'dist';
  }
}

module.exports = WebpackDistConfig;
