const fs = require('fs');
const path = require('path');

function syncFs(mfs, cwd, config, transform, { event, filePath, stage }) {
  switch (event) {
    case 'add':
    case 'change':
    case 'all':
      const relMfsPath = filePath.replace(cwd, '');
      const mfsDirname = path.dirname(relMfsPath);
      const relFsPath = filePath.replace(cwd, '.');
      
      return transform(relFsPath, fs.readFileSync(relFsPath), config._getEnvironment())
        .then(data => {
          mfs.mkdirpSync(mfsDirname);
          mfs.writeFileSync(relMfsPath, data);
        })
        .catch(err => {
          console.log(err);
        })
      break;
    // TODO process other events
      default:
        // TODO error
  }
}

module.exports = syncFs;