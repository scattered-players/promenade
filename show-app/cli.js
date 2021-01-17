#!/usr/bin/env node

'use strict';

/* eslint no-console: "off" */
const { argv } = require('yargs')
  .option('env', {
    describe: 'which build environment (dev or dist)'
  })
  .demandOption(['env'], 'Please provide an environment')
  .array('workers')
  .default('workers', []);
console.log('HEYO')
console.log('YAR', argv);
const webpack = require('webpack');
const webpackConfigs = require('./conf/webpack');


const configName = argv.env ? `ioc${argv.env}` : null;
console.log('CONFIG NAME', configName)
const defaultConfig = 'iocdev';
// If there was no configuration give, assume default
const requestedConfig = configName || defaultConfig;

// Return a new instance of the webpack config
// or the default one if it cannot be found.
let LoadedConfig = defaultConfig;

if (webpackConfigs[requestedConfig] !== undefined) {
  LoadedConfig = webpackConfigs[requestedConfig];
} else {
  console.warn(`
    Provided environment "${configName}" was not found.
    Please use one of the following ones:
    ${Object.keys(webpackConfigs).join(' ')}
  `);
  LoadedConfig = webpackConfigs[defaultConfig];
}

const loadedInstance = new LoadedConfig(argv.workers);

// Set the global environment
process.env.NODE_ENV = loadedInstance.env;

console.log('PACKING...', loadedInstance.config);
if(requestedConfig === 'iocdist'){
  webpack(loadedInstance.config, (err, stats) => { // Stats Object
    if (err || stats.hasErrors()) {
      // Handle errors here
      console.log('OHNO!',err);
      // console.log('OHNO!', err, stats.toString({
      //   // Add console colors
      //   colors: true
      // }));
    }
    console.log('DONE!')
    // Done processing
  });
}


if(requestedConfig === 'iocdev') {
  const WebpackDevServer = require('webpack-dev-server');
  let compiler = webpack(loadedInstance.config);
  const port = 8000;
  let server = new WebpackDevServer(compiler, loadedInstance.config.devServer);
  server.listen(port, '0.0.0.0', function(err) {
    if(err){
        console.log('OHNO!',err);
    }
    else{
        // open('http://localhost:' + port);
    }
  });
}
