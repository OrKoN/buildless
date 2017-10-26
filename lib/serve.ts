import path = require('path');
import getMimeType = require('./utils/getMimeType');

export = function serveFile(
  mfs: any,
  rootObjectFilename: string,
  absolutePath: string,
): {
  data: Buffer;
  mimeType: string;
} {
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
};
