import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';


export default [
  {
    input: 'src/application.js',

    external: [
      'core-js/modules/es.object.to-string.js',
      'core-js/modules/es.promise.js',
      'core-js/modules/es.array.reduce.js',
      'core-js/modules/es.string.iterator.js',
      'core-js/modules/es.array.iterator.js',
      'core-js/modules/es.function.bind.js',
      'core-js/modules/es.array.is-array.js',
      'core-js/modules/es.object.define-property.js',
      'core-js/modules/web.dom-collections.iterator.js',
      'core-js/modules/es.array.for-each.js',
      'core-js/modules/es.array.concat.js',
      'core-js/modules/es.object.get-own-property-descriptor.js',
      'core-js/modules/web.dom-collections.for-each.js',
      'core-js/modules/es.object.keys.js',
      'core-js/modules/es.regexp.exec.js',
      'core-js/modules/es.array.map.js',
      'core-js/modules/es.array.index-of.js',
      'core-js/modules/es.function.name.js',
      'core-js/modules/es.string.replace.js',
      'core-js/modules/es.regexp.to-string.js',
      'core-js/modules/es.string.split.js',
      'core-js/modules/es.object.create.js',
      'core-js/modules/es.object.freeze.js',
      'core-js/modules/es.array.join.js',
      'core-js/modules/es.symbol.js',
      'core-js/modules/es.symbol.description.js',
      'core-js/modules/es.string.ends-with.js',
      'core-js/modules/es.symbol.iterator.js',
      'core-js/modules/es.string.match.js',
      'core-js/modules/es.date.to-string.js',
      'core-js/modules/es.array.some.js',
      'core-js/modules/es.regexp.constructor.js',
      'core-js/modules/es.array.splice.js',
      'core-js/modules/es.array.slice.js',
      'core-js/modules/es.date.to-json.js',
      'core-js/modules/web.url.to-json.js',
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
