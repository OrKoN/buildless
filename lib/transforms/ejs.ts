import ejs = require('ejs');

export = function ejsTransform(_config: any, data: any, environment: any) {
  return Promise.resolve(
    Buffer.from(ejs.render(data.toString('utf8'), environment), 'utf8'),
  );
};
