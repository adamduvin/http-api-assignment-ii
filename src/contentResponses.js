const users = {};

const respond = (request, response, status, content, acceptedTypes) => {
    response.writeHead(status, { 'Content-Type': acceptedTypes });
    response.write(content);
    response.end();
  };

  const respondMeta = (request, response, status, acceptedTypes) => {
    response.writeHead(status, {'Content-Type': acceptedTypes});
    response.end();
  };

  const getUsers = (request, response) => {
        const responseJSON = {
            users,
        };

        return respond(request, response, 200, JSON.stringify(responseJSON));
  };

  const GetUsersMeta = (request, response) => {
      return respondMeta(request, response, 200, 'application/json');
  };

  const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found',
        id: 'notFound',
    };

    return respond(request, response, 404, JSON.stringify(responseJSON));
  };

  const GetUsersMeta = (request, response) => {
        return respondMeta(request, response, 404, 'application/json');
  };
  
  const success = (request, response, acceptedTypes) => {
    const responseJSON = {
      message: 'This is a successful response',
    };

    if (acceptedTypes[0] === 'text/xml') {
        let responseXML = `<response> <message>${responseJSON.message}</message> </response>`;
        return respond(request, response, 200, responseXML, 'text/xml');
    }
    
    return respond(request, response, 200, JSON.stringify(responseJSON), 'application/json');
  };
  
  const badRequest = (request, response, params, acceptedTypes) => {
    const responseJSON = {
      message: 'This request has the required parameters',
    };
  
    if (!params.valid || params.valid !== 'true') {
      responseJSON.message = 'Missing valid query parameter set to true';
      responseJSON.id = 'badRequest';
      if (acceptedTypes === 'text/xml') {
        let responseXML = `<response> <message>${responseJSON.message}</message> <id>${responseJSON.id}</id> </response>`;
        return respond(request, response, 400, responseXML, 'text/xml');
      }
  
      return respond(request, response, 400, JSON.stringify(responseJSON), 'application/json');
    }
  
    return respond(request, response, 200, JSON.stringify(responseJSON), 'application/json');
  };

  /*const notFound = (request, response, acceptedTypes) => {
    const responseJSON = {
      id: 'notFound',
      message: 'The page you are looking for was not found',
    };
  
    if (acceptedTypes === 'application/json') {
      return respond(request, response, 404, JSON.stringify(responseJSON), acceptedTypes);
    }
    if (acceptedTypes === 'text/xml') {
      let responseXML = `<response> <message>${responseJSON.message}</message> <id>${responseJSON.id}</id> </response>`;
      return respond(request, response, 404, responseXML, acceptedTypes);
    }
  
    return respond(request, response, 404, JSON.stringify(responseJSON), 'application/json');
  };*/
  
  module.exports = {
    success,
    badRequest,
    notFound,
  };
  