const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const contentHandler = require('./contentResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': contentHandler.getUsers,
    '/notReal': contentHandler.getNotReal,
    '/success': contentHandler.success,
    '/badRequest': contentHandler.badRequest,
    notFound: contentHandler.notFound,
  },
  HEAD: {
    '/getUsers': contentHandler.getUsersMeta,
    notFound: contentHandler.notFoundMeta,
  },
};

const handleGet = (request, response, parsedUrl, acceptedTypes) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, acceptedTypes);
  } else {
    urlStruct[request.method].notFound(request, response, acceptedTypes);
  }
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      contentHandler.addUser(request, res, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);

  const acceptedTypes = request.headers.accept.split(',');

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
