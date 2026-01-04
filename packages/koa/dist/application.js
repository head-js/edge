'use strict';

// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.regexp.exec.js');
// require('core-js/modules/es.string.replace.js');
// require('core-js/modules/es.promise.js');
// require('core-js/modules/web.dom-collections.for-each.js');
// require('core-js/modules/es.object.get-own-property-descriptors.js');
// require('core-js/modules/es.symbol.description.js');
// require('core-js/modules/es.string.split.js');
// require('core-js/modules/es.regexp.constructor.js');
// require('core-js/modules/es.array.includes.js');
// require('core-js/modules/es.array.reduce.js');

// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.promise.js');

/**
 * Expose compositor.
 */

var src$1 = compose$3;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose$3(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
var compose_1$1 = src$1;

var contextExports = {};
var context$1 = {
  get exports(){ return contextExports; },
  set exports(v){ contextExports = v; },
};

/**
 * Expose `Delegator`.
 */

var delegates = Delegator;

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */

function Delegator(proto, target) {
  if (!(this instanceof Delegator)) return new Delegator(proto, target);
  this.proto = proto;
  this.target = target;
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.method = function(name){
  var proto = this.proto;
  var target = this.target;
  this.methods.push(name);

  proto[name] = function(){
    return this[target][name].apply(this[target], arguments);
  };

  return this;
};

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.access = function(name){
  return this.getter(name).setter(name);
};

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.getter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.getters.push(name);

  proto.__defineGetter__(name, function(){
    return this[target][name];
  });

  return this;
};

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.setter = function(name){
  var proto = this.proto;
  var target = this.target;
  this.setters.push(name);

  proto.__defineSetter__(name, function(val){
    return this[target][name] = val;
  });

  return this;
};

/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.fluent = function (name) {
  var proto = this.proto;
  var target = this.target;
  this.fluents.push(name);

  proto[name] = function(val){
    if ('undefined' != typeof val) {
      this[target][name] = val;
      return this;
    } else {
      return this[target][name];
    }
  };

  return this;
};

/**
 * Module dependencies.
 */

// const util = require('util');
// const createError = require('http-errors');
// const httpAssert = require('http-assert');
const delegate = delegates;
// const statuses = require('statuses');
// const Cookies = require('cookies');

// const COOKIES = Symbol('context#cookies');

/**
 * Context prototype.
 */

const proto = context$1.exports = {
  /**
   * util.inspect() implementation, which
   * just returns the JSON output.
   *
   * @return {Object}
   * @api public
   */

  // inspect() {
  //   if (this === proto) return this;
  //   return this.toJSON();
  // },

  /**
   * Return JSON representation.
   *
   * Here we explicitly invoke .toJSON() on each
   * object, as iteration will otherwise fail due
   * to the getters and cause utilities such as
   * clone() to fail.
   *
   * @return {Object}
   * @api public
   */

  // toJSON() {
  //   return {
  //     request: this.request.toJSON(),
  //     response: this.response.toJSON(),
  //     app: this.app.toJSON(),
  //     originalUrl: this.originalUrl,
  //     req: '<original node req>',
  //     res: '<original node res>',
  //     socket: '<original node socket>'
  //   };
  // },

  /**
   * Similar to .throw(), adds assertion.
   *
   *    this.assert(this.user, 401, 'Please login!');
   *
   * See: https://github.com/jshttp/http-assert
   *
   * @param {Mixed} test
   * @param {Number} status
   * @param {String} message
   * @api public
   */

  // assert: httpAssert,

  /**
   * Throw an error with `status` (default 500) and
   * `msg`. Note that these are user-level
   * errors, and the message may be exposed to the client.
   *
   *    this.throw(403)
   *    this.throw(400, 'name required')
   *    this.throw('something exploded')
   *    this.throw(new Error('invalid'))
   *    this.throw(400, new Error('invalid'))
   *
   * See: https://github.com/jshttp/http-errors
   *
   * Note: `status` should only be passed as the first parameter.
   *
   * @param {String|Number|Error} err, msg or status
   * @param {String|Number|Error} [err, msg or status]
   * @param {Object} [props]
   * @api public
   */

  throw(status, message, extra) {
    // throw createError(...args);
    const err = new Error(message || status); // TODO: || statuses[status].message
    err.status = status;
    // TODO: extends(err, extra);
    throw err;
  },
  /**
   * Default error handling.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) return;

    // When dealing with cross-globals a normal `instanceof` check doesn't work properly.
    // See https://github.com/koajs/koa/issues/1466
    // We can probably remove it once jest fixes https://github.com/facebook/jest/issues/2549.
    const isNativeError = Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error;
    // if (!isNativeError) err = new Error(util.format('non-error thrown: %j', err));
    if (!isNativeError) {
      if (err.status || err.code) ; else {
        err = new Error('non-error thrown: ' + err.toString());
      }
    }
    throw err;

    // let headerSent = false;
    // if (this.headerSent || !this.writable) {
    //   headerSent = err.headerSent = true;
    // }

    // // delegate
    // this.app.emit('error', err, this);

    // // nothing we can do here other
    // // than delegate to the app-level
    // // handler and log.
    // if (headerSent) {
    //   return;
    // }

    // const { res } = this;

    // // first unset all headers
    // /* istanbul ignore else */
    // if (typeof res.getHeaderNames === 'function') {
    //   res.getHeaderNames().forEach(name => res.removeHeader(name));
    // } else {
    //   res._headers = {}; // Node < 7.7
    // }

    // // then set those specified
    // this.set(err.headers);

    // // force text/plain
    // this.type = 'text';

    // let statusCode = err.status || err.statusCode;

    // // ENOENT support
    // if ('ENOENT' === err.code) statusCode = 404;

    // // default to 500
    // if ('number' !== typeof statusCode || !statuses[statusCode]) statusCode = 500;

    // // respond
    // const code = statuses[statusCode];
    // const msg = err.expose ? err.message : code;
    // this.status = err.status = statusCode;
    // this.length = Buffer.byteLength(msg);
    // res.end(msg);
  }

  // get cookies() {
  //   if (!this[COOKIES]) {
  //     this[COOKIES] = new Cookies(this.req, this.res, {
  //       keys: this.app.keys,
  //       secure: this.request.secure
  //     });
  //   }
  //   return this[COOKIES];
  // },

  // set cookies(_cookies) {
  //   this[COOKIES] = _cookies;
  // }
};

/**
 * Custom inspection implementation for newer Node.js versions.
 *
 * @return {Object}
 * @api public
 */

/* istanbul ignore else */
// if (util.inspect.custom) {
//   module.exports[util.inspect.custom] = module.exports.inspect;
// }

/**
 * Response delegation.
 */

delegate(proto, 'response')
// .method('attachment')
// .method('redirect')
// .method('remove')
// .method('vary')
// .method('has')
// .method('set')
// .method('append')
// .method('flushHeaders')
// .access('status')
// .access('message')
// .access('body')
// .access('length')
// .access('type')
// .access('lastModified')
// .access('etag')
// .getter('headerSent')
.getter('writable');

/**
 * Request delegation.
 */

delegate(proto, 'request')
// .method('acceptsLanguages')
// .method('acceptsEncodings')
// .method('acceptsCharsets')
// .method('accepts')
// .method('get')
// .method('is')
// .access('querystring')
// .access('idempotent')
// .access('socket')
// .access('search')
.access('method')
// .access('query')
.access('path');

/**
 * Module dependencies.
 */

// const URL = require('url').URL;
// const net = require('net');
// const accepts = require('accepts');
// const contentType = require('content-type');
// const stringify = require('url').format;
// const parse = require('parseurl');
// const qs = require('querystring');
// const typeis = require('type-is');
// const fresh = require('fresh');
// const only = require('only');
// const util = require('util');

// const IP = Symbol('context#ip');

/**
 * Prototype.
 */

