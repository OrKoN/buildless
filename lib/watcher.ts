import chokidar = require('chokidar');

export = function({
  config,
  cwd,
  sync,
}: {
  config: any;
  cwd: string;
  sync: any;
}) {
  chokidar
    .watch(cwd, {
      ignored: config._getIgnored(),
    })
    .on('all', (event: string, filePath: string) => {
      console.log('change detected: ' + filePath);
      sync({
        event,
        filePath,
      });
    });
};
