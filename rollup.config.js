import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import dts from 'rollup-plugin-dts'
import svgr from '@svgr/rollup'
import { visualizer } from 'rollup-plugin-visualizer'
import copy from 'rollup-plugin-copy'

// import pkg from './package.json' with { type: 'json' }

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: 'datetime-picker.es.js',
        chunkFileNames: 'datetime-picker.[hash].js',
      },
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: 'datetime-picker.cjs.js',
        chunkFileNames: 'datetime-picker.[hash].js',
      },
    ],
    plugins: [
      peerDepsExternal(),
      copy({
        targets: [
          {
            src: 'src/fonts',
            dest: 'dist',
          },
          {
            src: ['src/declarations.d.ts', 'src/global.d.ts'],
            dest: 'dist',
          },
        ],
      }),
      postcss({
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        minimize: true,
        inject: {
          insertAt: 'top',
        },
      }),
      svgr({ exportType: 'named' }),
      resolve({
        extensions: ['.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json',
        exclude: [
          '**/*.test.*',
          '**/*.stories.*',
          'src/components/DateTimePicker/stories/*',
        ],
        declaration: false,
      }),
      terser(),
      visualizer({
        open: true,
        filename: 'bundle-analysis.html',
      }),
    ],
    external: ['react', 'react-dom', 'clsx', 'react-transition-group'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [
      /\.css$/,
      'react',
      'react-dom',
      'clsx',
      'react-transition-group',
    ],
  },
]