var request$1 = {
  /**
   * Return request header.
   *
   * @return {Object}
   * @api public
   */

  // get header() {
  //   return this.req.headers;
  // },

  /**
   * Set request header.
   *
   * @api public
   */

  // set header(val) {
  //   this.req.headers = val;
  // },

  /**
   * Return request header, alias as request.header
   *
   * @return {Object}
   * @api public
   */

  // get headers() {
  //   return this.req.headers;
  // },

  /**
   * Set request header, alias as request.header
   *
   * @api public
   */

  // set headers(val) {
  //   this.req.headers = val;
  // },

  /**
   * Get request URL.
   *
   * @return {String}
   * @api public
   */

  // get url() {
  //   return this.req.url;
  // },

  /**
   * Set request URL.
   *
   * @api public
   */

  // set url(val) {
  //   this.req.url = val;
  // },

  /**
   * Get origin of URL.
   *
   * @return {String}
   * @api public
   */

  // get origin() {
  //   return `${this.protocol}://${this.host}`;
  // },

  /**
   * Get full request URL.
   *
   * @return {String}
   * @api public
   */

  // get href() {
  //   // support: `GET http://example.com/foo`
  //   if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl;
  //   return this.origin + this.originalUrl;
  // },

  /**
   * Get request method.
   *
   * @return {String}
   * @api public
   */

  get method() {
    return this.req.method;
  },
  /**
   * Set request method.
   *
   * @param {String} val
   * @api public
   */

  // set method(val) {
  //   this.req.method = val;
  // },

  /**
   * Get request pathname.
   *
   * @return {String}
   * @api public
   */

  get path() {
    // return parse(this.req).pathname;
    return this.req.pathname;
  },
  /**
   * Set pathname, retaining the query string when present.
   *
   * @param {String} path
   * @api public
   */

  // set path(path) {
  //   const url = parse(this.req);
  //   if (url.pathname === path) return;

  //   url.pathname = path;
  //   url.path = null;

  //   this.url = stringify(url);
  // },

  /**
   * Get parsed query string.
   *
   * @return {Object}
   * @api public
   */

  get query() {
    // const str = this.querystring;
    // const c = this._querycache = this._querycache || {};
    // return c[str] || (c[str] = qs.parse(str));
    return this.req.query;
  },
  /**
   * Set query string as an object.
   *
   * @param {Object} obj
   * @api public
   */

  // set query(obj) {
  //   this.querystring = qs.stringify(obj);
  // },

  /**
   * Get query string.
   *
   * @return {String}
   * @api public
   */

  // get querystring() {
  //   if (!this.req) return '';
  //   return parse(this.req).query || '';
  // },

  /**
   * Set query string.
   *
   * @param {String} str
   * @api public
   */

  // set querystring(str) {
  //   const url = parse(this.req);
  //   if (url.search === `?${str}`) return;

  //   url.search = str;
  //   url.path = null;

  //   this.url = stringify(url);
  // },

  /**
   * Get the search string. Same as the query string
   * except it includes the leading ?.
   *
   * @return {String}
   * @api public
   */

  // get search() {
  //   if (!this.querystring) return '';
  //   return `?${this.querystring}`;
  // },

  /**
   * Set the search string. Same as
   * request.querystring= but included for ubiquity.
   *
   * @param {String} str
   * @api public
   */

  // set search(str) {
  //   this.querystring = str;
  // },

  /**
   * The original body from verb is already pretty
   *
   * @return {Object}
   * @api public
   */

  get body() {
    return this.req.body;
  }

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   * @return {String} hostname:port
   * @api public
   */

  // get host() {
  //   const proxy = this.app.proxy;
  //   let host = proxy && this.get('X-Forwarded-Host');
  //   if (!host) {
  //     if (this.req.httpVersionMajor >= 2) host = this.get(':authority');
  //     if (!host) host = this.get('Host');
  //   }
  //   if (!host) return '';
  //   return splitCommaSeparatedValues(host, 1)[0];
  // },

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   * @return {String} hostname
   * @api public
   */

  // get hostname() {
  //   const host = this.host;
  //   if (!host) return '';
  //   if ('[' === host[0]) return this.URL.hostname || ''; // IPv6
  //   return host.split(':', 1)[0];
  // },

  /**
   * Get WHATWG parsed URL.
   * Lazily memoized.
   *
   * @return {URL|Object}
   * @api public
   */

  // get URL() {
  //   /* istanbul ignore else */
  //   if (!this.memoizedURL) {
  //     const originalUrl = this.originalUrl || ''; // avoid undefined in template string
  //     try {
  //       this.memoizedURL = new URL(`${this.origin}${originalUrl}`);
  //     } catch (err) {
  //       this.memoizedURL = Object.create(null);
  //     }
  //   }
  //   return this.memoizedURL;
  // },

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   *
   * @return {Boolean}
   * @api public
   */

  // get fresh() {
  //   const method = this.method;
  //   const s = this.ctx.status;

  //   // GET or HEAD for weak freshness validation only
  //   if ('GET' !== method && 'HEAD' !== method) return false;

  //   // 2xx or 304 as per rfc2616 14.26
  //   if ((s >= 200 && s < 300) || 304 === s) {
  //     return fresh(this.header, this.response.header);
  //   }

  //   return false;
  // },

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   *
   * @return {Boolean}
   * @api public
   */

  // get stale() {
  //   return !this.fresh;
  // },

  /**
   * Check if the request is idempotent.
   *
   * @return {Boolean}
   * @api public
   */

  // get idempotent() {
  //   const methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
  //   return !!~methods.indexOf(this.method);
  // },

  /**
   * Return the request socket.
   *
   * @return {Connection}
   * @api public
   */

  // get socket() {
  //   return this.req.socket;
  // },

  /**
   * Get the charset when present or undefined.
   *
   * @return {String}
   * @api public
   */

  // get charset() {
  //   try {
  //     const { parameters } = contentType.parse(this.req);
  //     return parameters.charset || '';
  //   } catch (e) {
  //     return '';
  //   }
  // },

  /**
   * Return parsed Content-Length when present.
   *
   * @return {Number}
   * @api public
   */

  // get length() {
  //   const len = this.get('Content-Length');
  //   if (len === '') return;
  //   return ~~len;
  // },

  /**
   * Return the protocol string "http" or "https"
   * when requested with TLS. When the proxy setting
   * is enabled the "X-Forwarded-Proto" header
   * field will be trusted. If you're running behind
   * a reverse proxy that supplies https for you this
   * may be enabled.
   *
   * @return {String}
   * @api public
   */

  // get protocol() {
  //   if (this.socket.encrypted) return 'https';
  //   if (!this.app.proxy) return 'http';
  //   const proto = this.get('X-Forwarded-Proto');
  //   return proto ? splitCommaSeparatedValues(proto, 1)[0] : 'http';
  // },

  /**
   * Shorthand for:
   *
   *    this.protocol == 'https'
   *
   * @return {Boolean}
   * @api public
   */

  // get secure() {
  //   return 'https' === this.protocol;
  // },

  /**
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list.
   *
   * For example if the value was "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream.
   *
   * @return {Array}
   * @api public
   */

  // get ips() {
  //   const proxy = this.app.proxy;
  //   const val = this.get(this.app.proxyIpHeader);
  //   let ips = proxy && val
  //     ? splitCommaSeparatedValues(val)
  //     : [];
  //   if (this.app.maxIpsCount > 0) {
  //     ips = ips.slice(-this.app.maxIpsCount);
  //   }
  //   return ips;
  // },

  /**
   * Return request's remote address
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list and return the first one
   *
   * @return {String}
   * @api public
   */

  // get ip() {
  //   if (!this[IP]) {
  //     this[IP] = this.ips[0] || this.socket.remoteAddress || '';
  //   }
  //   return this[IP];
  // },

  // set ip(_ip) {
  //   this[IP] = _ip;
  // },

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain
   * of the app. By default, the domain of the app is assumed to be the last two
   * parts of the host. This can be changed by setting `app.subdomainOffset`.
   *
   * For example, if the domain is "tobi.ferrets.example.com":
   * If `app.subdomainOffset` is not set, this.subdomains is
   * `["ferrets", "tobi"]`.
   * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
   *
   * @return {Array}
   * @api public
   */

  // get subdomains() {
  //   const offset = this.app.subdomainOffset;
  //   const hostname = this.hostname;
  //   if (net.isIP(hostname)) return [];
  //   return hostname
  //     .split('.')
  //     .reverse()
  //     .slice(offset);
  // },

  /**
   * Get accept object.
   * Lazily memoized.
   *
   * @return {Object}
   * @api private
   */

  // get accept() {
  //   return this._accept || (this._accept = accepts(this.req));
  // },

  /**
   * Set accept object.
   *
   * @param {Object}
   * @api private
   */

  // set accept(obj) {
  //   this._accept = obj;
  // },

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `false`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     this.accepts('html');
   *     // => "html"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('html');
   *     // => "html"
   *     this.accepts('text/html');
   *     // => "text/html"
   *     this.accepts('json', 'text');
   *     // => "json"
   *     this.accepts('application/json');
   *     // => "application/json"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('image/png');
   *     this.accepts('png');
   *     // => false
   *
   *     // Accept: text/*;q=.5, application/json
   *     this.accepts(['html', 'json']);
   *     this.accepts('html', 'json');
   *     // => "json"
   *
   * @param {String|Array} type(s)...
   * @return {String|Array|false}
   * @api public
   */

  // accepts(...args) {
  //   return this.accept.types(...args);
  // },

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ['gzip', 'deflate']
   *
   * @param {String|Array} encoding(s)...
   * @return {String|Array}
   * @api public
   */

  // acceptsEncodings(...args) {
  //   return this.accept.encodings(...args);
  // },

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ['utf-8', 'utf-7', 'iso-8859-1']
   *
   * @param {String|Array} charset(s)...
   * @return {String|Array}
   * @api public
   */

  // acceptsCharsets(...args) {
  //   return this.accept.charsets(...args);
  // },

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ['es', 'pt', 'en']
   *
   * @param {String|Array} lang(s)...
   * @return {Array|String}
   * @api public
   */

  // acceptsLanguages(...args) {
  //   return this.accept.languages(...args);
  // },

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field and if it contains any of the given mime `type`s.
   * If there is no request body, `null` is returned.
   * If there is no content type, `false` is returned.
   * Otherwise, it returns the first `type` that matches.
   *
   * Examples:
   *
   *     // With Content-Type: text/html; charset=utf-8
   *     this.is('html'); // => 'html'
   *     this.is('text/html'); // => 'text/html'
   *     this.is('text/*', 'application/json'); // => 'text/html'
   *
   *     // When Content-Type is application/json
   *     this.is('json', 'urlencoded'); // => 'json'
   *     this.is('application/json'); // => 'application/json'
   *     this.is('html', 'application/*'); // => 'application/json'
   *
   *     this.is('html'); // => false
   *
   * @param {String|String[]} [type]
   * @param {String[]} [types]
   * @return {String|false|null}
   * @api public
   */

  // is(type, ...types) {
  //   return typeis(this.req, type, ...types);
  // },

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   *
   * @return {String}
   * @api public
   */

  // get type() {
  //   const type = this.get('Content-Type');
  //   if (!type) return '';
  //   return type.split(';')[0];
  // },

  /**
   * Return request header.
   *
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   *     this.get('Something');
   *     // => ''
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  // get(field) {
  //   const req = this.req;
  //   switch (field = field.toLowerCase()) {
  //     case 'referer':
  //     case 'referrer':
  //       return req.headers.referrer || req.headers.referer || '';
  //     default:
  //       return req.headers[field] || '';
  //   }
  // },

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  // inspect() {
  //   if (!this.req) return;
  //   return this.toJSON();
  // },

  /**
   * Return JSON representation.
   *
   * @return {Object}
   * @api public
   */

  // toJSON() {
  //   return only(this, [
  //     'method',
  //     'url',
  //     'header'
  //   ]);
  // }
};

/**
 * Module dependencies.
 */

// const contentDisposition = require('content-disposition');
// const getType = require('cache-content-type');
// const onFinish = require('on-finished');
// const escape = require('escape-html');
// const typeis = require('type-is').is;
// const statuses = require('statuses');
// const destroy = require('destroy');
// const assert = require('assert');
// const extname = require('path').extname;
// const vary = require('vary');
// const only = require('only');
// const util = require('util');
// const encodeUrl = require('encodeurl');
// const Stream = require('stream');
// const URL = require('url').URL;

/**
 * Prototype.
 */

