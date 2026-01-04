import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';


export default [
  {
    input: 'src/application.js',

    external: [
      'core-js/modules/es.object.get-own-property-descriptors.js',
      'core-js/modules/es.array.includes.js',
      'core-js/modules/es.promise.js',
      'core-js/modules/es.array.reduce.js',
      'core-js/modules/es.array.iterator.js',
      'core-js/modules/web.dom-collections.iterator.js',
      'core-js/modules/web.dom-collections.for-each.js',
      'core-js/modules/es.regexp.exec.js',
      'core-js/modules/es.string.replace.js',
      'core-js/modules/es.string.split.js',
      'core-js/modules/es.symbol.description.js',
      'core-js/modules/es.regexp.constructor.js',
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
      { file: 'dist/application.js', format: 'cjs' },
    ],
  },
];
