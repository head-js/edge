'use strict';

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
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
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
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
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
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
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
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
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
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
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
                modifier: tryConsume("MODIFIER") || "",
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
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
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
                    if (optional)
                        continue;
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
            if (optional)
                continue;
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
    if (options === void 0) { options = {}; }
    var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
    return function (pathname) {
        var m = re.exec(pathname);
        if (!m)
            return false;
        var path = m[0], index = m.index;
        var params = Object.create(null);
        var _loop_1 = function (i) {
            if (m[i] === undefined)
                return "continue";
            var key = keys[i - 1];
            if (key.modifier === "*" || key.modifier === "+") {
                params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                    return decode(value, key);
                });
            }
            else {
                params[key.name] = decode(m[i], key);
            }
        };
        for (var i = 1; i < m.length; i++) {
            _loop_1(i);
        }
        return { path: path, index: index, params: params };
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
    if (!keys)
        return path;
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
            pattern: "",
        });
        execResult = groupsRegex.exec(path.source);
    }
    return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) { return pathToRegexp$1(path, keys, options).source; });
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
    if (options === void 0) { options = {}; }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
    var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
    var delimiterRe = "[".concat(escapeString(delimiter), "]");
    var route = start ? "^" : "";
    // Iterate over the tokens and create our regexp string.
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (typeof token === "string") {
            route += escapeString(encode(token));
        }
        else {
            var prefix = escapeString(encode(token.prefix));
            var suffix = escapeString(encode(token.suffix));
            if (token.pattern) {
                if (keys)
                    keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        var mod = token.modifier === "*" ? "?" : "";
                        route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
                    }
                    else {
                        route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
                    }
                }
                else {
                    if (token.modifier === "+" || token.modifier === "*") {
                        route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
                    }
                    else {
                        route += "(".concat(token.pattern, ")").concat(token.modifier);
                    }
                }
            }
            else {
                route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
            }
        }
    }
    if (end) {
        if (!strict)
            route += "".concat(delimiterRe, "?");
        route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
    }
    else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string"
            ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1
            : endToken === undefined;
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
    if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
    if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
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

var compose = compose_1;
// const HttpError = require('http-errors');
var methods = methods$1;
require$$2.pathToRegexp;
var Layer = layer;

// const debug = debuglog('koa-router');

/**
 * @module koa-router
 */

var router = Router;

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

function Router() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (!(this instanceof Router)) return new Router(opts);
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
Router.prototype.del = Router.prototype['delete'];
Router.prototype.verb = function (method, pathToMath, action) {
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

Router.prototype.routes = Router.prototype.middleware = function () {
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
    return compose(layerChain)(ctx, next);
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

Router.prototype.register = function (path, methods, middleware) {
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

Router.prototype.match = function (path, method) {
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

module.exports = router;
