import chokidar = require('chokidar');
import Config = require('./config');

export = function({
  config,
  cwd,
  sync,
  dbg,
}: {
  config: Config;
  cwd: string;
  sync: any;
  dbg: any;
}) {
  chokidar
    .watch(cwd, {
      ignored: config._getIgnored(),
    })
    .on('all', (event: string, filePath: string) => {
      dbg(`change detected: ${event} ${filePath}`);
      setTimeout(() => {
        sync({
          event,
          filePath,
          dbg,
        });
      }, 100);
    });
};
