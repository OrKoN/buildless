import mime = require('mime');

export = function getMimeType(fileExt: string | undefined) {
  if (!fileExt) {
    return 'text/plain';
  }
  return mime.getType(fileExt) || 'text/plain';
};
