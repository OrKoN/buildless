#!/usr/bin/env node

import minimist = require('minimist');
import _ = require('lodash');
import MemoryFileSystem = require('memory-fs');

import _serve = require('./lib/serve');
import _sync = require('./lib/sync');
import deploy = require('./lib/deploy');
import readConfig = require('./lib/readConfig');
import server = require('./lib/server');
import watcher = require('./lib/watcher');

const argv = minimist(process.argv.slice(2));
const command = argv._.shift();
const stage = argv.s || argv.stage || 'dev';
const cwd = process.cwd();
const mfs = new MemoryFileSystem();

const config = readConfig({
  cwd,
  stage,
});
const sync = _.partial(_sync, mfs, cwd, config);
const serve = _.partial(_serve, mfs, 'index.html');

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
    console.log('Usage: \nbls start [-s dev]');
}
