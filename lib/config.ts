interface Config {
  _getEnvironment(): any;
  _getIgnored(): RegExp[];
  _getIgnoredByDeploy(): RegExp[];
  _getPort(): number;
  _getS3Bucket(): string;
  _getTransforms(): Array<{
    test: any;
    fn: any;
  }>;
}

export = Config;
