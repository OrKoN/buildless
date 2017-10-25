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
  transforms: [
    {
      test: /\.(html|css|js|md)$/,
      name: 'ejs',
    },
  ],
  deployment: {
    s3: {
      bucket: 'orkon-test',
    },
  },
};
