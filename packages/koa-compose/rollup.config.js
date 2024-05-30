import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';


export default [
  {
    input: 'src/index.js',

    external: [
      'core-js/modules/es.array.reduce.js',
      'core-js/modules/es.object.to-string.js',
      'core-js/modules/es.array.concat.js',
      'core-js/modules/es.array.is-array.js',
      'core-js/modules/es.string.iterator.js',
      'core-js/modules/es.array.iterator.js',
      'core-js/modules/web.dom-collections.iterator.js',
      'core-js/modules/es.promise.js',
      'core-js/modules/es.function.bind.js',
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
      { file: 'dist/compose.js', format: 'cjs' },
    ],
  },
];
