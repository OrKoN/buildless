import glob = require('glob');
import AWS = require('aws-sdk');
import path = require('path');
import fs = require('fs');
import getMimeType = require('./utils/getMimeType');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export = ({
  mfs,
  cwd,
  stage,
  config,
  sync,
}: {
  mfs: any;
  cwd: string;
  stage: string;
  config: any;
  sync: any;
}) => {
  console.log(`Deploying stage ${stage}`);
  const files = glob
    .sync('**/*', {
      cwd,
    })
    .filter(file => {
      return !config._getIgnored().some((regexp: any) => regexp.test(file));
    })
    .filter(file => {
      return !fs.lstatSync(file).isDirectory();
    });

  console.log(
    'The following files will be deployed to s3:// ' + config._getS3Bucket(),
    '\n',
  );
  console.log('\t' + files.join('\n\t') + '\n');

  return Promise.all(
    files.map(filePath => {
      return sync({
        event: 'add',
        filePath: path.join(cwd, filePath),
      }).then(() => {
        const data = mfs.readFileSync(path.join('/', filePath));
        const extension = filePath.split('.').pop();
        return s3
          .putObject({
            Body: data,
            Bucket: config._getS3Bucket(),
            Key: filePath,
            ACL: 'public-read',
            ContentType: getMimeType(extension),
          })
          .promise();
      });
    }),
  )
    .then(() => {
      console.log('Done');
    })
    .catch(err => {
      console.log('Smth went wrong', err);
    });
};
