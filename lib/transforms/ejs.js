const ejs = require('ejs');

module.exports = function ejsTransform(data, environment) {
  return Promise.resolve(
    Buffer.from(ejs.render(data.toString('utf8'), ejsData), 'utf8'),
  );
};
