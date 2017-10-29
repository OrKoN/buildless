import path = require('path');

interface Config {
  _getEnvironment(): any;
  _getIgnored(): RegExp[];
  _getPort(): number;
  _getS3Bucket(): string;
  _getTransforms(): object[];
}

function readConfig({ cwd, stage }: { cwd: string; stage: string }): Config {
  const configPath = path.join(cwd, '.buildless.js');
  let config: any;
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
    _getEnvironment(): any {
      return config.environment[stage];
    },
    _getIgnored(): RegExp[] {
      return [
        /(^|[\/\\])\../, // dotfiles
        /node_modules/, // node_modules
        /package.json/,
        /package-lock.json/,
      ];
    },
    _getPort(): number {
      return config.port;
    },
    _getS3Bucket(): string {
      return config.deployment.s3.bucket;
    },
    _getTransforms(): object[] {
      return config.transforms;
    },
  };
}

export = readConfig;
