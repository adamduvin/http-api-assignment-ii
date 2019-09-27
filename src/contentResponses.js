const users = {};

const respond = (request, response, status, content, acceptedTypes) => {
  response.writeHead(status, { 'Content-Type': acceptedTypes });
  response.write(content);
  response.end();
};

const respondMeta = (request, response, status, acceptedTypes) => {
  response.writeHead(status, { 'Content-Type': acceptedTypes });
  response.end();
};

const getUsers = (request, response) => {
  if (request.method === 'HEAD') {
    return respondMeta(request, response, 200, 'application/json');
  }

  const responseJSON = {
    users,
  };

  return respond(request, response, 200, JSON.stringify(responseJSON), 'application/json');
};

/* const getUsersMeta = (request, response) => {
      return respondMeta(request, response, 200, 'application/json');
  }; */

const notFound = (request, response) => {
  if (request.method === 'HEAD') {
    return respondMeta(request, response, 404, 'application/json');
  }

  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  return respond(request, response, 404, JSON.stringify(responseJSON), 'application/json');
};

/* const notFoundMeta = (request, response) => {
        return respondMeta(request, response, 404, 'application/json');
  }; */

/* const success = (request, response, acceptedTypes) => {
    const responseJSON = {
      message: 'This is a successful response',
    };

    if (acceptedTypes[0] === 'text/xml') {
        let responseXML = `<response> <message>${responseJSON.message}</message> </response>`;
        return respond(request, response, 200, responseXML, 'text/xml');
    }

    return respond(request, response, 200, JSON.stringify(responseJSON), 'application/json');
  }; */

const badRequest = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    if (request.method === 'HEAD') {
      return respondMeta(request, response, 400, 'application/json');
    }

    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    if (acceptedTypes === 'text/xml') {
      const responseXML = `<response> <message>${responseJSON.message}</message> <id>${responseJSON.id}</id> </response>`;
      return respond(request, response, 400, responseXML, 'text/xml');
    }

    return respond(request, response, 400, JSON.stringify(responseJSON), 'application/json');
  }


  if (request.method === 'HEAD') {
    return respondMeta(request, response, 200, 'application/json');
  }


  return respond(request, response, 200, JSON.stringify(responseJSON), 'application/json');
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respond(request, response, 400, JSON.stringify(responseJSON), 'application/json');
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    return respond(request, response, responseCode, JSON.stringify(responseJSON), 'application/json');
  }

  return respondMeta(request, response, JSON.stringify(responseJSON), 'application/json');
};

/* const notFound = (request, response, acceptedTypes) => {
    const responseJSON = {
      id: 'notFound',
      message: 'The page you are looking for was not found',
    };

    if (acceptedTypes === 'application/json') {
      return respond(request, response, 404, JSON.stringify(responseJSON), acceptedTypes);
    }
    if (acceptedTypes === 'text/xml') {
      let responseXML = `<response> <message>${responseJSON.message}
      </message> <id>${responseJSON.id}</id> </response>`;
      return respond(request, response, 404, responseXML, acceptedTypes);
    }

    return respond(request, response, 404, JSON.stringify(responseJSON), 'application/json');
  }; */

module.exports = {
  getUsers,
  notFound,
  addUser,
  badRequest,
};
