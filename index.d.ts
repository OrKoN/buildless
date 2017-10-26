interface HasEnvironment {
  _getEnvironment(): any;
}

interface HasIgnored {
  _getIgnored(): any;
}

interface HasPort {
  _getPort(): number;
}

interface HasS3 {
  _getS3Bucket(): string;
}

interface HasTransforms {
  _getTransforms(): object[];
}

interface Config
  extends HasEnvironment,
    HasIgnored,
    HasPort,
    HasS3,
    HasTransforms {}
