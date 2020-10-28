'use strict';

const dev = require('./Dev');
const dist = require('./Dist');
const test = require('./Test');
const iocdev = require('./IoC-Dev');
const iocdist = require('./IoC-Dist');

module.exports = {
  dev,
  dist,
  test,
  iocdev,
  iocdist
};
