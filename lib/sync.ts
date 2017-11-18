import fs = require('fs');
import path = require('path');
import util = require('util');

const readFile = util.promisify(fs.readFile);

function transformFile(
  config: any,
  filePath: string,
  data: any,
  environment: any,
) {
  var matching = config
    ._getTransforms()
    .filter((t: any) => t.test.test(filePath));
  var series = Promise.resolve(data);
  for (let t of matching) {
    series = series.then(processed => t.fn(config, processed, environment));
  }
  return series;
}

export = function sync(
  mfs: any,
  cwd: string,
  config: any,
  dbg: any,
  { event, filePath }: { event: string; filePath: string },
) {
  switch (event) {
    case 'add':
    case 'change':
    case 'all':
      const relMfsPath = filePath.replace(cwd, '');
      const mfsDirname = path.dirname(relMfsPath);
      const relFsPath = filePath.replace(cwd, '.');

      return readFile(relFsPath).then(data => {
        dbg(`read data from ${relFsPath} (${data.length})`);
        return transformFile(config, relFsPath, data, config._getEnvironment())
          .then(data => {
            mfs.mkdirpSync(mfsDirname);
            mfs.writeFileSync(relMfsPath, data);
          })
          .catch(err => {
            dbg('error happened %s', err);
          });
      });
    default:
    // TODO error
  }
  return Promise.resolve();
};
