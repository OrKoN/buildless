#!/usr/bin/env node

import minimist = require('minimist');
import debug = require('debug');
import _ = require('lodash');
import MemoryFileSystem = require('memory-fs');

import _serve = require('../lib/serve');
import _sync = require('../lib/sync');
import deploy = require('../lib/deploy');
import readConfig = require('../lib/readConfig');
import server = require('../lib/server');
import watcher = require('../lib/watcher');

const argv = minimist(process.argv.slice(2));
const command = argv._.shift();
const stage = argv.s || argv.stage || 'dev';
const configFile = argv.c || argv.config || '.buildless.js';
const cwd = process.cwd();
const mfs = new MemoryFileSystem();
const dbg = debug('buildless');

const config = readConfig({
  cwd,
  stage,
  configFile,
});
const sync = _.partial(_sync, mfs, cwd, config, dbg);
const serve = _.partial(_serve, mfs, 'index.html', dbg);

switch (command) {
  case 'start':
    watcher({
      config,
      cwd,
      sync,
      dbg,
    });

    server({
      config,
      serve,
      dbg,
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
    console.log('Usage: \nbls start [-s dev] [-c .buildless.js]');
}
