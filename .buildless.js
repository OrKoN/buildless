const bls = require('./dist/index');

module.exports = {
  port: 8080,
  environment: {
    dev: {
      ENDPOINT: 'dev',
    },
    prod: {
      ENDPOINT: 'prod',
    },
  },
  transforms: [],
  deployment: {
    s3: {
      bucket: 'orkon-test',
    },
  },
};
