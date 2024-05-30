function Client(opts) {
  this.handleRequest = opts.handleRequest;
}


Client.prototype.verb = function (method, pathname, search, form, headers) {
  // console.log(method, pathname, params, form, headers);
  const req = {
    method,
    pathname,
    query: search || {},
    body: form || {},
    headers: headers || {}
  };
  const res = {
    end: (resp) => Promise.resolve(resp),
  };
  return this.handleRequest(req, res);
};


Client.prototype.get = function(pathname, search, form, headers) {
  return this.verb('GET', pathname, search, form, headers);
}

Client.prototype.post = function(pathname, search, form, headers) {
  return this.verb('POST', pathname, search, form, headers);
}

Client.prototype.put = function(pathname, search, form, headers) {
  return this.verb('PUT', pathname, search, form, headers);
}

Client.prototype.del = function(pathname, search, form, headers) {
  return this.verb('DELETE', pathname, search, form, headers);
}


module.exports = Client;