var response$1 = {
  /**
   * Return the request socket.
   *
   * @return {Connection}
   * @api public
   */

  // get socket() {
  //   return this.res.socket;
  // },

  /**
   * Return response header.
   *
   * @return {Object}
   * @api public
   */

  // get header() {
  //   const { res } = this;
  //   return typeof res.getHeaders === 'function'
  //     ? res.getHeaders()
  //     : res._headers || {}; // Node < 7.7
  // },

  /**
   * Return response header, alias as response.header
   *
   * @return {Object}
   * @api public
   */

  // get headers() {
  //   return this.header;
  // },

  /**
   * Get response status code.
   *
   * @return {Number}
   * @api public
   */

  // get status() {
  //   return this.res.statusCode;
  // },

  /**
   * Set response status code.
   *
   * @param {Number} code
   * @api public
   */

  // set status(code) {
  //   if (this.headerSent) return;

  //   assert(Number.isInteger(code), 'status code must be a number');
  //   assert(code >= 100 && code <= 999, `invalid status code: ${code}`);
  //   this._explicitStatus = true;
  //   this.res.statusCode = code;
  //   if (this.req.httpVersionMajor < 2) this.res.statusMessage = statuses[code];
  //   if (this.body && statuses.empty[code]) this.body = null;
  // },

  /**
   * Get response status message
   *
   * @return {String}
   * @api public
   */

  // get message() {
  //   return this.res.statusMessage || statuses[this.status];
  // },

  /**
   * Set response status message
   *
   * @param {String} msg
   * @api public
   */

  // set message(msg) {
  //   this.res.statusMessage = msg;
  // },

  /**
   * Get response body.
   *
   * @return {Mixed}
   * @api public
   */

  // get body() {
  //   return this._body;
  // },

  /**
   * Set response body.
   *
   * @param {String|Buffer|Object|Stream} val
   * @api public
   */

  // set body(val) {
  //   const original = this._body;
  //   this._body = val;

  //   // no content
  //   if (null == val) {
  //     if (!statuses.empty[this.status]) this.status = 204;
  //     if (val === null) this._explicitNullBody = true;
  //     this.remove('Content-Type');
  //     this.remove('Content-Length');
  //     this.remove('Transfer-Encoding');
  //     return;
  //   }

  //   // set the status
  //   if (!this._explicitStatus) this.status = 200;

  //   // set the content-type only if not yet set
  //   const setType = !this.has('Content-Type');

  //   // string
  //   if ('string' === typeof val) {
  //     if (setType) this.type = /^\s*</.test(val) ? 'html' : 'text';
  //     this.length = Buffer.byteLength(val);
  //     return;
  //   }

  //   // buffer
  //   if (Buffer.isBuffer(val)) {
  //     if (setType) this.type = 'bin';
  //     this.length = val.length;
  //     return;
  //   }

  //   // stream
  //   if (val instanceof Stream) {
  //     onFinish(this.res, destroy.bind(null, val));
  //     if (original != val) {
  //       val.once('error', err => this.ctx.onerror(err));
  //       // overwriting
  //       if (null != original) this.remove('Content-Length');
  //     }

  //     if (setType) this.type = 'bin';
  //     return;
  //   }

  //   // json
  //   this.remove('Content-Length');
  //   this.type = 'json';
  // },

  /**
   * Set Content-Length field to `n`.
   *
   * @param {Number} n
   * @api public
   */

  // set length(n) {
  //   if (!this.has('Transfer-Encoding')) {
  //     this.set('Content-Length', n);
  //   }
  // },

  /**
   * Return parsed response Content-Length when present.
   *
   * @return {Number}
   * @api public
   */

  // get length() {
  //   if (this.has('Content-Length')) {
  //     return parseInt(this.get('Content-Length'), 10) || 0;
  //   }

  //   const { body } = this;
  //   if (!body || body instanceof Stream) return undefined;
  //   if ('string' === typeof body) return Buffer.byteLength(body);
  //   if (Buffer.isBuffer(body)) return body.length;
  //   return Buffer.byteLength(JSON.stringify(body));
  // },

  /**
   * Check if a header has been written to the socket.
   *
   * @return {Boolean}
   * @api public
   */

  // get headerSent() {
  //   return this.res.headersSent;
  // },

  /**
   * Vary on `field`.
   *
   * @param {String} field
   * @api public
   */

  // vary(field) {
  //   if (this.headerSent) return;

  //   vary(this.res, field);
  // },

  // _getBackReferrer() {
  //   const referrer = this.ctx.get('Referrer');
  //   if (referrer) {
  //     // referrer is an absolute URL, check if it's the same origin
  //     const url = new URL(referrer, this.ctx.href);
  //     if (url.host === this.ctx.host) {
  //       return referrer;
  //     }
  //   }
  // },

  /**
   * Perform a 302 redirect to `url`.
   *
   * The string "back" is special-cased
   * to provide Referrer support, when Referrer
   * is not present `alt` or "/" is used.
   *
   * Examples:
   *
   *    this.redirect('back');
   *    this.redirect('back', '/index.html');
   *    this.redirect('/login');
   *    this.redirect('http://google.com');
   *
   * @param {String} url
   * @param {String} [alt]
   * @api public
   */

  // redirect(url, alt) {
  //   // location
  //   if ('back' === url) {
  //     url = this._getBackReferrer() || alt || '/';
  //   }

  //   if (/^https?:\/\//i.test(url)) {
  //     // formatting url again avoid security escapes
  //     url = new URL(url).toString();
  //   }
  //   this.set('Location', encodeUrl(url));

  //   // status
  //   if (!statuses.redirect[this.status]) this.status = 302;

  //   // html
  //   if (this.ctx.accepts('html')) {
  //     url = escape(url);
  //     this.type = 'text/html; charset=utf-8';
  //     this.body = `Redirecting to ${url}.`;
  //     return;
  //   }

  //   // text
  //   this.type = 'text/plain; charset=utf-8';
  //   this.body = `Redirecting to ${url}.`;
  // },

  /**
   * Set Content-Disposition header to "attachment" with optional `filename`.
   *
   * @param {String} filename
   * @api public
   */

  // attachment(filename, options) {
  //   if (filename) this.type = extname(filename);
  //   this.set('Content-Disposition', contentDisposition(filename, options));
  // },

  /**
   * Set Content-Type response header with `type` through `mime.lookup()`
   * when it does not contain a charset.
   *
   * Examples:
   *
   *     this.type = '.html';
   *     this.type = 'html';
   *     this.type = 'json';
   *     this.type = 'application/json';
   *     this.type = 'png';
   *
   * @param {String} type
   * @api public
   */

  // set type(type) {
  //   type = getType(type);
  //   if (type) {
  //     this.set('Content-Type', type);
  //   } else {
  //     this.remove('Content-Type');
  //   }
  // },

  /**
   * Set the Last-Modified date using a string or a Date.
   *
   *     this.response.lastModified = new Date();
   *     this.response.lastModified = '2013-09-13';
   *
   * @param {String|Date} type
   * @api public
   */

  // set lastModified(val) {
  //   if ('string' === typeof val) val = new Date(val);
  //   this.set('Last-Modified', val.toUTCString());
  // },

  /**
   * Get the Last-Modified date in Date form, if it exists.
   *
   * @return {Date}
   * @api public
   */

  // get lastModified() {
  //   const date = this.get('last-modified');
  //   if (date) return new Date(date);
  // },

  /**
   * Set the ETag of a response.
   * This will normalize the quotes if necessary.
   *
   *     this.response.etag = 'md5hashsum';
   *     this.response.etag = '"md5hashsum"';
   *     this.response.etag = 'W/"123456789"';
   *
   * @param {String} etag
   * @api public
   */

  // set etag(val) {
  //   if (!/^(W\/)?"/.test(val)) val = `"${val}"`;
  //   this.set('ETag', val);
  // },

  /**
   * Get the ETag of a response.
   *
   * @return {String}
   * @api public
   */

  // get etag() {
  //   return this.get('ETag');
  // },

  /**
   * Return the response mime type void of
   * parameters such as "charset".
   *
   * @return {String}
   * @api public
   */

  // get type() {
  //   const type = this.get('Content-Type');
  //   if (!type) return '';
  //   return type.split(';', 1)[0];
  // },

  /**
   * Check whether the response is one of the listed types.
   * Pretty much the same as `this.request.is()`.
   *
   * @param {String|String[]} [type]
   * @param {String[]} [types]
   * @return {String|false}
   * @api public
   */

  // is(type, ...types) {
  //   return typeis(this.type, type, ...types);
  // },

  /**
   * Return response header.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  // get(field) {
  //   return this.header[field.toLowerCase()] || '';
  // },

  /**
   * Returns true if the header identified by name is currently set in the outgoing headers.
   * The header name matching is case-insensitive.
   *
   * Examples:
   *
   *     this.has('Content-Type');
   *     // => true
   *
   *     this.get('content-type');
   *     // => true
   *
   * @param {String} field
   * @return {boolean}
   * @api public
   */

  // has(field) {
  //   return typeof this.res.hasHeader === 'function'
  //     ? this.res.hasHeader(field)
  //     // Node < 7.7
  //     : field.toLowerCase() in this.headers;
  // },

  /**
   * Set header `field` to `val` or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    this.set('Foo', ['bar', 'baz']);
   *    this.set('Accept', 'application/json');
   *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   *
   * @param {String|Object|Array} field
   * @param {String} val
   * @api public
   */

  // set(field, val) {
  //   if (this.headerSent) return;

  //   if (2 === arguments.length) {
  //     if (Array.isArray(val)) val = val.map(v => typeof v === 'string' ? v : String(v));
  //     else if (typeof val !== 'string') val = String(val);
  //     this.res.setHeader(field, val);
  //   } else {
  //     for (const key in field) {
  //       this.set(key, field[key]);
  //     }
  //   }
  // },

  /**
   * Append additional header `field` with value `val`.
   *
   * Examples:
   *
   * ```
   * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
   * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
   * this.append('Warning', '199 Miscellaneous warning');
   * ```
   *
   * @param {String} field
   * @param {String|Array} val
   * @api public
   */

  // append(field, val) {
  //   const prev = this.get(field);

  //   if (prev) {
  //     val = Array.isArray(prev)
  //       ? prev.concat(val)
  //       : [prev].concat(val);
  //   }

  //   return this.set(field, val);
  // },

  /**
   * Remove header `field`.
   *
   * @param {String} name
   * @api public
   */

  // remove(field) {
  //   if (this.headerSent) return;

  //   this.res.removeHeader(field);
  // },

  /**
   * Checks if the request is writable.
   * Tests for the existence of the socket
   * as node sometimes does not set it.
   *
   * @return {Boolean}
   * @api private
   */

  get writable() {
    // // can't write any more after response finished
    // // response.writableEnded is available since Node > 12.9
    // // https://nodejs.org/api/http.html#http_response_writableended
    // // response.finished is undocumented feature of previous Node versions
    // // https://stackoverflow.com/questions/16254385/undocumented-response-finished-in-node-js
    // if (this.res.writableEnded || this.res.finished) return false;

    // const socket = this.res.socket;
    // // There are already pending outgoing res, but still writable
    // // https://github.com/nodejs/node/blob/v4.4.7/lib/_http_server.js#L486
    // if (!socket) return true;
    // return socket.writable;
    return true;
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  // inspect() {
  //   if (!this.res) return;
  //   const o = this.toJSON();
  //   o.body = this.body;
  //   return o;
  // },

  /**
   * Return JSON representation.
   *
   * @return {Object}
   * @api public
   */

  // toJSON() {
  //   return only(this, [
  //     'status',
  //     'message',
  //     'header'
  //   ]);
  // },

  /**
   * Flush any set headers and begin the body
   */

  // flushHeaders() {
  //   this.res.flushHeaders();
  // }
};

function Client$1(opts) {
  this.handleRequest = opts.handleRequest;
}
Client$1.prototype.verb = function (method, pathname, search, form, headers) {
  // console.log(method, pathname, params, form, headers);
  const req = {
    method,
    pathname,
    query: search || {},
    body: form || {},
    headers: headers || {}
  };
  const res = {
    end: resp => Promise.resolve(resp)
  };
  return this.handleRequest(req, res);
};
Client$1.prototype.get = function (pathname, search, form, headers) {
  return this.verb('GET', pathname, search, form, headers);
};
Client$1.prototype.post = function (pathname, search, form, headers) {
  return this.verb('POST', pathname, search, form, headers);
};
Client$1.prototype.put = function (pathname, search, form, headers) {
  return this.verb('PUT', pathname, search, form, headers);
};
Client$1.prototype.del = function (pathname, search, form, headers) {
  return this.verb('DELETE', pathname, search, form, headers);
};
var client = Client$1;

// require('core-js/modules/es.regexp.exec.js');
// require('core-js/modules/es.array.reduce.js');
// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.array.includes.js');
// require('core-js/modules/es.regexp.constructor.js');
// require('core-js/modules/es.promise.js');
// require('core-js/modules/es.string.replace.js');

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.promise.js');

/**
 * Expose compositor.
 */

var src = compose$1;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose$1(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
var compose_1 = src;

// https://github.com/jshttp/methods

var methods$1 = ['ACL', 'BIND', 'CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LINK', 'LOCK', 'M-SEARCH', 'MERGE', 'MKACTIVITY', 'MKCALENDAR', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST', 'PRI', 'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'REBIND', 'REPORT', 'SEARCH', 'SOURCE', 'SUBSCRIBE', 'TRACE', 'UNBIND', 'UNLINK', 'UNLOCK', 'UNSUBSCRIBE'];
var dist = {};
Object.defineProperty(dist, "__esModule", {
  value: true
});
dist.TokenData = void 0;
dist.parse = parse$1;
dist.compile = compile$1;
dist.match = match;
dist.pathToRegexp = pathToRegexp$1;
dist.stringify = stringify;
const DEFAULT_DELIMITER = "/";
const NOOP_VALUE = value => value;
const ID_START = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088F\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5C\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDC-\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7DC\uA7F1-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD40-\uDD59\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDD4A-\uDD65\uDD6F-\uDD85\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC7\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDB0-\uDDDB\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD822\uD840-\uD868\uD86A-\uD86D\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD88C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDE40-\uDE7F\uDEA0-\uDEB8\uDEBB-\uDED3\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3\uDFF2-\uDFF6]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD1E\uDD80-\uDDF2]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDDD0-\uDDED\uDDF0\uDEC0-\uDEDE\uDEE0-\uDEE2\uDEE4\uDEE5\uDEE7-\uDEED\uDEF0-\uDEF4\uDEFE\uDEFF\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEAD\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD88D[\uDC00-\uDC79])$/;
const ID_CONTINUE = /^(?:[\$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u0870-\u0887\u0889-\u088F\u0897-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5C\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDC-\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF3\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECE\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1715\u171F-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1ABF-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B4C\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7DC\uA7F1-\uA827\uA82C\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF65-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD40-\uDD59\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDD30-\uDD39\uDD40-\uDD65\uDD69-\uDD6D\uDD6F-\uDD85\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDEC2-\uDEC7\uDEFA-\uDF1C\uDF27\uDF30-\uDF50\uDF70-\uDF85\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC66-\uDC75\uDC7F-\uDCBA\uDCC2\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E-\uDE41\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7-\uDFC0\uDFC2\uDFC5\uDFC7-\uDFCA\uDFCC-\uDFD3\uDFE1\uDFE2]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDED0-\uDEE3\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF39\uDF40-\uDF46]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCE9\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEB0-\uDEF8\uDF60-\uDF67\uDFC0-\uDFE0\uDFF0-\uDFF9]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDDB0-\uDDDB\uDDE0-\uDDE9\uDEE0-\uDEF6\uDF00-\uDF10\uDF12-\uDF3A\uDF3E-\uDF42\uDF50-\uDF5A\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD822\uD840-\uD868\uD86A-\uD86D\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD88C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC40-\uDC55\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD39]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDD70-\uDD79\uDE40-\uDE7F\uDEA0-\uDEB8\uDEBB-\uDED3\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0-\uDFF6]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD1E\uDD80-\uDDF2]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD833[\uDCF0-\uDCF9\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDC30-\uDC6D\uDC8F\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAE\uDEC0-\uDEF9]|\uD839[\uDCD0-\uDCF9\uDDD0-\uDDFA\uDEC0-\uDEDE\uDEE0-\uDEF5\uDEFE\uDEFF\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEAD\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD88D[\uDC00-\uDC79]|\uDB40[\uDD00-\uDDEF])$/;
const DEBUG_URL = "https://git.new/pathToRegexpError";
const SIMPLE_TOKENS = {
  // Groups.
  "{": "{",
  "}": "}",
  // Reserved.
  "(": "(",
  ")": ")",
  "[": "[",
  "]": "]",
  "+": "+",
  "?": "?",
  "!": "!"
};
/**
 * Escape text for stringify to path.
 */
