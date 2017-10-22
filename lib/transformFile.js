const ejs = require('ejs');

function transformFile(filePath, data, ejsData) {
  if (filePath.endsWith('.html')
    || filePath.endsWith('.js')) {
    return Promise.resolve(Buffer.from(ejs.render(data.toString('utf8'), ejsData), 'utf8'));
  }
  return Promise.resolve(data);
}

module.exports = transformFile;