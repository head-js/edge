'use strict';

// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/es.object.to-string.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.object.create.js');
// require('core-js/modules/es.date.to-string.js');
// require('core-js/modules/es.regexp.to-string.js');
// require('core-js/modules/es.regexp.exec.js');
// require('core-js/modules/es.string.replace.js');
// require('core-js/modules/es.array.reduce.js');
// require('core-js/modules/es.array.concat.js');
// require('core-js/modules/es.array.is-array.js');
// require('core-js/modules/es.string.iterator.js');
// require('core-js/modules/es.promise.js');
// require('core-js/modules/es.function.bind.js');
// require('core-js/modules/es.object.define-property.js');
// require('core-js/modules/es.array.for-each.js');
// require('core-js/modules/web.dom-collections.for-each.js');
// require('core-js/modules/es.object.keys.js');
// require('core-js/modules/es.object.get-own-property-descriptor.js');
// require('core-js/modules/es.array.index-of.js');
// require('core-js/modules/es.array.map.js');
// require('core-js/modules/es.regexp.constructor.js');
// require('core-js/modules/es.function.name.js');
// require('core-js/modules/es.string.split.js');
// require('core-js/modules/es.array.join.js');
// require('core-js/modules/es.string.ends-with.js');
// require('core-js/modules/es.object.freeze.js');
// require('core-js/modules/es.symbol.js');
// require('core-js/modules/es.symbol.description.js');
// require('core-js/modules/es.symbol.iterator.js');
// require('core-js/modules/es.string.match.js');
// require('core-js/modules/es.array.slice.js');
// require('core-js/modules/es.array.some.js');
// require('core-js/modules/es.array.splice.js');

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
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
function _typeof$1(o) {
  "@babel/helpers - typeof";

  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$1(o);
}

// require('core-js/modules/es.array.reduce.js');
// require('core-js/modules/es.object.to-string.js');
// require('core-js/modules/es.array.concat.js');
// require('core-js/modules/es.array.is-array.js');
// require('core-js/modules/es.string.iterator.js');
// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.promise.js');
// require('core-js/modules/es.function.bind.js');

/**
 * Expose compositor.
 */