function escapeText(str) {
  return str.replace(/[{}()\[\]+?!:*]/g, "\\$&");
}
/**
 * Escape a regular expression string.
 */
function escape(str) {
  return str.replace(/[.+*?^${}()[\]|/\\]/g, "\\$&");
}
/**
 * Tokenize input string.
 */
function* lexer(str) {
  const chars = [...str];
  let i = 0;
  function name() {
    let value = "";
    if (ID_START.test(chars[++i])) {
      value += chars[i];
      while (ID_CONTINUE.test(chars[++i])) {
        value += chars[i];
      }
    } else if (chars[i] === '"') {
      let pos = i;
      while (i < chars.length) {
        if (chars[++i] === '"') {
          i++;
          pos = 0;
          break;
        }
        if (chars[i] === "\\") {
          value += chars[++i];
        } else {
          value += chars[i];
        }
      }
      if (pos) {
        throw new TypeError("Unterminated quote at ".concat(pos, ": ").concat(DEBUG_URL));
      }
    }
    if (!value) {
      throw new TypeError("Missing parameter name at ".concat(i, ": ").concat(DEBUG_URL));
    }
    return value;
  }
  while (i < chars.length) {
    const value = chars[i];
    const type = SIMPLE_TOKENS[value];
    if (type) {
      yield {
        type,
        index: i++,
        value
      };
    } else if (value === "\\") {
      yield {
        type: "ESCAPED",
        index: i++,
        value: chars[i++]
      };
    } else if (value === ":") {
      const value = name();
      yield {
        type: "PARAM",
        index: i,
        value
      };
    } else if (value === "*") {
      const value = name();
      yield {
        type: "WILDCARD",
        index: i,
        value
      };
    } else {
      yield {
        type: "CHAR",
        index: i,
        value: chars[i++]
      };
    }
  }
  return {
    type: "END",
    index: i,
    value: ""
  };
}
class Iter {
  constructor(tokens) {
    this.tokens = tokens;
  }
  peek() {
    if (!this._peek) {
      const next = this.tokens.next();
      this._peek = next.value;
    }
    return this._peek;
  }
  tryConsume(type) {
    const token = this.peek();
    if (token.type !== type) return;
    this._peek = undefined; // Reset after consumed.
    return token.value;
  }
  consume(type) {
    const value = this.tryConsume(type);
    if (value !== undefined) return value;
    const {
      type: nextType,
      index
    } = this.peek();
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type, ": ").concat(DEBUG_URL));
  }
  text() {
    let result = "";
    let value;
    while (value = this.tryConsume("CHAR") || this.tryConsume("ESCAPED")) {
      result += value;
    }
    return result;
  }
}
/**
 * Tokenized path instance.
 */
class TokenData {
  constructor(tokens) {
    this.tokens = tokens;
  }
}
dist.TokenData = TokenData;
/**
 * Parse a string for the raw tokens.
 */
function parse$1(str) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    encodePath = NOOP_VALUE
  } = options;
  const it = new Iter(lexer(str));
  function consume(endType) {
    const tokens = [];
    while (true) {
      const path = it.text();
      if (path) tokens.push({
        type: "text",
        value: encodePath(path)
      });
      const param = it.tryConsume("PARAM");
      if (param) {
        tokens.push({
          type: "param",
          name: param
        });
        continue;
      }
      const wildcard = it.tryConsume("WILDCARD");
      if (wildcard) {
        tokens.push({
          type: "wildcard",
          name: wildcard
        });
        continue;
      }
      const open = it.tryConsume("{");
      if (open) {
        tokens.push({
          type: "group",
          tokens: consume("}")
        });
        continue;
      }
      it.consume(endType);
      return tokens;
    }
  }
  const tokens = consume("END");
  return new TokenData(tokens);
}
/**
 * Compile a string to a template function for the path.
 */
