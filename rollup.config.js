import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import dts from 'rollup-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

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
      resolve({
        extensions: ['.ts', '.tsx'],
      }),
      dynamicImportVars(),
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
    external: [
      'react',
      'react-dom',
      '@mona-health/react-input-mask',
      'clsx',
      'react-icons',
      'react-transition-group',
      'tailwind-merge',
      'tailwindcss',
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [
      /\.css$/,
      'react',
      'react-dom',
      '@mona-health/react-input-mask',
      'clsx',
      'react-icons',
      'react-transition-group',
      'tailwind-merge',
      'tailwindcss',
    ],
  },
]
