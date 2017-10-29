import mime = require('mime');

export = function getMimeType(fileExt: string | undefined): string {
  if (!fileExt) {
    return 'text/plain';
  }
  return mime.getType(fileExt) || 'text/plain';
};
