const mmm = require('mmmagic');
const Magic = mmm.Magic;
const magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);

function getMimeEncoding(data) {
  return new Promise((resolve, reject) => {
    magic.detect(data, function(err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    }); 
  });
}

module.exports = getMimeEncoding;