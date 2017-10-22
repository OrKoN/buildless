#!/usr/bin/env node

'use strict';

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
  error: 'red'
});

const _ = require('lodash');
const fs = require('fs');

const MemoryFileSystem = require('memory-fs');
const path = require('path');

const serveFile = require('./lib/serveFile');
const syncFs = require('./lib/syncFs');
const server = require('./lib/server');
const watcher = require('./lib/watcher');
const transformFile = require('./lib/transformFile');
const readConfig = require('./lib/config');
const deploy = require('./lib/deploy')

const cwd = process.cwd();
const mfs = new MemoryFileSystem();
const queue = [];

const argv = require('minimist')(process.argv.slice(2));
const command = argv._.shift();
const stage = argv.s || argv.stage || 'dev';
const config = readConfig({
  cwd,
  stage,
});

switch (command) {
  case 'start':
    watcher({
      cwd,
      config,
      onSyncFs: _.partial(syncFs, mfs, cwd, config, transformFile),
    });

    server({
      config,
      onServeFile: _.partial(serveFile, mfs, 'index.html'),
    });
    
    break;
  case 'deploy':
    deploy({
      mfs,
      stage,
      cwd,
      config,
      onSyncFs: _.partial(syncFs, mfs, cwd, config, transformFile),
    });
    break;
  default:
    console.log('Usage: bls start [-s dev]');
}