var src$1 = compose$3;
function flatten$1(arr) {
  return arr.reduce(function (acc, next) {
    return acc.concat(Array.isArray(next) ? flatten$1(next) : next);
  }, []);
}

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
  middleware = flatten$1(middleware);
  for (var fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    var index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      var fn = middleware[i];
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
var delegate = delegates;
// const statuses = require('statuses');
// const Cookies = require('cookies');

// const COOKIES = Symbol('context#cookies');

/**
 * Context prototype.
 */

var proto = context$1.exports = {
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
  "throw": function _throw(status, message, extra) {
    // throw createError(...args);
    var err = new Error(message || status); // TODO: || statuses[status].message
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
  onerror: function onerror(err) {
    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) return;

    // When dealing with cross-globals a normal `instanceof` check doesn't work properly.
    // See https://github.com/koajs/koa/issues/1466
    // We can probably remove it once jest fixes https://github.com/facebook/jest/issues/2549.
    var isNativeError = Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error;
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
    // // if ('number' !== typeof statusCode || !statuses[statusCode]) statusCode = 500;
    // if ('number' !== typeof statusCode) statusCode = 500;

    // // respond
    // // const code = statuses[statusCode];
    // const code = statusCode;
    // const msg = err.expose ? err.message : code;
    // this.status = err.status = statusCode;
    // this.length = Buffer.byteLength(msg);
    // res.end(msg);
  } // get cookies() {
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
  //   return host.split(/\s*,\s*/, 1)[0];
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
  //   return proto ? proto.split(/\s*,\s*/, 1)[0] : 'http';
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
  //     ? val.split(/\s*,\s*/)
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
  //   if ('back' === url) url = this.ctx.get('Referrer') || alt || '/';
  //   this.set('Location', encodeUrl(url));

  //   // status
  //   if (!statuses.redirect[this.status]) this.status = 302;

  //   // html
  //   if (this.ctx.accepts('html')) {
  //     url = escape(url);
  //     this.type = 'text/html; charset=utf-8';
  //     this.body = `Redirecting to <a href="${url}">${url}</a>.`;
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
  var req = {
    method: method,
    pathname: pathname,
    query: search || {},
    body: form || {},
    headers: headers || {}
  };
  var res = {
    end: function end(resp) {
      return Promise.resolve(resp);
    }
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

// require('core-js/modules/es.string.iterator.js');
// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.regexp.exec.js');
// require('core-js/modules/es.string.match.js');
// require('core-js/modules/es.function.name.js');
// require('core-js/modules/es.array.reduce.js');
// require('core-js/modules/es.object.to-string.js');
// require('core-js/modules/es.array.concat.js');
// require('core-js/modules/es.array.is-array.js');
// require('core-js/modules/es.object.keys.js');
// require('core-js/modules/es.array.index-of.js');
// require('core-js/modules/es.regexp.constructor.js');
// require('core-js/modules/es.regexp.to-string.js');
// require('core-js/modules/es.array.slice.js');
// require('core-js/modules/es.promise.js');
// require('core-js/modules/es.function.bind.js');
// require('core-js/modules/es.date.to-string.js');
// require('core-js/modules/es.array.map.js');
// require('core-js/modules/es.array.some.js');
// require('core-js/modules/es.array.splice.js');

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n["default"];
  if (typeof f == "function") {
    var a = function a() {
      if (this instanceof a) {
        var args = [null];
        args.push.apply(args, arguments);
        var Ctor = Function.bind.apply(f, args);
        return new Ctor();
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {
    value: true
  });
  Object.keys(n).forEach(function (k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function get() {
        return n[k];
      }
    });
  });
  return a;
}

// require('core-js/modules/es.array.reduce.js');
// require('core-js/modules/es.object.to-string.js');
// require('core-js/modules/es.array.concat.js');
// require('core-js/modules/es.array.is-array.js');
// require('core-js/modules/es.string.iterator.js');
// require('core-js/modules/es.array.iterator.js');
// require('core-js/modules/web.dom-collections.iterator.js');
// require('core-js/modules/es.promise.js');
// require('core-js/modules/es.function.bind.js');

/**
 * Expose compositor.
 */

var src = compose$1;
function flatten(arr) {
  return arr.reduce(function (acc, next) {
    return acc.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

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
  middleware = flatten(middleware);
  for (var fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    var index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      var fn = middleware[i];
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

/**
 * Tokenize input string.
 */
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var _char = str[i];
    if (_char === "*" || _char === "+" || _char === "?") {
      tokens.push({
        type: "MODIFIER",
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (_char === "\\") {
      tokens.push({
        type: "ESCAPED_CHAR",
        index: i++,
        value: str[i++]
      });
      continue;
    }
    if (_char === "{") {
      tokens.push({
        type: "OPEN",
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (_char === "}") {
      tokens.push({
        type: "CLOSE",
        index: i,
        value: str[i++]
      });
      continue;
    }
    if (_char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
        // `0-9`
        code >= 48 && code <= 57 ||
        // `A-Z`
        code >= 65 && code <= 90 ||
        // `a-z`
        code >= 97 && code <= 122 ||
        // `_`
        code === 95) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name) throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({
        type: "NAME",
        index: i,
        value: name
      });
      i = j;
      continue;
    }
    if (_char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count) throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern) throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({
        type: "PATTERN",
        index: i,
        value: pattern
      });
      i = j;
      continue;
    }
    tokens.push({
      type: "CHAR",
      index: i,
      value: str[i++]
    });
  }
  tokens.push({
    type: "END",
    index: i,
    value: ""
  });
  return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes,
    prefixes = _a === void 0 ? "./" : _a;
  var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = function tryConsume(type) {
    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
  };
  var mustConsume = function mustConsume(type) {
    var value = tryConsume(type);
    if (value !== undefined) return value;
    var _a = tokens[i],
      nextType = _a.type,
      index = _a.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function consumeText() {
    var result = "";
    var value;
    while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result += value;
    }
    return result;
  };
  while (i < tokens.length) {
    var _char2 = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = _char2 || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix: prefix,
        suffix: "",
        pattern: pattern || defaultPattern,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = _char2 || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
        prefix: prefix,
        suffix: suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode,
    encode = _a === void 0 ? function (x) {
      return x;
    } : _a,
    _b = options.validate,
    validate = _b === void 0 ? true : _b;
  // Compile all the tokens into regexps.
  var matches = tokens.map(function (token) {
    if (_typeof$1(token) === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function (data) {
    var path = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path += token;
        continue;
      }
      var value = data ? data[token.name] : undefined;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
        }
        if (value.length === 0) {
          if (optional) continue;
          throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
          }
          path += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
        }
        path += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional) continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
    }
    return path;
  };
}
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match(str, options) {
  var keys = [];
  var re = pathToRegexp$1(str, keys, options);
  return regexpToFunction(re, keys, options);
}
/**
 * Create a path match function from `path-to-regexp` output.
 */
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode,
    decode = _a === void 0 ? function (x) {
      return x;
    } : _a;
  return function (pathname) {
    var m = re.exec(pathname);
    if (!m) return false;
    var path = m[0],
      index = m.index;
    var params = Object.create(null);
    var _loop_1 = function _loop_1(i) {
      if (m[i] === undefined) return "continue";
      var key = keys[i - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return {
      path: path,
      index: index,
      params: params
    };
  };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
  if (!keys) return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function (path) {
    return pathToRegexp$1(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict,
    strict = _a === void 0 ? false : _a,
    _b = options.start,
    start = _b === void 0 ? true : _b,
    _c = options.end,
    end = _c === void 0 ? true : _c,
    _d = options.encode,
    encode = _d === void 0 ? function (x) {
      return x;
    } : _d,
    _e = options.delimiter,
    delimiter = _e === void 0 ? "/#?" : _e,
    _f = options.endsWith,
    endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  // Iterate over the tokens and create our regexp string.
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys) keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
          } else {
            route += "(".concat(token.pattern, ")").concat(token.modifier);
          }
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict) route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === undefined;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
function pathToRegexp$1(path, keys, options) {
  if (path instanceof RegExp) return regexpToRegexp(path, keys);
  if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
var dist_es2015 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  compile: compile,
  match: match,
  parse: parse,
  pathToRegexp: pathToRegexp$1,
  regexpToFunction: regexpToFunction,
  tokensToFunction: tokensToFunction,
  tokensToRegexp: tokensToRegexp
});
var require$$2 = /*@__PURE__*/getAugmentedNamespace(dist_es2015);
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

// const { parse: parseUrl, format: formatUrl } = require('url');
var pathToRegexp = require$$2.pathToRegexp;
require$$2.compile;
require$$2.parse;
var layer = Layer$1;

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
 * @returns {Layer}
 * @private
 */

function Layer$1(path, methods, middleware) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  this.opts = opts;
  this.name = this.opts.name || null;
  this.methods = [];
  this.paramNames = [];
  this.stack = Array.isArray(middleware) ? middleware : [middleware];
  for (var method of methods) {
    var l = this.methods.push(method.toUpperCase());
    if (this.methods[l - 1] === 'GET') this.methods.unshift('HEAD');
  }

  // ensure middleware is a function
  for (var i = 0; i < this.stack.length; i++) {
    var fn = this.stack[i];
    var type = _typeof(fn);
    if (type !== 'function') throw new Error("".concat(methods.toString(), " `").concat(this.opts.name || path, "`: `middleware` must be a function, not `").concat(type, "`"));
  }
  this.path = path;
  this.regexp = pathToRegexp(path, this.paramNames, this.opts);
}

/**
 * Returns whether request `path` matches route.
 *
 * @param {String} path
 * @returns {Boolean}
 * @private
 */

Layer$1.prototype.match = function (path) {
  return this.regexp.test(path);
};

/**
 * Returns map of URL parameters for given `path` and `paramNames`.
 *
 * @param {String} path
 * @param {Array.<String>} captures
 * @param {Object=} params
 * @returns {Object}
 * @private
 */

Layer$1.prototype.params = function (path, captures) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  for (var len = captures.length, i = 0; i < len; i++) {
    if (this.paramNames[i]) {
      var c = captures[i];
      if (c && c.length > 0) params[this.paramNames[i].name] = c ? safeDecodeURIComponent(c) : c;
    }
  }
  return params;
};

/**
 * Returns array of regexp url path captures.
 *
 * @param {String} path
 * @returns {Array.<String>}
 * @private
 */

Layer$1.prototype.captures = function (path) {
  return this.opts.ignoreCaptures ? [] : path.match(this.regexp).slice(1);
};

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

// Layer.prototype.url = function (params, options) {
//   let args = params;
//   const url = this.path.replace(/\(\.\*\)/g, '');

//   if (typeof params !== 'object') {
//     args = Array.prototype.slice.call(arguments);
//     if (typeof args[args.length - 1] === 'object') {
//       options = args[args.length - 1];
//       args = args.slice(0, -1);
//     }
//   }

//   const toPath = compile(url, options);
//   let replaced;

//   const tokens = parse(url);
//   let replace = {};

//   if (Array.isArray(args)) {
//     for (let len = tokens.length, i = 0, j = 0; i < len; i++) {
//       if (tokens[i].name) replace[tokens[i].name] = args[j++];
//     }
//   } else if (tokens.some((token) => token.name)) {
//     replace = params;
//   } else if (!options) {
//     options = params;
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
// };

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

Layer$1.prototype.param = function (param, fn) {
  var stack = this.stack;
  var params = this.paramNames;
  var middleware = function middleware(ctx, next) {
    return fn.call(this, ctx.params[param], ctx, next);
  };
  middleware.param = param;
  var names = params.map(function (p) {
    return p.name;
  });
  var x = names.indexOf(param);
  if (x > -1) {
    // iterate through the stack, to figure out where to place the handler fn
    stack.some(function (fn, i) {
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
};

/**
 * Prefix route path.
 *
 * @param {String} prefix
 * @returns {Layer}
 * @private
 */

// Layer.prototype.setPrefix = function (prefix) {
//   if (this.path) {
//     this.path =
//       this.path !== '/' || this.opts.strict === true
//         ? `${prefix}${this.path}`
//         : prefix;
//     this.paramNames = [];
//     this.regexp = pathToRegexp(this.path, this.paramNames, this.opts);
//   }

//   return this;
// };

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
    return decodeURIComponent(text);
  } catch (_unused) {
    return text;
  }
}

// const { debuglog } = require('util');

var compose$2 = compose_1;
// const HttpError = require('http-errors');
var methods = methods$1;
require$$2.pathToRegexp;
var Layer = layer;

// const debug = debuglog('koa-router');

/**
 * @module koa-router
 */

var router = Router$1;

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

function Router$1() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (!(this instanceof Router$1)) return new Router$1(opts);
  this.opts = opts;
  this.methods = this.opts.methods || ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'];
  this.exclusive = Boolean(this.opts.exclusive);
  this.params = {};
  this.stack = [];
  this.host = this.opts.host;
}

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
var _loop = function _loop() {
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
      this.register(path, [method], middleware, {
        name: name
      });
      return this;
    };
  }
  setMethodVerb(method_);
};
for (var method_ of methods) {
  _loop();
}

// Alias for `router.delete()` because delete is a reserved word
// eslint-disable-next-line dot-notation
Router$1.prototype.del = Router$1.prototype['delete'];
Router$1.prototype.verb = function (method, pathToMath, action) {
  var verb = method.toUpperCase();
  this[verb](pathToMath, action);
};

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

// Router.prototype.use = function () {
//   const router = this;
//   const middleware = Array.prototype.slice.call(arguments);
//   let path;

//   // support array of paths
//   if (Array.isArray(middleware[0]) && typeof middleware[0][0] === 'string') {
//     const arrPaths = middleware[0];
//     for (const p of arrPaths) {
//       router.use.apply(router, [p].concat(middleware.slice(1)));
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
//         function setRouterParams(paramArr) {
//           const routerParams = paramArr;
//           for (const key of routerParams) {
//             cloneRouter.param(key, router.params[key]);
//           }
//         }

//         setRouterParams(Object.keys(router.params));
//       }
//     } else {
//       const keys = [];
//       pathToRegexp(router.opts.prefix || '', keys);
//       const routerPrefixHasParam = router.opts.prefix && keys.length;
//       router.register(path || '([^/]*)', [], m, {
//         end: false,
//         ignoreCaptures: !hasPath && !routerPrefixHasParam
//       });
//     }
//   }

//   return this;
// };

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

// Router.prototype.prefix = function (prefix) {
//   prefix = prefix.replace(/\/$/, '');

//   this.opts.prefix = prefix;

//   for (let i = 0; i < this.stack.length; i++) {
//     const route = this.stack[i];
//     route.setPrefix(prefix);
//   }

//   return this;
// };

/**
 * Returns router middleware which dispatches a route matching the request.
 *
 * @returns {Function}
 */

Router$1.prototype.routes = Router$1.prototype.middleware = function () {
  var router = this;
  var dispatch = function dispatch(ctx, next) {
    // debug('%s %s', ctx.method, ctx.path);

    // const hostMatched = router.matchHost(ctx.host);

    // if (!hostMatched) {
    //   return next();
    // }

    var path = router.opts.routerPath || ctx.routerPath || ctx.path;
    var matched = router.match(path, ctx.method);
    var layerChain;
    if (ctx.matched) {
      ctx.matched.push.apply(ctx.matched, matched.path);
    } else {
      ctx.matched = matched.path;
    }
    ctx.router = router;
    if (!matched.route) return next();
    var matchedLayers = matched.pathAndMethod;
    var mostSpecificLayer = matchedLayers[matchedLayers.length - 1];
    ctx._matchedRoute = mostSpecificLayer.path;
    if (mostSpecificLayer.name) {
      ctx._matchedRouteName = mostSpecificLayer.name;
    }
    layerChain = (router.exclusive ? [mostSpecificLayer] : matchedLayers).reduce(function (memo, layer) {
      memo.push(function (ctx, next) {
        ctx.captures = layer.captures(path, ctx.captures);
        ctx.params = ctx.request.params = layer.params(path, ctx.captures, ctx.params);
        ctx.routerPath = layer.path;
        ctx.routerName = layer.name;
        ctx._matchedRoute = layer.path;
        if (layer.name) {
          ctx._matchedRouteName = layer.name;
        }
        return next();
      });
      return memo.concat(layer.stack);
    }, []);
    return compose$2(layerChain)(ctx, next);
  };
  dispatch.router = this;
  return dispatch;
};

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

// Router.prototype.allowedMethods = function (options = {}) {
//   const implemented = this.methods;

//   return function allowedMethods(ctx, next) {
//     return next().then(function () {
//       const allowed = {};

//       if (!ctx.status || ctx.status === 404) {
//         for (let i = 0; i < ctx.matched.length; i++) {
//           const route = ctx.matched[i];
//           for (let j = 0; j < route.methods.length; j++) {
//             const method = route.methods[j];
//             allowed[method] = method;
//           }
//         }

//         const allowedArr = Object.keys(allowed);

//         if (!~implemented.indexOf(ctx.method)) {
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
// };

/**
 * Register route with all methods.
 *
 * @param {String} name Optional.
 * @param {String} path
 * @param {Function=} middleware You may also pass multiple middleware.
 * @param {Function} callback
 * @returns {Router}
 */

// Router.prototype.all = function (name, path, middleware) {
//   if (typeof path === 'string') {
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

//   this.register(path, methods, middleware, { name });

//   return this;
// };

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

// Router.prototype.redirect = function (source, destination, code) {
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
// };

/**
 * Create and register a route.
 *
 * @param {String} path Path string.
 * @param {Array.<String>} methods Array of HTTP verbs.
 * @param {Function} middleware Multiple middleware also accepted.
 * @returns {Layer}
 * @private
 */

Router$1.prototype.register = function (path, methods, middleware) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var router = this;
  var stack = this.stack;

  // support array of paths
  if (Array.isArray(path)) {
    for (var curPath of path) {
      router.register.call(router, curPath, methods, middleware, opts);
    }
    return this;
  }

  // create route
  var route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || '',
    ignoreCaptures: opts.ignoreCaptures
  });
  if (this.opts.prefix) {
    route.setPrefix(this.opts.prefix);
  }

  // add parameter middleware
  for (var i = 0; i < Object.keys(this.params).length; i++) {
    var param = Object.keys(this.params)[i];
    route.param(param, this.params[param]);
  }
  stack.push(route);

  // debug('defined route %s %s', route.methods, route.path);

  return route;
};

