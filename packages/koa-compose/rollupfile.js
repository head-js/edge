// import { eslint } from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';


export default [
  {
    input: 'src/index.js',

    external: [
    ],

    plugins: [
      // eslint(),

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
      { file: 'dist/compose.js', format: 'cjs' },
    ],
  },
];
