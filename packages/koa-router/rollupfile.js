// import { eslint } from 'rollup-plugin-eslint';
// import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';


export default [
  {
    input: 'src/router.js',

    external: [
      // 'vanilla.js/uri/parseUri',
    ],

    plugins: [
      // eslint(),

      // json(),

      commonjs({
        sourceMap: false,
      }),

      resolve({
        browser: true,
      }),

      babel({
        exclude: 'node_modules/**'
      }),
    ],

    output: [
      { file: 'dist/router.js', format: 'cjs' },
    ],
  },
];