/**
 * Lookup route with given `name`.
 *
 * @param {String} name
 * @returns {Layer|false}
 */

// Router.prototype.route = function (name) {
//   const routes = this.stack;

//   for (let len = routes.length, i = 0; i < len; i++) {
//     if (routes[i].name && routes[i].name === name) return routes[i];
//   }

//   return false;
// };

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

// Router.prototype.url = function (name, params) {
//   const route = this.route(name);

//   if (route) {
//     const args = Array.prototype.slice.call(arguments, 1);
//     return route.url.apply(route, args);
//   }

//   return new Error(`No route found for name: ${String(name)}`);
// };

/**
 * Match given `path` and return corresponding routes.
 *
 * @param {String} path
 * @param {String} method
 * @returns {Object.<path, pathAndMethod>} returns layers that matched path and
 * path and method.
 * @private
 */

Router$1.prototype.match = function (path, method) {
  var layers = this.stack;
  var layer;
  var matched = {
    path: [],
    pathAndMethod: [],
    route: false
  };
  for (var len = layers.length, i = 0; i < len; i++) {
    layer = layers[i];

    // debug('test %s %s', layer.path, layer.regexp);

    // eslint-disable-next-line unicorn/prefer-regexp-test
    if (layer.match(path)) {
      matched.path.push(layer);
      if (layer.methods.length === 0 || ~layer.methods.indexOf(method)) {
        matched.pathAndMethod.push(layer);
        if (layer.methods.length > 0) matched.route = true;
      }
    }
  }
  return matched;
};
var router_1 = router;

