const path = require('path');

function serveFile(mfs, rootObjectFilename, absolutePath) {
  try {
    return mfs.readFileSync(absolutePath);
  } catch (err) {
    switch (err.code) {
      case 'ENOENT':
        const isDir = mfs.statSync(absolutePath).isDirectory();
        if (isDir) {
          const indexFileUrl = path.join(absolutePath, rootObjectFilename);
          return serveFile(mfs, rootObjectFilename, indexFileUrl);
        }
        break;
    }
    throw err;
  }
}

module.exports = serveFile;