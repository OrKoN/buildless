const http = require('http');
const getMimeEncoding = require('./utils/getMimeEncoding');
const url = require('url');

module.exports = function start({
  config,
  onServeFile,
}) {
  http.createServer((req, res) => {
    try {
      const parsed = url.parse(req.url);
      const data = onServeFile(parsed.pathname);
      getMimeEncoding(data)
        .then(type => {
          res.writeHead(200, {
            'Content-Type': type,
            'Content-Length': data.length,
          });
          res.end(data);
        })
        .catch(err => {
          console.log(err);
          res.writeHead(500);
          res.end();
        });
    } catch (err) {
      switch (err.code) {
        case 'ENOENT':
          const msg = 'File not found';
          res.writeHead(404, {
            'Content-Type': 'text/plain',
            'Content-Length': msg.length,
          });
          res.end(msg);
          break;
        default:
          console.log(err);
          res.writeHead(500);
          res.end();
          break;
      }
    }
  }).listen(config._getPort(), () => {
    console.log(`server is listening in port ${config._getPort()}`.info);
  });
}