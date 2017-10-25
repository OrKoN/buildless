const ejs = require('ejs');

module.exports = function ejsTransform(config, data, environment) {
  return Promise.resolve(
    Buffer.from(ejs.render(data.toString('utf8'), environment), 'utf8'),
  );
};
