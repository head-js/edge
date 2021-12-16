function Client(opts) {
  this.handleRequest = opts.handleRequest;
}


Client.prototype.verb = function (method, pathname, params, body, headers) {
  // console.log(method, pathname, params, body, headers);
  const req = { method, pathname, params, body, headers };
  const res = { end: (resp) => Promise.resolve(resp) };
  return this.handleRequest(req, res);
};


Client.prototype.get = function(pathname, params, body, headers) {
  return this.verb('GET', pathname, params, body, headers);
}

Client.prototype.post = function(pathname, params, body, headers) {
  return this.verb('POST', pathname, params, body, headers);
}

Client.prototype.put = function(pathname, params, body, headers) {
  return this.verb('PUT', pathname, params, body, headers);
}

Client.prototype.del = function(pathname, params, body, headers) {
  return this.verb('DELETE', pathname, params, body, headers);
}


module.exports = Client;
