import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';


export default [
  {
    input: 'src/router.js',

    external: [
      'core-js/modules/es.array.is-array.js',
      'core-js/modules/es.object.to-string.js',
      'core-js/modules/es.array.concat.js',
      'core-js/modules/es.string.iterator.js',
      'core-js/modules/es.array.reduce.js',
      'core-js/modules/web.dom-collections.iterator.js',
      'core-js/modules/es.promise.js',
      'core-js/modules/es.function.bind.js',
      'core-js/modules/es.array.iterator.js',
      'core-js/modules/es.function.name.js',
      'core-js/modules/es.regexp.to-string.js',
      'core-js/modules/es.date.to-string.js',
      'core-js/modules/es.string.match.js',
      'core-js/modules/es.array.slice.js',
      'core-js/modules/es.array.map.js',
      'core-js/modules/es.array.index-of.js',
      'core-js/modules/es.array.some.js',
      'core-js/modules/es.array.splice.js',
      'core-js/modules/es.regexp.exec.js',
      'core-js/modules/es.regexp.constructor.js',
      'core-js/modules/es.object.keys.js',
    ],

    plugins: [
      commonjs({
        sourceMap: false,
      }),

      resolve({
        browser: true,
      }),

      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
      }),
    ],

    output: [
      { file: 'dist/router.js', format: 'cjs' },
    ],
  },
];
