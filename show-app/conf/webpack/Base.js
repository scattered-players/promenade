'use strict';  // eslint-disable-line

/**
 * Webpack configuration base class
 */
const fs = require('fs');
const path = require('path');

const npmBase = path.join(__dirname, '../../node_modules');

class WebpackBaseConfig {

  constructor(workers) {
    this.workers = workers || [];
    this._config = {};
  }

  /**
   * Get the list of included packages
   * @return {Array} List of included packages
   */
  get includedPackages() {
    return [].map((pkg) => fs.realpathSync(path.join(npmBase, pkg)));
  }

  /**
   * Set the config data.
   * This will always return a new config
   * @param {Object} data Keys to assign
   * @return {Object}
   */
  set config(data) {
    this._config = Object.assign({}, this.defaultSettings, data);
    return this._config;
  }

  /**
   * Get the global config
   * @return {Object} config Final webpack config
   */
  get config() {
    return this._config;
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env() {
    return 'dev';
  }

  /**
   * Get the absolute path to src directory
   * @return {String}
   */
  get srcPathAbsolute() {
    return path.resolve(__dirname, '../..');
  }

  /**
   * Get the absolute path to src directory
   * @return {String}
   */
  get customPathAbsolute() {
    return path.resolve('.');
  }

  /**
   * Get the absolute path to tests directory
   * @return {String}
   */
  get testPathAbsolute() {
    return path.resolve('./test');
  }

  /**
   * Get the default settings
   * @return {Object}
   */
  get defaultSettings() {
    const cssModulesQuery = {
      modules: true,
      importLoaders: 1,
      localIdentName: '[name]-[local]-[hash:base64:5]'
    };

    let entry = {
      admin: ['./admin/src/client.js'],
      actor: ['./actor/src/client.js'],
      attendee: ['./attendee/src/client.js'],
      guide: ['./guide/src/client.js'],
      host: ['./host/src/client.js'],
      navtest: ['./navtest/src/client.js'],
    };

    this.workers.map(worker => {
      entry[worker] = [`${this.customPathAbsolute}/custom/${worker}.js`];
    });

    const options = {
      context: this.srcPathAbsolute,
      devtool: 'eval',
      devServer: {
        contentBase: './root/',
        publicPath: '/',
        contentBasePublicPath: '/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        compress: false,
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            pathRewrite: {'^/api' : ''},
            ws: true
          }
        },
        host: '0.0.0.0',
        open: true
      },
      module: {
        rules: [
          {
            enforce: 'pre',
            test: /\.js?$/,
            include: [
              `${this.customPathAbsolute}/custom/`,
              `${this.srcPathAbsolute}/config/`,
              `${this.srcPathAbsolute}/admin/src/`,
              `${this.srcPathAbsolute}/actor/src/`,
              `${this.srcPathAbsolute}/attendee/src/`,
              `${this.srcPathAbsolute}/guide/src/`,
              `${this.srcPathAbsolute}/host/src/`,
              `${this.srcPathAbsolute}/navtest/src/`,
            ],
            loader: 'babel-loader',
            query: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    "modules": "commonjs"
                  }
                ],
                "@babel/preset-react"
              ]
            }
          },
          {
            test: /^.((?!cssmodule).)*\.css$/,
            loaders: [
              { loader: 'style-loader' },
              { loader: 'css-loader' }
            ]
          },
          {
            test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2)$/,
            loader: 'file-loader'
          },
          {
            test: /^.((?!cssmodule).)*\.(sass|scss)$/,
            loaders: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        'autoprefixer',
                        {
                          // Options
                        },
                      ],
                    ],
                  },
                },
              },
              { loader: 'sass-loader' }
            ]
          },
          {
            test: /^.((?!cssmodule).)*\.less$/,
            loaders: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'less-loader' }
            ]
          },
          {
            test: /^.((?!cssmodule).)*\.styl$/,
            loaders: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'stylus-loader' }
            ]
          },
          {
            test: /\.(js|jsx)$/,
            include: [
              this.includedPackages,
              `${this.customPathAbsolute}/custom/`,
              `${this.srcPathAbsolute}/config/`,
              `${this.srcPathAbsolute}/admin/src/`,
              `${this.srcPathAbsolute}/actor/src/`,
              `${this.srcPathAbsolute}/attendee/src/`,
              `${this.srcPathAbsolute}/guide/src/`,
              `${this.srcPathAbsolute}/host/src/`,
              `${this.srcPathAbsolute}/navtest/src/`,
            ],
            loaders: [
              // Note: Moved this to .babelrc
              { loader: 'babel-loader' }
            ]
          },
          {
            test: /\.cssmodule\.(sass|scss)$/,
            loaders: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                query: cssModulesQuery
              },
              { loader: 'sass-loader' }
            ]
          },
          {
            test: /\.cssmodule\.css$/,
            loaders: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                query: cssModulesQuery
              }
            ]
          },
          {
            test: /\.cssmodule\.less$/,
            loaders: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                query: cssModulesQuery
              },
              { loader: 'less-loader' }
            ]
          },
          {
            test: /\.cssmodule\.styl$/,
            loaders: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                query: cssModulesQuery
              },
              { loader: 'stylus-loader' }
            ]
          },
          {
            test: require.resolve('janus-gateway'),
            use: 'exports-loader?Janus=Janus'
          },
          {
            test: /\.glsl$/i,
            loader: 'raw-loader'
          }
        ]
      },
      entry,
      output: {
        path: path.resolve('./dist'),
        filename: 'assets/[name].[contenthash].js',
        publicPath: '/'
      },
      plugins: [],
      // optimization: {
      //   // runtimeChunk: 'single',
      //   splitChunks: {
      //     cacheGroups: {
      //       vendors: {
      //         test: /[\\/]node_modules[\\/]/,
      //         name: 'vendors',
      //         chunks: 'all'
      //       }
      //     }
      //   }
      // },
      resolve: {
        // unsafeCache: true,
        alias: {
          'react-dom':'@hot-loader/react-dom',
          config: `${this.srcPathAbsolute}/config/${this.env}.js`,
          custom: `${this.customPathAbsolute}/custom/`
        },
        extensions: ['.js', '.jsx'],
        modules: [
          'node_modules'
        ]
      }
    };

    if(process.env['USE_SSL'] === 'true'){
      options.devServer.https = {
        key: fs.readFileSync('certs/cert-key.pem'),
        cert: fs.readFileSync('certs/cert.pem')
      }
      // options.devServer.key = fs.readFileSync('certs/cert-key.pem');
      // options.devServer.cert = fs.readFileSync('certs/cert.pem');
      // console.log('CERT', options.devServer.cert)
    }

    return options;
  }
}

module.exports = WebpackBaseConfig;
