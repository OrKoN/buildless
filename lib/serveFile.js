const path = require('path');
const getMimeType = require('./utils/getMimeType');

function serveFile(mfs, rootObjectFilename, absolutePath) {
  try {
    const extension = absolutePath.split('.').pop();
    return {
      data: mfs.readFileSync(absolutePath),
      mimeType: getMimeType(extension),
    };
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