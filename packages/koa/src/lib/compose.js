'use strict';

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

var src = compose;
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

function compose(middleware) {
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

module.exports = src;
