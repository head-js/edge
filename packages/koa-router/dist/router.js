'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms;
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

var browser = createCommonjsModule(function (module, exports) {
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
});
var browser_1 = browser.formatArgs;
var browser_2 = browser.save;
var browser_3 = browser.load;
var browser_4 = browser.useColors;
var browser_5 = browser.storage;
var browser_6 = browser.destroy;
var browser_7 = browser.colors;
var browser_8 = browser.log;

/**
 * Expose compositor.
 */

var src = compose;

function flatten(arr) {
  return arr.reduce((acc, next) => acc.concat(Array.isArray(next) ? flatten(next) : next), []);
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


function compose(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  middleware = flatten(middleware);

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
var methods = ['ACL', 'BIND', 'CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LINK', 'LOCK', 'M-SEARCH', 'MERGE', 'MKACTIVITY', 'MKCALENDAR', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST', 'PRI', 'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'REBIND', 'REPORT', 'SEARCH', 'SOURCE', 'SUBSCRIBE', 'TRACE', 'UNBIND', 'UNLINK', 'UNLOCK', 'UNSUBSCRIBE'];

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
                throw new TypeError("Missing parameter name at " + i);
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at " + j);
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
                        throw new TypeError("Capturing groups are not allowed at " + j);
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at " + i);
            if (!pattern)
                throw new TypeError("Missing pattern at " + i);
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
function parse$1(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
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
        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };
    var consumeText = function () {
        var result = "";
        var value;
        // tslint:disable-next-line
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
                modifier: tryConsume("MODIFIER") || ""
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
    return tokensToFunction(parse$1(str, options), options);
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
            return new RegExp("^(?:" + token.pattern + ")$", reFlags);
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
                    throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"" + token.name + "\" to not be empty");
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
        }
        return path;
    };
}
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
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
            // tslint:disable-next-line
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
    var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse$1(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
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
                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                    }
                    else {
                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                    }
                }
                else {
                    route += "(" + token.pattern + ")" + token.modifier;
                }
            }
            else {
                route += "(?:" + prefix + suffix + ")" + token.modifier;
            }
        }
    }
    if (end) {
        if (!strict)
            route += delimiter + "?";
        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    }
    else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string"
            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
            : // tslint:disable-next-line
                endToken === undefined;
        if (!strict) {
            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
        }
        if (!isEndDelimited) {
            route += "(?=" + delimiter + "|" + endsWith + ")";
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
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
    if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
}

var dist_es2015 = /*#__PURE__*/Object.freeze({
	parse: parse$1,
	compile: compile,
	tokensToFunction: tokensToFunction,
	match: match,
	regexpToFunction: regexpToFunction,
	tokensToRegexp: tokensToRegexp,
	pathToRegexp: pathToRegexp
});

const {
  pathToRegexp: pathToRegexp$1,
  compile: compile$1,
  parse: parse$2
} = dist_es2015; // const { parse: parseUrl, format: formatUrl } = require('url');

var layer = Layer;
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

function Layer(path, methods, middleware, opts) {
  this.opts = opts || {};
  this.name = this.opts.name || null;
  this.methods = [];
  this.paramNames = [];
  this.stack = Array.isArray(middleware) ? middleware : [middleware];

  for (let i = 0; i < methods.length; i++) {
    const l = this.methods.push(methods[i].toUpperCase());
    if (this.methods[l - 1] === 'GET') this.methods.unshift('HEAD');
  } // ensure middleware is a function


  for (let i = 0; i < this.stack.length; i++) {
    const fn = this.stack[i];
    const type = typeof fn;
    if (type !== 'function') throw new Error(`${methods.toString()} \`${this.opts.name || path}\`: \`middleware\` must be a function, not \`${type}\``);
  }

  this.path = path;
  this.regexp = pathToRegexp$1(path, this.paramNames, this.opts);
}
/**
 * Returns whether request `path` matches route.
 *
 * @param {String} path
 * @returns {Boolean}
 * @private
 */

