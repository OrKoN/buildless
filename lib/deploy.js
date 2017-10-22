const glob = require('glob');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const path = require('path');
const fs = require('fs');
const getMimeEncoding = require('./utils/getMimeEncoding');


module.exports = ({
  mfs,
  cwd,
  stage,
  config,
  onSyncFs,
}) => {
  console.log(`Deploying stage ${stage.info}`.data);
  const files = glob
    .sync('**/*', {
      cwd,
    })
    .filter(file => {
      return !config._getIgnored().some(regexp => regexp.test(file));
    })
    .filter(file => {
      return !fs.lstatSync(file).isDirectory();
    });

  console.log('The following files will be deployed to s3:// ' + config._getS3Bucket(), '\n');
  console.log('\t' + files.join('\n\t') + '\n');

  return Promise.all(files.map((filePath) => {
    return onSyncFs({
      event: 'add',
      filePath: path.join(cwd, filePath),
    }).then(() => {
      const data = mfs.readFileSync(path.join('/', filePath));
      return getMimeEncoding(data)
        .then(contentType => {
          return s3.putObject({
            Body: data, 
            Bucket: config._getS3Bucket(), 
            Key: filePath,
            ACL: 'public-read',
            ContentType: contentType,
          }).promise();
        });
    });
  }))
  .then(() => {
    console.log('Done'.info);
  })
  .catch(err => {
    console.log('Smth went wrong'.error, err);
  })
};