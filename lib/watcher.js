const chokidar = require('chokidar');

module.exports = function({ config, cwd, sync }) {
  chokidar
    .watch(cwd, {
      ignored: config._getIgnored(),
    })
    .on('all', (event, filePath) => {
      console.log('change detected: '.data + filePath.info);
      sync({
        event,
        filePath,
      });
    });
};
