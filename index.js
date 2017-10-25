#!/usr/bin/env node

'use strict';

const argv = require('minimist')(process.argv.slice(2));
const command = argv._.shift();
const stage = argv.s || argv.stage || 'dev';
const cwd = process.cwd();

const colors = require('colors');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

const _ = require('lodash');
const fs = require('fs');

const MemoryFileSystem = require('memory-fs');
const path = require('path');

const server = require('./lib/server');
const watcher = require('./lib/watcher');
const deploy = require('./lib/deploy');

const readConfig = require('./lib/readConfig');

const mfs = new MemoryFileSystem();
const queue = [];

const config = readConfig({
  cwd,
  stage,
});

const sync = _.partial(require('./lib/sync'), mfs, cwd, config);
const serve = _.partial(require('./lib/serve'), mfs, 'index.html');

switch (command) {
  case 'start':
    watcher({
      config,
      cwd,
      sync,
    });

    server({
      config,
      serve,
    });

    break;
  case 'deploy':
    deploy({
      config,
      mfs,
      stage,
      cwd,
      sync,
    });
    break;
  default:
    console.log('Usage: bls start [-s dev]');
}
