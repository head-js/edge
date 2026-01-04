'use strict';

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

Object.defineProperty(dist, "__esModule", { value: true });
dist.TokenData = void 0;
dist.parse = parse$1;
dist.compile = compile$1;
dist.match = match;
dist.pathToRegexp = pathToRegexp$1;
dist.stringify = stringify;
const DEFAULT_DELIMITER = "/";
const NOOP_VALUE = (value) => value;
const ID_START = /^[$_\p{ID_Start}]$/u;
const ID_CONTINUE = /^[$\u200c\u200d\p{ID_Continue}]$/u;
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
    "!": "!",
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
        }
        else if (chars[i] === '"') {
            let pos = i;
            while (i < chars.length) {
                if (chars[++i] === '"') {
                    i++;
                    pos = 0;
                    break;
                }
                if (chars[i] === "\\") {
                    value += chars[++i];
                }
                else {
                    value += chars[i];
                }
            }
            if (pos) {
                throw new TypeError(`Unterminated quote at ${pos}: ${DEBUG_URL}`);
            }
        }
        if (!value) {
            throw new TypeError(`Missing parameter name at ${i}: ${DEBUG_URL}`);
        }
        return value;
    }
    while (i < chars.length) {
        const value = chars[i];
        const type = SIMPLE_TOKENS[value];
        if (type) {
            yield { type, index: i++, value };
        }
        else if (value === "\\") {
            yield { type: "ESCAPED", index: i++, value: chars[i++] };
        }
        else if (value === ":") {
            const value = name();
            yield { type: "PARAM", index: i, value };
        }
        else if (value === "*") {
            const value = name();
            yield { type: "WILDCARD", index: i, value };
        }
        else {
            yield { type: "CHAR", index: i, value: chars[i++] };
        }
    }
    return { type: "END", index: i, value: "" };
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
        if (token.type !== type)
            return;
        this._peek = undefined; // Reset after consumed.
        return token.value;
    }
    consume(type) {
        const value = this.tryConsume(type);
        if (value !== undefined)
            return value;
        const { type: nextType, index } = this.peek();
        throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}: ${DEBUG_URL}`);
    }
    text() {
        let result = "";
        let value;
        while ((value = this.tryConsume("CHAR") || this.tryConsume("ESCAPED"))) {
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
function parse$1(str, options = {}) {
    const { encodePath = NOOP_VALUE } = options;
    const it = new Iter(lexer(str));
    function consume(endType) {
        const tokens = [];
        while (true) {
            const path = it.text();
            if (path)
                tokens.push({ type: "text", value: encodePath(path) });
            const param = it.tryConsume("PARAM");
            if (param) {
                tokens.push({
                    type: "param",
                    name: param,
                });
                continue;
            }
            const wildcard = it.tryConsume("WILDCARD");
            if (wildcard) {
                tokens.push({
                    type: "wildcard",
                    name: wildcard,
                });
                continue;
            }
            const open = it.tryConsume("{");
            if (open) {
                tokens.push({
                    type: "group",
                    tokens: consume("}"),
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
function compile$1(path, options = {}) {
    const { encode = encodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
    const data = path instanceof TokenData ? path : parse$1(path, options);
    const fn = tokensToFunction(data.tokens, delimiter, encode);
    return function path(data = {}) {
        const [path, ...missing] = fn(data);
        if (missing.length) {
            throw new TypeError(`Missing parameters: ${missing.join(", ")}`);
        }
        return path;
    };
}
function tokensToFunction(tokens, delimiter, encode) {
    const encoders = tokens.map((token) => tokenToFunction(token, delimiter, encode));
    return (data) => {
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
    if (token.type === "text")
        return () => [token.value];
    if (token.type === "group") {
        const fn = tokensToFunction(token.tokens, delimiter, encode);
        return (data) => {
            const [value, ...missing] = fn(data);
            if (!missing.length)
                return [value];
            return [""];
        };
    }
    const encodeValue = encode || NOOP_VALUE;
    if (token.type === "wildcard" && encode !== false) {
        return (data) => {
            const value = data[token.name];
            if (value == null)
                return ["", token.name];
            if (!Array.isArray(value) || value.length === 0) {
                throw new TypeError(`Expected "${token.name}" to be a non-empty array`);
            }
            return [
                value
                    .map((value, index) => {
                    if (typeof value !== "string") {
                        throw new TypeError(`Expected "${token.name}/${index}" to be a string`);
                    }
                    return encodeValue(value);
                })
                    .join(delimiter),
            ];
        };
    }
    return (data) => {
        const value = data[token.name];
        if (value == null)
            return ["", token.name];
        if (typeof value !== "string") {
            throw new TypeError(`Expected "${token.name}" to be a string`);
        }
        return [encodeValue(value)];
    };
}
/**
 * Transform a path into a match function.
 */
function match(path, options = {}) {
    const { decode = decodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
    const { regexp, keys } = pathToRegexp$1(path, options);
    const decoders = keys.map((key) => {
        if (decode === false)
            return NOOP_VALUE;
        if (key.type === "param")
            return decode;
        return (value) => value.split(delimiter).map(decode);
    });
    return function match(input) {
        const m = regexp.exec(input);
        if (!m)
            return false;
        const path = m[0];
        const params = Object.create(null);
        for (let i = 1; i < m.length; i++) {
            if (m[i] === undefined)
                continue;
            const key = keys[i - 1];
            const decoder = decoders[i - 1];
            params[key.name] = decoder(m[i]);
        }
        return { path, params };
    };
}
function pathToRegexp$1(path, options = {}) {
    const { delimiter = DEFAULT_DELIMITER, end = true, sensitive = false, trailing = true, } = options;
    const keys = [];
    const sources = [];
    const flags = sensitive ? "" : "i";
    const paths = Array.isArray(path) ? path : [path];
    const items = paths.map((path) => path instanceof TokenData ? path : parse$1(path, options));
    for (const { tokens } of items) {
        for (const seq of flatten(tokens, 0, [])) {
            const regexp = sequenceToRegExp(seq, delimiter, keys);
            sources.push(regexp);
        }
    }
    let pattern = `^(?:${sources.join("|")})`;
    if (trailing)
        pattern += `(?:${escape(delimiter)}$)?`;
    pattern += end ? "$" : `(?=${escape(delimiter)}|$)`;
    const regexp = new RegExp(pattern, flags);
    return { regexp, keys };
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
    }
    else {
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
                throw new TypeError(`Missing text after "${token.name}": ${DEBUG_URL}`);
            }
            if (token.type === "param") {
                result += `(${negate(delimiter, isSafeSegmentParam ? "" : backtrack)}+)`;
            }
            else {
                result += `([\\s\\S]+)`;
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
        if (delimiter.length < 2)
            return `[^${escape(delimiter + backtrack)}]`;
        return `(?:(?!${escape(delimiter)})[^${escape(backtrack)}])`;
    }
    if (delimiter.length < 2) {
        return `(?:(?!${escape(backtrack)})[^${escape(delimiter)}])`;
    }
    return `(?:(?!${escape(backtrack)}|${escape(delimiter)})[\\s\\S])`;
}
/**
 * Stringify token data into a path string.
 */
function stringify(data) {
    return data.tokens
        .map(function stringifyToken(token, index, tokens) {
        if (token.type === "text")
            return escapeText(token.value);
        if (token.type === "group") {
            return `{${token.tokens.map(stringifyToken).join("")}}`;
        }
        const isSafe = isNameSafe(token.name) && isNextNameSafe(tokens[index + 1]);
        const key = isSafe ? token.name : JSON.stringify(token.name);
        if (token.type === "param")
            return `:${key}`;
        if (token.type === "wildcard")
            return `*${key}`;
        throw new TypeError(`Unexpected token: ${token}`);
    })
        .join("");
}
function isNameSafe(name) {
    const [first, ...rest] = name;
    if (!ID_START.test(first))
        return false;
    return rest.every((char) => ID_CONTINUE.test(char));
}
function isNextNameSafe(token) {
    if ((token === null || token === void 0 ? void 0 : token.type) !== "text")
        return true;
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

const compose = compose_1;
// const HttpError = require('http-errors');
const methods = methods$1;
// const { pathToRegexp } = require('path-to-regexp');

const Layer = layer;

// const methods = http.METHODS.map((method) => method.toLowerCase());

/**
 * @module koa-router
 */
class Router {
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
      return compose(layerChain)(ctx, next);
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
for (const method_ of methods) {
  function setMethodVerb(method) {
    Router.prototype[method] = function (name, path, middleware) {
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

Router.prototype.del = Router.prototype['delete'];
Router.prototype.verb = function (method, pathToMath, action) {
  const verb = method.toUpperCase();
  this[verb](pathToMath, action);
};
var router = Router;

module.exports = router;