function compile$1(path) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    encode = encodeURIComponent,
    delimiter = DEFAULT_DELIMITER
  } = options;
  const data = path instanceof TokenData ? path : parse$1(path, options);
  const fn = tokensToFunction(data.tokens, delimiter, encode);
  return function path() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const [path, ...missing] = fn(data);
    if (missing.length) {
      throw new TypeError("Missing parameters: ".concat(missing.join(", ")));
    }
    return path;
  };
}
function tokensToFunction(tokens, delimiter, encode) {
  const encoders = tokens.map(token => tokenToFunction(token, delimiter, encode));
  return data => {
    const result = [""];
    for (const encoder of encoders) {
      const [value, ...extras] = encoder(data);
      result[0] += value;
      result.push(...extras);
    }
    return result;
  };
}
/**
 * Convert a single token into a path building function.
 */
function tokenToFunction(token, delimiter, encode) {
  if (token.type === "text") return () => [token.value];
  if (token.type === "group") {
    const fn = tokensToFunction(token.tokens, delimiter, encode);
    return data => {
      const [value, ...missing] = fn(data);
      if (!missing.length) return [value];
      return [""];
    };
  }
  const encodeValue = encode || NOOP_VALUE;
  if (token.type === "wildcard" && encode !== false) {
    return data => {
      const value = data[token.name];
      if (value == null) return ["", token.name];
      if (!Array.isArray(value) || value.length === 0) {
        throw new TypeError("Expected \"".concat(token.name, "\" to be a non-empty array"));
      }
      return [value.map((value, index) => {
        if (typeof value !== "string") {
          throw new TypeError("Expected \"".concat(token.name, "/").concat(index, "\" to be a string"));
        }
        return encodeValue(value);
      }).join(delimiter)];
    };
  }
  return data => {
    const value = data[token.name];
    if (value == null) return ["", token.name];
    if (typeof value !== "string") {
      throw new TypeError("Expected \"".concat(token.name, "\" to be a string"));
    }
    return [encodeValue(value)];
  };
}
/**
 * Transform a path into a match function.
 */
function match(path) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    decode = decodeURIComponent,
    delimiter = DEFAULT_DELIMITER
  } = options;
  const {
    regexp,
    keys
  } = pathToRegexp$1(path, options);
  const decoders = keys.map(key => {
    if (decode === false) return NOOP_VALUE;
    if (key.type === "param") return decode;
    return value => value.split(delimiter).map(decode);
  });
  return function match(input) {
    const m = regexp.exec(input);
    if (!m) return false;
    const path = m[0];
    const params = Object.create(null);
    for (let i = 1; i < m.length; i++) {
      if (m[i] === undefined) continue;
      const key = keys[i - 1];
      const decoder = decoders[i - 1];
      params[key.name] = decoder(m[i]);
    }
    return {
      path,
      params
    };
  };
}
function pathToRegexp$1(path) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    delimiter = DEFAULT_DELIMITER,
    end = true,
    sensitive = false,
    trailing = true
  } = options;
  const keys = [];
  const sources = [];
  const flags = sensitive ? "" : "i";
  const paths = Array.isArray(path) ? path : [path];
  const items = paths.map(path => path instanceof TokenData ? path : parse$1(path, options));
  for (const {
    tokens
  } of items) {
    for (const seq of flatten(tokens, 0, [])) {
      const regexp = sequenceToRegExp(seq, delimiter, keys);
      sources.push(regexp);
    }
  }
  let pattern = "^(?:".concat(sources.join("|"), ")");
  if (trailing) pattern += "(?:".concat(escape(delimiter), "$)?");
  pattern += end ? "$" : "(?=".concat(escape(delimiter), "|$)");
  const regexp = new RegExp(pattern, flags);
  return {
    regexp,
    keys
  };
}
/**
 * Generate a flat list of sequence tokens from the given tokens.
 */
function* flatten(tokens, index, init) {
  if (index === tokens.length) {
    return yield init;
  }
  const token = tokens[index];
  if (token.type === "group") {
    const fork = init.slice();
    for (const seq of flatten(token.tokens, 0, fork)) {
      yield* flatten(tokens, index + 1, seq);
    }
  } else {
    init.push(token);
  }
  yield* flatten(tokens, index + 1, init);
}
/**
 * Transform a flat sequence of tokens into a regular expression.
 */
function sequenceToRegExp(tokens, delimiter, keys) {
  let result = "";
  let backtrack = "";
  let isSafeSegmentParam = true;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "text") {
      result += escape(token.value);
      backtrack += token.value;
      isSafeSegmentParam || (isSafeSegmentParam = token.value.includes(delimiter));
      continue;
    }
    if (token.type === "param" || token.type === "wildcard") {
      if (!isSafeSegmentParam && !backtrack) {
        throw new TypeError("Missing text after \"".concat(token.name, "\": ").concat(DEBUG_URL));
      }
      if (token.type === "param") {
        result += "(".concat(negate(delimiter, isSafeSegmentParam ? "" : backtrack), "+)");
      } else {
        result += "([\\s\\S]+)";
      }
      keys.push(token);
      backtrack = "";
      isSafeSegmentParam = false;
      continue;
    }
  }
  return result;
}
function negate(delimiter, backtrack) {
  if (backtrack.length < 2) {
    if (delimiter.length < 2) return "[^".concat(escape(delimiter + backtrack), "]");
    return "(?:(?!".concat(escape(delimiter), ")[^").concat(escape(backtrack), "])");
  }
  if (delimiter.length < 2) {
    return "(?:(?!".concat(escape(backtrack), ")[^").concat(escape(delimiter), "])");
  }
  return "(?:(?!".concat(escape(backtrack), "|").concat(escape(delimiter), ")[\\s\\S])");
}
/**
 * Stringify token data into a path string.
 */
function stringify(data) {
  return data.tokens.map(function stringifyToken(token, index, tokens) {
    if (token.type === "text") return escapeText(token.value);
    if (token.type === "group") {
      return "{".concat(token.tokens.map(stringifyToken).join(""), "}");
    }
    const isSafe = isNameSafe(token.name) && isNextNameSafe(tokens[index + 1]);
    const key = isSafe ? token.name : JSON.stringify(token.name);
    if (token.type === "param") return ":".concat(key);
    if (token.type === "wildcard") return "*".concat(key);
    throw new TypeError("Unexpected token: ".concat(token));
  }).join("");
}
function isNameSafe(name) {
  const [first, ...rest] = name;
  if (!ID_START.test(first)) return false;
  return rest.every(char => ID_CONTINUE.test(char));
}
function isNextNameSafe(token) {
  if ((token === null || token === void 0 ? void 0 : token.type) !== "text") return true;
  return !ID_CONTINUE.test(token.value[0]);
}

// const { parse: parseUrl, format: formatUrl } = require('node:url');

const {
  pathToRegexp,
  compile,
  parse
} = dist;
var layer = class Layer {
  /**
   * Initialize a new routing Layer with given `method`, `path`, and `middleware`.
   *
   * @param {String|RegExp} path Path string or regular expression.
   * @param {Array} methods Array of HTTP verbs.
   * @param {Array} middleware Layer callback/middleware or series of.
   * @param {Object=} opts
   * @param {String=} opts.name route name
   * @param {String=} opts.sensitive case sensitive (default: false)
   * @param {String=} opts.strict require the trailing slash (default: false)
   * @param {Boolean=} opts.pathAsRegExp if true, treat `path` as a regular expression
   * @returns {Layer}
   * @private
   */
  constructor(path, methods, middleware) {
    let opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    this.opts = opts;
    this.name = this.opts.name || null;
    this.methods = [];
    for (const method of methods) {
      const l = this.methods.push(method.toUpperCase());
      if (this.methods[l - 1] === 'GET') this.methods.unshift('HEAD');
    }
    this.stack = Array.isArray(middleware) ? middleware : [middleware];
    // ensure middleware is a function
    for (let i = 0; i < this.stack.length; i++) {
      const fn = this.stack[i];
      const type = typeof fn;
      if (type !== 'function') throw new Error("".concat(methods.toString(), " `").concat(this.opts.name || path, "`: `middleware` must be a function, not `").concat(type, "`"));
    }
    this.path = path;
    this.paramNames = [];
    if (this.opts.pathAsRegExp === true) {
      this.regexp = new RegExp(path);
    } else if (this.path) {
      if ('strict' in this.opts) {
        // path-to-regexp renamed strict to trailing in v8.1.0
        this.opts.trailing = this.opts.strict !== true;
      }
      const {
        regexp,
        keys
      } = pathToRegexp(this.path, this.opts);
      this.regexp = regexp;
      this.paramNames = keys;
    }
  }

  /**
   * Returns whether request `path` matches route.
   *
   * @param {String} path
   * @returns {Boolean}
   * @private
   */
  match(path) {
    return this.regexp.test(path);
  }

  /**
   * Returns map of URL parameters for given `path` and `paramNames`.
   *
   * @param {String} path
   * @param {Array.<String>} captures
   * @param {Object=} params
   * @returns {Object}
   * @private
   */
  params(path, captures) {
    let params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    for (let len = captures.length, i = 0; i < len; i++) {
      if (this.paramNames[i]) {
        const c = captures[i];
        if (c && c.length > 0) params[this.paramNames[i].name] = c ? safeDecodeURIComponent(c) : c;
      }
    }
    return params;
  }

  /**
   * Returns array of regexp url path captures.
   *
   * @param {String} path
   * @returns {Array.<String>}
   * @private
   */
  captures(path) {
    return this.opts.ignoreCaptures ? [] : path.match(this.regexp).slice(1);
  }

  /**
   * Generate URL for route using given `params`.
   *
   * @example
   *
   * ```javascript
   * const route = new Layer('/users/:id', ['GET'], fn);
   *
   * route.url({ id: 123 }); // => "/users/123"
   * ```
   *
   * @param {Object} params url parameters
   * @returns {String}
   * @private
   */
  // url(params, options) {
  //   let args = params;
  //   const url = this.path.replace(/\(\.\*\)/g, '');

  //   if (typeof params !== 'object') {
  //     args = Array.prototype.slice.call(arguments);
  //     if (typeof args[args.length - 1] === 'object') {
  //       options = args[args.length - 1];
  //       args = args.slice(0, -1);
  //     }
  //   }

  //   const toPath = compile(url, { encode: encodeURIComponent, ...options });
  //   let replaced;
  //   const { tokens } = parse(url);
  //   let replace = {};

  //   if (Array.isArray(args)) {
  //     for (let len = tokens.length, i = 0, j = 0; i < len; i++) {
  //       if (tokens[i].name) {
  //         replace[tokens[i].name] = args[j++];
  //       }
  //     }
  //   } else if (tokens.some((token) => token.name)) {
  //     replace = params;
  //   } else if (!options) {
  //     options = params;
  //   }

  //   for (const [key, value] of Object.entries(replace)) {
  //     replace[key] = String(value);
  //   }

  //   replaced = toPath(replace);

  //   if (options && options.query) {
  //     replaced = parseUrl(replaced);
  //     if (typeof options.query === 'string') {
  //       replaced.search = options.query;
  //     } else {
  //       replaced.search = undefined;
  //       replaced.query = options.query;
  //     }

  //     return formatUrl(replaced);
  //   }

  //   return replaced;
  // }

  /**
   * Run validations on route named parameters.
   *
   * @example
   *
   * ```javascript
   * router
   *   .param('user', function (id, ctx, next) {
   *     ctx.user = users[id];
   *     if (!ctx.user) return ctx.status = 404;
   *     next();
   *   })
   *   .get('/users/:user', function (ctx, next) {
   *     ctx.body = ctx.user;
   *   });
   * ```
   *
   * @param {String} param
   * @param {Function} middleware
   * @returns {Layer}
   * @private
   */
  param(param, fn) {
    const {
      stack
    } = this;
    const params = this.paramNames;
    const middleware = function (ctx, next) {
      return fn.call(this, ctx.params[param], ctx, next);
    };
    middleware.param = param;
    const names = params.map(function (p) {
      return p.name;
    });
    const x = names.indexOf(param);
    if (x > -1) {
      // iterate through the stack, to figure out where to place the handler fn
      stack.some((fn, i) => {
        // param handlers are always first, so when we find an fn w/o a param property, stop here
        // if the param handler at this part of the stack comes after the one we are adding, stop here
        if (!fn.param || names.indexOf(fn.param) > x) {
          // inject this param handler right before the current item
          stack.splice(i, 0, middleware);
          return true; // then break the loop
        }
      });
    }
    return this;
  }

  /**
   * Prefix route path.
   *
   * @param {String} prefix
   * @returns {Layer}
   * @private
   */
  // setPrefix(prefix) {
  //   if (this.path) {
  //     this.path =
  //       this.path !== '/' || this.opts.strict === true
  //         ? `${prefix}${this.path}`
  //         : prefix;
  //     if (this.opts.pathAsRegExp === true || prefix instanceof RegExp) {
  //       this.regexp = new RegExp(this.path);
  //     } else if (this.path) {
  //       const { regexp, keys } = pathToRegexp(this.path, this.opts);
  //       this.regexp = regexp;
  //       this.paramNames = keys;
  //     }
  //   }

  //   return this;
  // }
};

