# buildless

[![Build Status](https://travis-ci.org/OrKoN/buildless.svg?branch=master)](https://travis-ci.org/OrKoN/buildless)

> I was procrastinating and created this tool for my simple static websites.

Development HTTP server and deployment tool for static websites.

- local http server
- rebuild on fs changes
- templates via EJS
- configuration per environment
- deployment to S3

This tool will not ever do the following:

- output processed source files into a folder on a fs
- it will not concatenate or merge source files into one
- it will not deal with JavaScript modules


Basically, this is a simple preprocessor for static files which does not pollute your file system with build files.

## Usage

Create `.buildless.js` in your project folder:

```js
module.exports = {
  port: 8080,
  environment: {
    dev: {
      ENDPOINT: 'dev'
    },
    prod: {
      ENDPOINT: 'prod'
    },
  },
  deployment: {
    s3: {
      bucket: 'orkon-test',
    },
  },
};
```

`environment` defines variables which are available to the EJS template engine.
`deployment` defines how the files will be deployed after they are processed by EJS.

Start a server in the local folder:

```sh
bls start [-s dev]
```

Deploy static folder

```sh
bls deploy [-s dev]
```

<%= ENDPOINT %>