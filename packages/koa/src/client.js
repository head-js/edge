function Client(opts) {
  this.handleRequest = opts.handleRequest;
}


Client.prototype.verb = function (method, pathname, query, form, headers) {
  // console.log(method, pathname, params, form, headers);
  const req = {
    method,
    pathname,
    query: query || {},
    body: form || {},
    headers: headers || {}
  };
  const res = {
    end: (resp) => Promise.resolve(resp),
  };
  return this.handleRequest(req, res);
};


Client.prototype.get = function(pathname, query, form, headers) {
  return this.verb('GET', pathname, query, form, headers);
}

Client.prototype.post = function(pathname, query, form, headers) {
  return this.verb('POST', pathname, query, form, headers);
}

Client.prototype.put = function(pathname, query, form, headers) {
  return this.verb('PUT', pathname, query, form, headers);
}

Client.prototype.del = function(pathname, query, form, headers) {
  return this.verb('DELETE', pathname, query, form, headers);
}


module.exports = Client;