/**
 * Safe decodeURIComponent, won't throw any error.
 * If `decodeURIComponent` error happen, just return the original value.
 *
 * @param {String} text
 * @returns {String} URL decode original string.
 * @private
 */

function safeDecodeURIComponent(text) {
  try {
    // TODO: take a look on `safeDecodeURIComponent` if we use it only with route params let's remove the `replace` method otherwise make it flexible.
    // @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent#decoding_query_parameters_from_a_url
    return decodeURIComponent(text.replace(/\+/g, ' '));
  } catch (_unused) {
    return text;
  }
}

// const http = require('node:http');

// const debug = require('debug')('koa-router');

const compose$2 = compose_1;
// const HttpError = require('http-errors');
const methods = methods$1;
// const { pathToRegexp } = require('path-to-regexp');

const Layer = layer;

// const methods = http.METHODS.map((method) => method.toLowerCase());

/**
 * @module koa-router
 */
let Router$1 = class Router {
  /**
   * Create a new router.
   *
   * @example
   *
   * Basic usage:
   *
   * ```javascript
   * const Koa = require('koa');
   * const Router = require('@koa/router');
   *
   * const app = new Koa();
   * const router = new Router();
   *
   * router.get('/', (ctx, next) => {
   *   // ctx.router available
   * });
   *
   * app
   *   .use(router.routes())
   *   .use(router.allowedMethods());
   * ```
   *
   * @alias module:koa-router
   * @param {Object=} opts
   * @param {Boolean=false} opts.exclusive only run last matched route's controller when there are multiple matches
   * @param {String=} opts.prefix prefix router paths
   * @param {String|RegExp=} opts.host host for router match
   * @constructor
   */
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!(this instanceof Router)) return new Router(opts);
    this.opts = opts;
    this.methods = this.opts.methods || ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'];
    this.exclusive = Boolean(this.opts.exclusive);
    this.params = {};
    this.stack = [];
    this.host = this.opts.host;
  }

  /**
   * Generate URL from url pattern and given `params`.
   *
   * @example
   *
   * ```javascript
   * const url = Router.url('/users/:id', {id: 1});
   * // => "/users/1"
   * ```
   *
   * @param {String} path url pattern
   * @param {Object} params url parameters
   * @returns {String}
   */
  // static url(path, ...args) {
  //   return Layer.prototype.url.apply({ path }, args);
  // }

  /**
   * Use given middleware.
   *
   * Middleware run in the order they are defined by `.use()`. They are invoked
   * sequentially, requests start at the first middleware and work their way
   * "down" the middleware stack.
   *
   * @example
   *
   * ```javascript
   * // session middleware will run before authorize
   * router
   *   .use(session())
   *   .use(authorize());
   *
   * // use middleware only with given path
   * router.use('/users', userAuth());
   *
   * // or with an array of paths
   * router.use(['/users', '/admin'], userAuth());
   *
   * app.use(router.routes());
   * ```
   *
   * @param {String=} path
   * @param {Function} middleware
   * @param {Function=} ...
   * @returns {Router}
   */
  // use(...middleware) {
  //   const router = this;
  //   let path;

  //   // support array of paths
  //   if (Array.isArray(middleware[0]) && typeof middleware[0][0] === 'string') {
  //     const arrPaths = middleware[0];
  //     for (const p of arrPaths) {
  //       router.use.apply(router, [p, ...middleware.slice(1)]);
  //     }

  //     return this;
  //   }

  //   const hasPath = typeof middleware[0] === 'string';
  //   if (hasPath) path = middleware.shift();

  //   for (const m of middleware) {
  //     if (m.router) {
  //       const cloneRouter = Object.assign(
  //         Object.create(Router.prototype),
  //         m.router,
  //         {
  //           stack: [...m.router.stack]
  //         }
  //       );

  //       for (let j = 0; j < cloneRouter.stack.length; j++) {
  //         const nestedLayer = cloneRouter.stack[j];
  //         const cloneLayer = Object.assign(
  //           Object.create(Layer.prototype),
  //           nestedLayer
  //         );

  //         if (path) cloneLayer.setPrefix(path);
  //         if (router.opts.prefix) cloneLayer.setPrefix(router.opts.prefix);
  //         router.stack.push(cloneLayer);
  //         cloneRouter.stack[j] = cloneLayer;
  //       }

  //       if (router.params) {
  //         const routerParams = Object.keys(router.params);
  //         for (const key of routerParams) {
  //           cloneRouter.param(key, router.params[key]);
  //         }
  //       }
  //     } else {
  //       const { keys } = pathToRegexp(router.opts.prefix || '', router.opts);
  //       const routerPrefixHasParam = Boolean(
  //         router.opts.prefix && keys.length > 0
  //       );
  //       router.register(path || '([^/]*)', [], m, {
  //         end: false,
  //         ignoreCaptures: !hasPath && !routerPrefixHasParam,
  //         pathAsRegExp: true
  //       });
  //     }
  //   }

  //   return this;
  // }

  /**
   * Set the path prefix for a Router instance that was already initialized.
   *
   * @example
   *
   * ```javascript
   * router.prefix('/things/:thing_id')
   * ```
   *
   * @param {String} prefix
   * @returns {Router}
   */
  // prefix(prefix) {
  //   prefix = prefix.replace(/\/$/, '');

  //   this.opts.prefix = prefix;

  //   for (let i = 0; i < this.stack.length; i++) {
  //     const route = this.stack[i];
  //     route.setPrefix(prefix);
  //   }

  //   return this;
  // }

  /**
   * Returns router middleware which dispatches a route matching the request.
   *
   * @returns {Function}
   */
  middleware() {
    const router = this;
    const dispatch = (ctx, next) => {
      // debug('%s %s', ctx.method, ctx.path);

      // const hostMatched = router.matchHost(ctx.host);

      // if (!hostMatched) {
      //   return next();
      // }

      const path = router.opts.routerPath || ctx.newRouterPath || ctx.path || ctx.routerPath;
      const matched = router.match(path, ctx.method);
      if (ctx.matched) {
        ctx.matched.push.apply(ctx.matched, matched.path);
      } else {
        ctx.matched = matched.path;
      }
      ctx.router = router;
      if (!matched.route) return next();
      const matchedLayers = matched.pathAndMethod;
      const mostSpecificLayer = matchedLayers[matchedLayers.length - 1];
      ctx._matchedRoute = mostSpecificLayer.path;
      if (mostSpecificLayer.name) {
        ctx._matchedRouteName = mostSpecificLayer.name;
      }
      const layerChain = (router.exclusive ? [mostSpecificLayer] : matchedLayers).reduce((memo, layer) => {
        memo.push((ctx, next) => {
          ctx.captures = layer.captures(path, ctx.captures);
          ctx.request.params = layer.params(path, ctx.captures, ctx.params);
          ctx.params = ctx.request.params;
          ctx.routerPath = layer.path;
          ctx.routerName = layer.name;
          ctx._matchedRoute = layer.path;
          if (layer.name) {
            ctx._matchedRouteName = layer.name;
          }
          return next();
        });
        return [...memo, ...layer.stack];
      }, []);
      return compose$2(layerChain)(ctx, next);
    };
    dispatch.router = this;
    return dispatch;
  }
  routes() {
    return this.middleware();
  }

  /**
   * Returns separate middleware for responding to `OPTIONS` requests with
   * an `Allow` header containing the allowed methods, as well as responding
   * with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
   *
   * @example
   *
   * ```javascript
   * const Koa = require('koa');
   * const Router = require('@koa/router');
   *
   * const app = new Koa();
   * const router = new Router();
   *
   * app.use(router.routes());
   * app.use(router.allowedMethods());
   * ```
   *
   * **Example with [Boom](https://github.com/hapijs/boom)**
   *
   * ```javascript
   * const Koa = require('koa');
   * const Router = require('@koa/router');
   * const Boom = require('boom');
   *
   * const app = new Koa();
   * const router = new Router();
   *
   * app.use(router.routes());
   * app.use(router.allowedMethods({
   *   throw: true,
   *   notImplemented: () => new Boom.notImplemented(),
   *   methodNotAllowed: () => new Boom.methodNotAllowed()
   * }));
   * ```
   *
   * @param {Object=} options
   * @param {Boolean=} options.throw throw error instead of setting status and header
   * @param {Function=} options.notImplemented throw the returned value in place of the default NotImplemented error
   * @param {Function=} options.methodNotAllowed throw the returned value in place of the default MethodNotAllowed error
   * @returns {Function}
   */
  // allowedMethods(options = {}) {
  //   const implemented = this.methods;

  //   return (ctx, next) => {
  //     return next().then(() => {
  //       const allowed = {};

  //       if (ctx.matched && (!ctx.status || ctx.status === 404)) {
  //         for (let i = 0; i < ctx.matched.length; i++) {
  //           const route = ctx.matched[i];
  //           for (let j = 0; j < route.methods.length; j++) {
  //             const method = route.methods[j];
  //             allowed[method] = method;
  //           }
  //         }

  //         const allowedArr = Object.keys(allowed);
  //         if (!implemented.includes(ctx.method)) {
  //           if (options.throw) {
  //             const notImplementedThrowable =
  //               typeof options.notImplemented === 'function'
  //                 ? options.notImplemented() // set whatever the user returns from their function
  //                 : new HttpError.NotImplemented();

  //             throw notImplementedThrowable;
  //           } else {
  //             ctx.status = 501;
  //             ctx.set('Allow', allowedArr.join(', '));
  //           }
  //         } else if (allowedArr.length > 0) {
  //           if (ctx.method === 'OPTIONS') {
  //             ctx.status = 200;
  //             ctx.body = '';
  //             ctx.set('Allow', allowedArr.join(', '));
  //           } else if (!allowed[ctx.method]) {
  //             if (options.throw) {
  //               const notAllowedThrowable =
  //                 typeof options.methodNotAllowed === 'function'
  //                   ? options.methodNotAllowed() // set whatever the user returns from their function
  //                   : new HttpError.MethodNotAllowed();

  //               throw notAllowedThrowable;
  //             } else {
  //               ctx.status = 405;
  //               ctx.set('Allow', allowedArr.join(', '));
  //             }
  //           }
  //         }
  //       }
  //     });
  //   };
  // }

  /**
   * Register route with all methods.
   *
   * @param {String} name Optional.
   * @param {String} path
   * @param {Function=} middleware You may also pass multiple middleware.
   * @param {Function} callback
   * @returns {Router}
   */
  // all(name, path, middleware) {
  //   if (typeof path === 'string' || path instanceof RegExp) {
  //     middleware = Array.prototype.slice.call(arguments, 2);
  //   } else {
  //     middleware = Array.prototype.slice.call(arguments, 1);
  //     path = name;
  //     name = null;
  //   }

  //   // Sanity check to ensure we have a viable path candidate (eg: string|regex|non-empty array)
  //   if (
  //     typeof path !== 'string' &&
  //     !(path instanceof RegExp) &&
  //     (!Array.isArray(path) || path.length === 0)
  //   )
  //     throw new Error('You have to provide a path when adding an all handler');

  //   const opts = {
  //     name,
  //     pathAsRegExp: path instanceof RegExp
  //   };

  //   this.register(path, methods, middleware, { ...this.opts, ...opts });

  //   return this;
  // }

  /**
   * Redirect `source` to `destination` URL with optional 30x status `code`.
   *
   * Both `source` and `destination` can be route names.
   *
   * ```javascript
   * router.redirect('/login', 'sign-in');
   * ```
   *
   * This is equivalent to:
   *
   * ```javascript
   * router.all('/login', ctx => {
   *   ctx.redirect('/sign-in');
   *   ctx.status = 301;
   * });
   * ```
   *
   * @param {String} source URL or route name.
   * @param {String} destination URL or route name.
   * @param {Number=} code HTTP status code (default: 301).
   * @returns {Router}
   */
  // redirect(source, destination, code) {
  //   // lookup source route by name
  //   if (typeof source === 'symbol' || source[0] !== '/') {
  //     source = this.url(source);
  //     if (source instanceof Error) throw source;
  //   }

  //   // lookup destination route by name
  //   if (
  //     typeof destination === 'symbol' ||
  //     (destination[0] !== '/' && !destination.includes('://'))
  //   ) {
  //     destination = this.url(destination);
  //     if (destination instanceof Error) throw destination;
  //   }

  //   return this.all(source, (ctx) => {
  //     ctx.redirect(destination);
  //     ctx.status = code || 301;
  //   });
  // }

  /**
   * Create and register a route.
   *
   * @param {String} path Path string.
   * @param {Array.<String>} methods Array of HTTP verbs.
   * @param {Function} middleware Multiple middleware also accepted.
   * @returns {Layer}
   * @private
   */
  register(path, methods, middleware) {
    let newOpts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    const router = this;
    const {
      stack
    } = this;
    const opts = _objectSpread2(_objectSpread2({}, this.opts), newOpts);
    // support array of paths
    if (Array.isArray(path)) {
      for (const curPath of path) {
        router.register.call(router, curPath, methods, middleware, opts);
      }
      return this;
    }

    // create route
    const route = new Layer(path, methods, middleware, {
      end: opts.end === false ? opts.end : true,
      name: opts.name,
      sensitive: opts.sensitive || false,
      strict: opts.strict || false,
      prefix: opts.prefix || '',
      ignoreCaptures: opts.ignoreCaptures,
      pathAsRegExp: opts.pathAsRegExp
    });

    // if parent prefix exists, add prefix to new route
    if (this.opts.prefix) {
      route.setPrefix(this.opts.prefix);
    }

    // add parameter middleware
    for (let i = 0; i < Object.keys(this.params).length; i++) {
      const param = Object.keys(this.params)[i];
      route.param(param, this.params[param]);
    }
    stack.push(route);

    // debug('defined route %s %s', route.methods, route.path);

    return route;
  }

  /**
   * Lookup route with given `name`.
   *
   * @param {String} name
   * @returns {Layer|false}
   */
  // route(name) {
  //   const routes = this.stack;

  //   for (let len = routes.length, i = 0; i < len; i++) {
  //     if (routes[i].name && routes[i].name === name) return routes[i];
  //   }

  //   return false;
  // }

  /**
   * Generate URL for route. Takes a route name and map of named `params`.
   *
   * @example
   *
   * ```javascript
   * router.get('user', '/users/:id', (ctx, next) => {
   *   // ...
   * });
   *
   * router.url('user', 3);
   * // => "/users/3"
   *
   * router.url('user', { id: 3 });
   * // => "/users/3"
   *
   * router.use((ctx, next) => {
   *   // redirect to named route
   *   ctx.redirect(ctx.router.url('sign-in'));
   * })
   *
   * router.url('user', { id: 3 }, { query: { limit: 1 } });
   * // => "/users/3?limit=1"
   *
   * router.url('user', { id: 3 }, { query: "limit=1" });
   * // => "/users/3?limit=1"
   * ```
   *
   * @param {String} name route name
   * @param {Object} params url parameters
   * @param {Object} [options] options parameter
   * @param {Object|String} [options.query] query options
   * @returns {String|Error}
   */
  // url(name, ...args) {
  //   const route = this.route(name);
  //   if (route) return route.url.apply(route, args);

  //   return new Error(`No route found for name: ${String(name)}`);
  // }

  /**
   * Match given `path` and return corresponding routes.
   *
   * @param {String} path
   * @param {String} method
   * @returns {Object.<path, pathAndMethod>} returns layers that matched path and
   * path and method.
   * @private
   */
  match(path, method) {
    const layers = this.stack;
    let layer;
    const matched = {
      path: [],
      pathAndMethod: [],
      route: false
    };
    for (let len = layers.length, i = 0; i < len; i++) {
      layer = layers[i];

      // debug('test %s %s', layer.path, layer.regexp);

      if (layer.match(path)) {
        matched.path.push(layer);
        if (layer.methods.length === 0 || layer.methods.includes(method)) {
          matched.pathAndMethod.push(layer);
          if (layer.methods.length > 0) matched.route = true;
        }
      }
    }
    return matched;
  }

  /**
   * Match given `input` to allowed host
   * @param {String} input
   * @returns {boolean}
   */
  // matchHost(input) {
  //   const { host } = this;

  //   if (!host) {
  //     return true;
  //   }

  //   if (!input) {
  //     return false;
  //   }

  //   if (typeof host === 'string') {
  //     return input === host;
  //   }

  //   if (typeof host === 'object' && host instanceof RegExp) {
  //     return host.test(input);
  //   }
  // }

  /**
   * Run middleware for named route parameters. Useful for auto-loading or
   * validation.
   *
   * @example
   *
   * ```javascript
   * router
   *   .param('user', (id, ctx, next) => {
   *     ctx.user = users[id];
   *     if (!ctx.user) return ctx.status = 404;
   *     return next();
   *   })
   *   .get('/users/:user', ctx => {
   *     ctx.body = ctx.user;
   *   })
   *   .get('/users/:user/friends', ctx => {
   *     return ctx.user.getFriends().then(function(friends) {
   *       ctx.body = friends;
   *     });
   *   })
   *   // /users/3 => {"id": 3, "name": "Alex"}
   *   // /users/3/friends => [{"id": 4, "name": "TJ"}]
   * ```
   *
   * @param {String} param
   * @param {Function} middleware
   * @returns {Router}
   */
  // param(param, middleware) {
  //   this.params[param] = middleware;
  //   for (let i = 0; i < this.stack.length; i++) {
  //     const route = this.stack[i];
  //     route.param(param, middleware);
  //   }

  //   return this;
  // }
};

