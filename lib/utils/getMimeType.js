const mime = require('mime');

function getMimeType(fileExt) {
  return mime.getType(fileExt) || 'text/plain';
}

module.exports = getMimeType;