/**
 * Module dependencies.
 */

// const isGeneratorFunction = require('is-generator-function');
// const debug = require('debug')('koa:application');
// const onFinished = require('on-finished');
var compose = compose_1$1;
var context = contextExports;
var request = request$1;
var response = response$1;
// const statuses = require('statuses');
// const Emitter = require('events');
// const util = require('util');
// const Stream = require('stream');
// const http = require('http');
// const only = require('only');
// const convert = require('koa-convert');
// const deprecate = require('depd')('koa');
// const { HttpError } = require('http-errors');
var Client = client;
var Router = router_1;

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

// module.exports = class Application extends Emitter {
var application = /*#__PURE__*/function () {
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

  function Application(options) {
    _classCallCheck(this, Application);
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
  return _createClass(Application, [{
    key: "listen",
    value: function listen() {
      // debug('listen');
      // const server = http.createServer(this.callback());
      // return server.listen(...args);
      var handleRequest = this.callback();
      this.client = new Client({
        handleRequest: handleRequest
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
  }, {
    key: "use",
    value: function use(fn) {
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
  }, {
    key: "callback",
    value: function callback() {
      var _this = this;
      var fn = compose(this.middleware);

      // if (!this.listenerCount('error')) this.on('error', this.onerror);

      var handleRequest = function handleRequest(req, res) {
        var ctx = _this.createContext(req, res);
        return _this.handleRequest(ctx, fn);
      };
      return handleRequest;
    }

    /**
     * Handle request in callback.
     *
     * @api private
     */
  }, {
    key: "handleRequest",
    value: function handleRequest(ctx, fnMiddleware) {
      var res = ctx.res;
      res.statusCode = 404;
      var onerror = function onerror(err) {
        return ctx.onerror(err);
      };
      var handleResponse = function handleResponse() {
        return respond(ctx);
      };
      // onFinished(res, onerror);
      return fnMiddleware(ctx).then(handleResponse)["catch"](onerror);
    }

    /**
     * Initialize a new context.
     *
     * @api private
     */
  }, {
    key: "createContext",
    value: function createContext(req, res) {
      var context = Object.create(this.context);
      var request = context.request = Object.create(this.request);
      var response = context.response = Object.create(this.response);
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
  }, {
    key: "onerror",
    value: function onerror(err) {
      // When dealing with cross-globals a normal `instanceof` check doesn't work properly.
      // See https://github.com/koajs/koa/issues/1466
      // We can probably remove it once jest fixes https://github.com/facebook/jest/issues/2549.
      var isNativeError = Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error;
      if (!isNativeError) throw new TypeError(util.format('non-error thrown: %j', err));
      if (404 === err.status || err.expose) return;
      if (this.silent) return;
      var msg = err.stack || err.toString();
      console.error("\n".concat(msg.replace(/^/gm, '  '), "\n"));
    }

    /**
     * Help TS users comply to CommonJS, ESM, bundler mismatch.
     * @see https://github.com/koajs/koa/issues/1513
     */
  }], [{
    key: "default",
    get: function get() {
      return Application;
    }
  }]);
}();

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;
  if (!ctx.writable) return;
  var res = ctx.res;
  var body = ctx.body;
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
    ctx["throw"](res.statusCode);
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
