import http = require('http');
import url = require('url');

export = function start({
  config,
  serve,
  dbg,
}: {
  config: any;
  serve: any;
  dbg: any;
}) {
  http
    .createServer((req: any, res: any) => {
      try {
        dbg('serving %s', req.url);
        const parsed = url.parse(req.url);
        const { data, mimeType } = serve(parsed.pathname);
        dbg('serving %s', mimeType);
        res.writeHead(200, {
          'Content-Type': mimeType,
          'Content-Length': data.length,
        });
        res.end(data);
      } catch (err) {
        dbg('error serving a file %s', err);
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
    })
    .listen(config._getPort(), () => {
      console.log(`server is listening in port ${config._getPort()}`);
    });
};