Layer.prototype.match = function (path) {
  return this.regexp.test(path);
};
/**
 * Returns map of URL parameters for given `path` and `paramNames`.
 *
 * @param {String} path
 * @param {Array.<String>} captures
 * @param {Object=} existingParams
 * @returns {Object}
 * @private
 */


Layer.prototype.params = function (path, captures, existingParams) {
  const params = existingParams || {};

  for (let len = captures.length, i = 0; i < len; i++) {
    if (this.paramNames[i]) {
      const c = captures[i];
      if (c && c.length !== 0) params[this.paramNames[i].name] = c ? safeDecodeURIComponent(c) : c;
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


Layer.prototype.captures = function (path) {
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
//   if (typeof params != 'object') {
//     args = Array.prototype.slice.call(arguments);
//     if (typeof args[args.length - 1] == 'object') {
//       options = args[args.length - 1];
//       args = args.slice(0, args.length - 1);
//     }
//   }
//   const toPath = compile(url, options);
//   let replaced;
//   const tokens = parse(url);
//   let replace = {};
//   if (args instanceof Array) {
//     for (let len = tokens.length, i = 0, j = 0; i < len; i++) {
//       if (tokens[i].name) replace[tokens[i].name] = args[j++];
//     }
//   } else if (tokens.some(token => token.name)) {
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
 *     if (!user) return ctx.status = 404;
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


Layer.prototype.param = function (param, fn) {
  const stack = this.stack;
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


Layer.prototype.setPrefix = function (prefix) {
  if (this.path) {
    this.path = this.path !== '/' || this.opts.strict === true ? `${prefix}${this.path}` : prefix;
    this.paramNames = [];
    this.regexp = pathToRegexp$1(this.path, this.paramNames, this.opts);
  }

  return this;
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
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
}

/**
 * RESTful resource routing middleware for koa.
 *
 * @author Alex Mingoia <talk@alexmingoia.com>
 * @link https://github.com/alexmingoia/koa-router
 */

const debug = browser('koa-router'); //  const HttpError = require('http-errors');
//  const { pathToRegexp } = require('path-to-regexp');

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
 * @param {String=} opts.prefix prefix router paths
 * @constructor
 */

function Router(opts) {
  if (!(this instanceof Router)) return new Router(opts);
  this.opts = opts || {};
  this.methods = this.opts.methods || ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'];
  this.params = {};
  this.stack = [];
}
/**
 * Create `router.verb()` methods, where *verb* is one of the HTTP verbs such
 * as `router.get()` or `router.post()`.
 *
 * Match URL patterns to callback functions or controller actions using `router.verb()`,
 * where **verb** is one of the HTTP verbs such as `router.get()` or `router.post()`.
 *
 * Additionaly, `router.all()` can be used to match against all methods.
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
 * @name get|put|post|patch|delete|del
 * @memberof module:koa-router.prototype
 * @param {String} path
 * @param {Function=} middleware route middleware(s)
 * @param {Function} callback route callback
 * @returns {Router}
 */

function setMethodVerb(method) {
  Router.prototype[method] = function (name, path, middleware) {
    if (typeof path === "string" || path instanceof RegExp) {
      middleware = Array.prototype.slice.call(arguments, 2);
    } else {
      middleware = Array.prototype.slice.call(arguments, 1);
      path = name;
      name = null;
    }

    this.register(path, [method], middleware, {
      name: name
    });
    return this;
  };
}

for (let i = 0; i < methods.length; i++) {
  setMethodVerb(methods[i]);
} // Alias for `router.delete()` because delete is a reserved word


Router.prototype.del = Router.prototype['delete'];

Router.prototype.verb = function (method, pathToMath, action) {
  const verb = method.toUpperCase();
  this[verb](pathToMath, action);
}; //  /**
//   * Use given middleware.
//   *
//   * Middleware run in the order they are defined by `.use()`. They are invoked
//   * sequentially, requests start at the first middleware and work their way
//   * "down" the middleware stack.
//   *
//   * @example
//   *
//   * ```javascript
//   * // session middleware will run before authorize
//   * router
//   *   .use(session())
//   *   .use(authorize());
//   *
//   * // use middleware only with given path
//   * router.use('/users', userAuth());
//   *
//   * // or with an array of paths
//   * router.use(['/users', '/admin'], userAuth());
//   *
//   * app.use(router.routes());
//   * ```
//   *
//   * @param {String=} path
//   * @param {Function} middleware
//   * @param {Function=} ...
//   * @returns {Router}
//   */
//  Router.prototype.use = function () {
//    const router = this;
//    const middleware = Array.prototype.slice.call(arguments);
//    let path;
//    // support array of paths
//    if (Array.isArray(middleware[0]) && typeof middleware[0][0] === 'string') {
//      let arrPaths = middleware[0];
//      for (let i = 0; i < arrPaths.length; i++) {
//        const p = arrPaths[i];
//        router.use.apply(router, [p].concat(middleware.slice(1)));
//      }
//      return this;
//    }
//    const hasPath = typeof middleware[0] === 'string';
//    if (hasPath) path = middleware.shift();
//    for (let i = 0; i < middleware.length; i++) {
//      const m = middleware[i];
//      if (m.router) {
//        const cloneRouter = Object.assign(Object.create(Router.prototype), m.router, {
//          stack: m.router.stack.slice(0)
//        });
//        for (let j = 0; j < cloneRouter.stack.length; j++) {
//          const nestedLayer = cloneRouter.stack[j];
//          const cloneLayer = Object.assign(
//            Object.create(Layer.prototype),
//            nestedLayer
//          );
//          if (path) cloneLayer.setPrefix(path);
//          if (router.opts.prefix) cloneLayer.setPrefix(router.opts.prefix);
//          router.stack.push(cloneLayer);
//          cloneRouter.stack[j] = cloneLayer;
//        }
//        if (router.params) {
//          function setRouterParams(paramArr) {
//            const routerParams = paramArr;
//            for (let j = 0; j < routerParams.length; j++) {
//              const key = routerParams[j];
//              cloneRouter.param(key, router.params[key]);
//            }
//          }
//          setRouterParams(Object.keys(router.params));
//        }
//      } else {
//        const keys = [];
//        pathToRegexp(router.opts.prefix || '', keys);
//        const routerPrefixHasParam = router.opts.prefix && keys.length;
//        router.register(path || '([^\/]*)', [], m, { end: false, ignoreCaptures: !hasPath && !routerPrefixHasParam });
//      }
//    }
//    return this;
//  };
//  /**
//   * Set the path prefix for a Router instance that was already initialized.
//   *
//   * @example
//   *
//   * ```javascript
//   * router.prefix('/things/:thing_id')
//   * ```
//   *
//   * @param {String} prefix
//   * @returns {Router}
//   */
//  Router.prototype.prefix = function (prefix) {
//    prefix = prefix.replace(/\/$/, '');
//    this.opts.prefix = prefix;
//    for (let i = 0; i < this.stack.length; i++) {
//      const route = this.stack[i];
//      route.setPrefix(prefix);
//    }
//    return this;
//  };
//  /**
//   * Returns router middleware which dispatches a route matching the request.
//   *
//   * @returns {Function}
//   */


Router.prototype.routes = Router.prototype.middleware = function () {
  const router = this;

  let dispatch = function dispatch(ctx, next) {
    debug('%s %s', ctx.method, ctx.path);
    const path = router.opts.routerPath || ctx.routerPath || ctx.path;
    const matched = router.match(path, ctx.method);
    let layerChain;

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

    layerChain = matchedLayers.reduce(function (memo, layer) {
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
    return compose_1(layerChain)(ctx, next);
  };

  dispatch.router = this;
  return dispatch;
}; //  /**
//   * Returns separate middleware for responding to `OPTIONS` requests with
//   * an `Allow` header containing the allowed methods, as well as responding
//   * with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
//   *
//   * @example
//   *
//   * ```javascript
//   * const Koa = require('koa');
//   * const Router = require('@koa/router');
//   *
//   * const app = new Koa();
//   * const router = new Router();
//   *
//   * app.use(router.routes());
//   * app.use(router.allowedMethods());
//   * ```
//   *
//   * **Example with [Boom](https://github.com/hapijs/boom)**
//   *
//   * ```javascript
//   * const Koa = require('koa');
//   * const Router = require('@koa/router');
//   * const Boom = require('boom');
//   *
//   * const app = new Koa();
//   * const router = new Router();
//   *
//   * app.use(router.routes());
//   * app.use(router.allowedMethods({
//   *   throw: true,
//   *   notImplemented: () => new Boom.notImplemented(),
//   *   methodNotAllowed: () => new Boom.methodNotAllowed()
//   * }));
//   * ```
//   *
//   * @param {Object=} options
//   * @param {Boolean=} options.throw throw error instead of setting status and header
//   * @param {Function=} options.notImplemented throw the returned value in place of the default NotImplemented error
//   * @param {Function=} options.methodNotAllowed throw the returned value in place of the default MethodNotAllowed error
//   * @returns {Function}
//   */
//  Router.prototype.allowedMethods = function (options) {
//    options = options || {};
//    const implemented = this.methods;
//    return function allowedMethods(ctx, next) {
//      return next().then(function() {
//        const allowed = {};
//        if (!ctx.status || ctx.status === 404) {
//          for (let i = 0; i < ctx.matched.length; i++) {
//            const route = ctx.matched[i];
//            for (let j = 0; j < route.methods.length; j++) {
//              const method = route.methods[j];
//              allowed[method] = method;
//            }
//          }
//          const allowedArr = Object.keys(allowed);
//          if (!~implemented.indexOf(ctx.method)) {
//            if (options.throw) {
//              let notImplementedThrowable = (typeof options.notImplemented === 'function')
//              ? options.notImplemented()  // set whatever the user returns from their function
//              : new HttpError.NotImplemented();
//              throw notImplementedThrowable;
//            } else {
//              ctx.status = 501;
//              ctx.set('Allow', allowedArr.join(', '));
//            }
//          } else if (allowedArr.length) {
//            if (ctx.method === 'OPTIONS') {
//              ctx.status = 200;
//              ctx.body = '';
//              ctx.set('Allow', allowedArr.join(', '));
//            } else if (!allowed[ctx.method]) {
//              if (options.throw) {
//                let notAllowedThrowable = (typeof options.methodNotAllowed === 'function')
//                ? options.methodNotAllowed() // set whatever the user returns from their function
//                : new HttpError.MethodNotAllowed();
//                throw notAllowedThrowable;
//              } else {
//                ctx.status = 405;
//                ctx.set('Allow', allowedArr.join(', '));
//              }
//            }
//          }
//        }
//      });
//    };
//  };
//  /**
//   * Register route with all methods.
//   *
//   * @param {String} name Optional.
//   * @param {String} path
//   * @param {Function=} middleware You may also pass multiple middleware.
//   * @param {Function} callback
//   * @returns {Router}
//   * @private
//   */
//  Router.prototype.all = function (name, path, middleware) {
//    if (typeof path === 'string') {
//      middleware = Array.prototype.slice.call(arguments, 2);
//    } else {
//      middleware = Array.prototype.slice.call(arguments, 1);
//      path = name;
//      name = null;
//    }
//    this.register(path, methods, middleware, { name });
//    return this;
//  };
//  /**
//   * Redirect `source` to `destination` URL with optional 30x status `code`.
//   *
//   * Both `source` and `destination` can be route names.
//   *
//   * ```javascript
//   * router.redirect('/login', 'sign-in');
//   * ```
//   *
//   * This is equivalent to:
//   *
//   * ```javascript
//   * router.all('/login', ctx => {
//   *   ctx.redirect('/sign-in');
//   *   ctx.status = 301;
//   * });
//   * ```
//   *
//   * @param {String} source URL or route name.
//   * @param {String} destination URL or route name.
//   * @param {Number=} code HTTP status code (default: 301).
//   * @returns {Router}
//   */
//  Router.prototype.redirect = function (source, destination, code) {
//    // lookup source route by name
//    if (source[0] !== '/') source = this.url(source);
//    // lookup destination route by name
//    if (destination[0] !== '/' && !destination.includes('://')) destination = this.url(destination);
//    return this.all(source, ctx => {
//      ctx.redirect(destination);
//      ctx.status = code || 301;
//    });
//  };

/**
 * Create and register a route.
 *
 * @param {String} path Path string.
 * @param {Array.<String>} methods Array of HTTP verbs.
 * @param {Function} middleware Multiple middleware also accepted.
 * @returns {Layer}
 * @private
 */


Router.prototype.register = function (path, methods, middleware, opts) {
  opts = opts || {};
  const router = this;
  const stack = this.stack; // support array of paths

  if (Array.isArray(path)) {
    for (let i = 0; i < path.length; i++) {
      const curPath = path[i];
      router.register.call(router, curPath, methods, middleware, opts);
    }

    return this;
  } // create route


  const route = new layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
    ignoreCaptures: opts.ignoreCaptures
  });

  if (this.opts.prefix) {
    route.setPrefix(this.opts.prefix);
  } // add parameter middleware


  for (let i = 0; i < Object.keys(this.params).length; i++) {
    const param = Object.keys(this.params)[i];
    route.param(param, this.params[param]);
  }

  stack.push(route);
  debug('defined route %s %s', route.methods, route.path);
  return route;
}; //  /**
//   * Lookup route with given `name`.
//   *
//   * @param {String} name
//   * @returns {Layer|false}
//   */
//  Router.prototype.route = function (name) {
//    const routes = this.stack;
//    for (let len = routes.length, i=0; i<len; i++) {
//      if (routes[i].name && routes[i].name === name) return routes[i];
//    }
//    return false;
//  };
//  /**
//   * Generate URL for route. Takes a route name and map of named `params`.
//   *
//   * @example
//   *
//   * ```javascript
//   * router.get('user', '/users/:id', (ctx, next) => {
//   *   // ...
//   * });
//   *
//   * router.url('user', 3);
//   * // => "/users/3"
//   *
//   * router.url('user', { id: 3 });
//   * // => "/users/3"
//   *
//   * router.use((ctx, next) => {
//   *   // redirect to named route
//   *   ctx.redirect(ctx.router.url('sign-in'));
//   * })
//   *
//   * router.url('user', { id: 3 }, { query: { limit: 1 } });
//   * // => "/users/3?limit=1"
//   *
//   * router.url('user', { id: 3 }, { query: "limit=1" });
//   * // => "/users/3?limit=1"
//   * ```
//   *
//   * @param {String} name route name
//   * @param {Object} params url parameters
//   * @param {Object} [options] options parameter
//   * @param {Object|String} [options.query] query options
//   * @returns {String|Error}
//   */
//  Router.prototype.url = function (name, params) {
//    const route = this.route(name);
//    if (route) {
//      const args = Array.prototype.slice.call(arguments, 1);
//      return route.url.apply(route, args);
//    }
//    return new Error(`No route found for name: ${name}`);
//  };
//  /**
//   * Match given `path` and return corresponding routes.
//   *
//   * @param {String} path
//   * @param {String} method
//   * @returns {Object.<path, pathAndMethod>} returns layers that matched path and
//   * path and method.
//   * @private
//   */


Router.prototype.match = function (path, method) {
  const layers = this.stack;
  let layer;
  const matched = {
    path: [],
    pathAndMethod: [],
    route: false
  };

  for (let len = layers.length, i = 0; i < len; i++) {
    layer = layers[i];
    debug('test %s %s', layer.path, layer.regexp);

    if (layer.match(path)) {
      matched.path.push(layer);

      if (layer.methods.length === 0 || ~layer.methods.indexOf(method)) {
        matched.pathAndMethod.push(layer);
        if (layer.methods.length) matched.route = true;
      }
    }
  }

  return matched;
}; //  /**

module.exports = router;
