# buildless

[![Build Status](https://travis-ci.org/OrKoN/buildless.svg?branch=master)](https://travis-ci.org/OrKoN/buildless)

Development HTTP server and deployment tool for static websites.

- local http server
- rebuild of file changes
- templates via EJS support for all html and js files
- configuration per environment
- deployment to S3

This tool will not ever do the following:

- output processed source files into a folder on a fs
- it will not concatenate or merge source files into one
- it will not deal with JavaScript modules


Basically, this is a simple preprocessor for static files which does not pollute your file system with build files.

## Usage

Start a server in the local folder:

```sh
bls start [-s dev]
```

Deploy static folder

```sh
bls deploy [-s dev]
```