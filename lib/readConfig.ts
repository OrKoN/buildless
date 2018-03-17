import path = require('path');
import Config = require('./config');

function readConfig({
  cwd,
  stage,
  configFile,
}: {
  cwd: string;
  stage: string;
  configFile: string;
}): Config {
  const configPath = path.join(cwd, configFile);
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
      return config.environment[stage] instanceof Function
        ? config.environment[stage]()
        : config.environment[stage];
    },
    _getIgnored(): RegExp[] {
      return [
        /(^|[\/\\])\../, // dotfiles
        /node_modules/, // node_modules
        /package.json/,
        /package-lock.json/,
      ];
    },
    _getIgnoredByDeploy(): RegExp[] {
      return config.ignoredByDeploy || [];
    },
    _getPort(): number {
      return config.port;
    },
    _getS3Bucket(): string {
      return config.deployment.s3.bucket;
    },
    _getTransforms(): Array<{
      test: any;
      fn: any;
    }> {
      return config.transforms;
    },
  };
}

export = readConfig;
