const path = require('path');

module.exports = function({ cwd, stage }) {
  const configPath = path.join(cwd, '.buildless.js');
  let config = null;
  try {
    config = require(configPath);
  } catch (err) {
    console.log(err);
    throw new Error('Error requiring config module' + configPath);
  }
  if (!(stage in config.environment)) {
    throw new Error('Environment ' + stage + ' is not listed in .buildless.js');
  }
  return {
    ...config,
    _getEnvironment() {
      return config.environment[stage];
    },
    _getIgnored() {
      return [
        /(^|[\/\\])\../, // dotfiles
        /node_modules/, // node_modules
      ];
    },
    _getPort() {
      return config.port;
    },
    _getS3Bucket() {
      return config.deployment.s3.bucket;
    },
    _getTransforms() {
      return config.transforms;
    },
  };
};