/**
 * Create `router.verb()` methods, where *verb* is one of the HTTP verbs such
 * as `router.get()` or `router.post()`.
 *
 * Match URL patterns to callback functions or controller actions using `router.verb()`,
 * where **verb** is one of the HTTP verbs such as `router.get()` or `router.post()`.
 *
 * Additionally, `router.all()` can be used to match against all methods.
 *
 * ```javascript
 * router
 *   .get('/', (ctx, next) => {
 *     ctx.body = 'Hello World!';
 *   })
 *   .post('/users', (ctx, next) => {
 *     // ...
 *   })
 *   .put('/users/:id', (ctx, next) => {
 *     // ...
 *   })
 *   .del('/users/:id', (ctx, next) => {
 *     // ...
 *   })
 *   .all('/users/:id', (ctx, next) => {
 *     // ...
 *   });
 * ```
 *
 * When a route is matched, its path is available at `ctx._matchedRoute` and if named,
 * the name is available at `ctx._matchedRouteName`
 *
 * Route paths will be translated to regular expressions using
 * [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
 *
 * Query strings will not be considered when matching requests.
 *
 * #### Named routes
 *
 * Routes can optionally have names. This allows generation of URLs and easy
 * renaming of URLs during development.
 *
 * ```javascript
 * router.get('user', '/users/:id', (ctx, next) => {
 *  // ...
 * });
 *
 * router.url('user', 3);
 * // => "/users/3"
 * ```
 *
 * #### Multiple middleware
 *
 * Multiple middleware may be given:
 *
 * ```javascript
 * router.get(
 *   '/users/:id',
 *   (ctx, next) => {
 *     return User.findOne(ctx.params.id).then(function(user) {
 *       ctx.user = user;
 *       next();
 *     });
 *   },
 *   ctx => {
 *     console.log(ctx.user);
 *     // => { id: 17, name: "Alex" }
 *   }
 * );
 * ```
 *
 * ### Nested routers
 *
 * Nesting routers is supported:
 *
 * ```javascript
 * const forums = new Router();
 * const posts = new Router();
 *
 * posts.get('/', (ctx, next) => {...});
 * posts.get('/:pid', (ctx, next) => {...});
 * forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());
 *
 * // responds to "/forums/123/posts" and "/forums/123/posts/123"
 * app.use(forums.routes());
 * ```
 *
 * #### Router prefixes
 *
 * Route paths can be prefixed at the router level:
 *
 * ```javascript
 * const router = new Router({
 *   prefix: '/users'
 * });
 *
 * router.get('/', ...); // responds to "/users"
 * router.get('/:id', ...); // responds to "/users/:id"
 * ```
 *
 * #### URL parameters
 *
 * Named route parameters are captured and added to `ctx.params`.
 *
 * ```javascript
 * router.get('/:category/:title', (ctx, next) => {
 *   console.log(ctx.params);
 *   // => { category: 'programming', title: 'how-to-node' }
 * });
 * ```
 *
 * The [path-to-regexp](https://github.com/pillarjs/path-to-regexp) module is
 * used to convert paths to regular expressions.
 *
 *
 * ### Match host for each router instance
 *
 * ```javascript
 * const router = new Router({
 *    host: 'example.domain' // only match if request host exactly equal `example.domain`
 * });
 *
 * ```
 *
 * OR host cloud be a regexp
 *
 * ```javascript
 * const router = new Router({
 *     host: /.*\.?example\.domain$/ // all host end with .example.domain would be matched
 * });
 * ```
 *
 * @name get|put|post|patch|delete|del
 * @memberof module:koa-router.prototype
 * @param {String} path
 * @param {Function=} middleware route middleware(s)
 * @param {Function} callback route callback
 * @returns {Router}
 */
