const fs = require('fs');
const path = require('path');

function transformFile(config, filePath, data, environment) {
  var matching = config._getTransforms().filter(t => t.test.test(filePath));
  var series = Promise.resolve(data);
  for (let t of matching) {
    series = series.then(processed =>
      require('./transforms/' + t.name)(config, processed, environment),
    );
  }
  return series;
}

function syncFs(mfs, cwd, config, { event, filePath, stage }) {
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
      break;
    // TODO process other events
    default:
    // TODO error
  }
}

module.exports = syncFs;
