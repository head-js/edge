// import { eslint } from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';


export default [
  {
    input: 'src/application.js',

    external: [
      // 'vanilla.js/uri/parseUri',
    ],

    plugins: [
      // eslint(),

      commonjs({
        sourceMap: false,
      }),

      json(),

      resolve({
        browser: true,
      }),

      babel({
        exclude: 'node_modules/**'
      }),
    ],

    output: [
      { file: 'dist/application.js', format: 'cjs' },
    ],
  },
];
