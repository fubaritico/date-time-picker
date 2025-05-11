import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import dts from 'rollup-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

export default [
  {
    input: 'src/DateTimePicker/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal({
        includeDependencies: true,
      }),
      resolve({
        extensions: ['.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json',
        exclude: ['**/*.test.*', '**/*.stories.*'],
        declaration: false,
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
      terser(),
      visualizer({
        open: true,
        filename: 'bundle-analysis.html',
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react-transition-group',
      'react-icons',
      '@mona-health/react-input-mask',
      'clsx',
    ],
  },
  {
    input: 'src/DateTimePicker/DateTimePicker.types.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/, 'react', 'react-dom'],
  },
]