for (const method_ of methods) {
  function setMethodVerb(method) {
    Router$1.prototype[method] = function (name, path, middleware) {
      if (typeof path === 'string' || path instanceof RegExp) {
        middleware = Array.prototype.slice.call(arguments, 2);
      } else {
        middleware = Array.prototype.slice.call(arguments, 1);
        path = name;
        name = null;
      }

      // Sanity check to ensure we have a viable path candidate (eg: string|regex|non-empty array)
      if (typeof path !== 'string' && !(path instanceof RegExp) && (!Array.isArray(path) || path.length === 0)) throw new Error("You have to provide a path when adding a ".concat(method, " handler"));
      const opts = {
        name,
        pathAsRegExp: path instanceof RegExp
      };

      // pass opts to register call on verb methods
      this.register(path, [method], middleware, _objectSpread2(_objectSpread2({}, this.opts), opts));
      return this;
    };
  }
  setMethodVerb(method_);
}

// Alias for `router.delete()` because delete is a reserved word

Router$1.prototype.del = Router$1.prototype['delete'];
Router$1.prototype.verb = function (method, pathToMath, action) {
  const verb = method.toUpperCase();
  this[verb](pathToMath, action);
};
var router = Router$1;
var router_1 = router;

/**
 * Module dependencies.
 */

// const isGeneratorFunction = require('is-generator-function');
// const debug = require('debug')('koa:application');
// const onFinished = require('on-finished');
// const assert = require('assert');
const compose = compose_1$1;
const context = contextExports;
const request = request$1;
const response = response$1;
// const statuses = require('statuses');
// const Emitter = require('events');
// const util = require('util');
// const Stream = require('stream');
// const http = require('http');
// const only = require('only');
// const convert = require('koa-convert');
// const deprecate = require('depd')('koa');
// const { HttpError } = require('http-errors');
const Client = client;
const Router = router_1;

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

var application = class Application /* extends Emitter */ {
  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  /**
    *
    * @param {object} [options] Application options
    * @param {string} [options.env='development'] Environment
    * @param {string[]} [options.keys] Signed cookie keys
    * @param {boolean} [options.proxy] Trust proxy headers
    * @param {number} [options.subdomainOffset] Subdomain offset
    * @param {string} [options.proxyIpHeader] Proxy IP header, defaults to X-Forwarded-For
    * @param {number} [options.maxIpsCount] Max IPs read from proxy IP header, default to 0 (means infinity)
    *
    */

  constructor(options) {
    // super();
    options = options || {};
    // this.proxy = options.proxy || false;
    // this.subdomainOffset = options.subdomainOffset || 2;
    // this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
    // this.maxIpsCount = options.maxIpsCount || 0;
    this.env = options.env || process.env.NODE_ENV || 'development';
    if (options.keys) this.keys = options.keys;
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    // util.inspect.custom support for node 6+
    // /* istanbul ignore else */
    // if (util.inspect.custom) {
    //   this[util.inspect.custom] = this.inspect;
    // }
    // if (options.asyncLocalStorage) {
    //   const { AsyncLocalStorage } = require('async_hooks');
    //   assert(AsyncLocalStorage, 'Requires node 12.17.0 or higher to enable asyncLocalStorage');
    //   this.ctxStorage = new AsyncLocalStorage();
    // }

    this.router = new Router({
      exclusive: true
    });
    this.use(this.router.routes());
    this.listen();
  }

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  listen() {
    // debug('listen');
    // const server = http.createServer(this.callback());
    // return server.listen(...args);
    const handleRequest = this.callback();
    this.client = new Client({
      handleRequest
    });
  }

  /**
   * Return JSON representation.
   * We only bother showing settings.
   *
   * @return {Object}
   * @api public
   */

  // toJSON() {
  //   return only(this, [
  //     'subdomainOffset',
  //     'proxy',
  //     'env'
  //   ]);
  // }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  // inspect() {
  //   return this.toJSON();
  // }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    // if (isGeneratorFunction(fn)) {
    //   deprecate('Support for generators will be removed in v3. ' +
    //             'See the documentation for examples of how to convert old middleware ' +
    //             'https://github.com/koajs/koa/blob/master/docs/migration.md');
    //   fn = convert(fn);
    // }
    // debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
    const fn = compose(this.middleware);

    // if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      // if (!this.ctxStorage) {
      return this.handleRequest(ctx, fn);
      // }
      // return this.ctxStorage.run(ctx, async() => {
      //   return await this.handleRequest(ctx, fn);
      // });
    };
    return handleRequest;
  }

  /**
   * return currnect contenxt from async local storage
   */
  // get currentContext() {
  //   if (this.ctxStorage) return this.ctxStorage.getStore();
  // }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    // onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }

  /**
   * Initialize a new context.
   *
   * @api private
   */

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    // request.ctx = response.ctx = context;
    // request.response = response;
    // response.request = request;
    // context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    // When dealing with cross-globals a normal `instanceof` check doesn't work properly.
    // See https://github.com/koajs/koa/issues/1466
    // We can probably remove it once jest fixes https://github.com/facebook/jest/issues/2549.
    const isNativeError = Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error;
    if (!isNativeError) throw new TypeError(util.format('non-error thrown: %j', err));
    if (404 === err.status || err.expose) return;
    if (this.silent) return;
    const msg = err.stack || err.toString();
    console.error("\n".concat(msg.replace(/^/gm, '  '), "\n"));
  }

  /**
   * Help TS users comply to CommonJS, ESM, bundler mismatch.
   * @see https://github.com/koajs/koa/issues/1513
   */

  static get default() {
    return Application;
  }

  // createAsyncCtxStorageMiddleware() {
  //   const app = this;
  //   return async function asyncCtxStorage(ctx, next) {
  //     await app.ctxStorage.run(ctx, async() => {
  //       return await next();
  //     });
  //   };
  // }
};

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;
  if (!ctx.writable) return;
  const res = ctx.res;
  let body = ctx.body;
  ctx.status;

  // ignore body
  // if (statuses.empty[code]) {
  //   // strip headers
  //   ctx.body = null;
  //   return res.end();
  // }

  // if ('HEAD' === ctx.method) {
  //   if (!res.headersSent && !ctx.response.has('Content-Length')) {
  //     const { length } = ctx.response;
  //     if (Number.isInteger(length)) ctx.length = length;
  //   }
  //   return res.end();
  // }

  // status body
  if (null == body) {
    // if (ctx.response._explicitNullBody) {
    //   ctx.response.remove('Content-Type');
    //   ctx.response.remove('Transfer-Encoding');
    //   return res.end();
    // }
    // if (ctx.req.httpVersionMajor >= 2) {
    //   body = String(code);
    // } else {
    //   body = ctx.message || String(code);
    // }
    // if (!res.headersSent) {
    //   ctx.type = 'text';
    //   ctx.length = Buffer.byteLength(body);
    // }
    // return res.end(body);
    ctx.throw(res.statusCode);
  }

  // responses
  // if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' === typeof body) return res.end(body);
  // if (body instanceof Stream) return body.pipe(res);

  // body: json
  // body = JSON.stringify(body);
  // if (!res.headersSent) {
  //   ctx.length = Buffer.byteLength(body);
  // }
  // res.end(body);
  return res.end(body);
}

module.exports = application;
