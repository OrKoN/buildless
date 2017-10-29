import fs = require('fs');
import path = require('path');

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
  { event, filePath }: { event: string; filePath: string },
) {
  switch (event) {
    case 'add':
    case 'change':
    case 'all':
      const relMfsPath = filePath.replace(cwd, '');
      const mfsDirname = path.dirname(relMfsPath);
      const relFsPath = filePath.replace(cwd, '.');

      return transformFile(
        config,
        relFsPath,
        fs.readFileSync(relFsPath),
        config._getEnvironment(),
      )
        .then(data => {
          mfs.mkdirpSync(mfsDirname);
          mfs.writeFileSync(relMfsPath, data);
        })
        .catch(err => {
          console.log(err);
        });
    default:
    // TODO error
  }
  return Promise.resolve();
};
