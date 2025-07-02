import tsConfigPaths from 'vite-tsconfig-paths'

import * as path from 'path'

import type { UserConfig } from 'vite'
import type { StorybookConfig } from '@storybook/react-vite'
import svgr from '@svgr/rollup'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

const getAbsolutePath = (packageName: string): any =>
  path.dirname(require.resolve(path.join(packageName, 'package.json')))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  tags:
    process.env.NODE_ENV === 'production'
      ? {
          hidden: {
            excludeFromSidebar: true,
            excludeFromDocsStories: true,
          },
        }
      : {},
  addons: [
    //👇 Use getAbsolutePath when referencing Storybook's addons and frameworks
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-styling-webpack'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('storybook-dark-mode'),
  ],
  staticDirs: ['../public'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: './vite.storybook.config.ts',
      },
    },
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  async viteFinal(config: UserConfig) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite')

    // On filtre le plugin SVGR si on est en production
    const plugins = config.plugins?.filter((plugin) =>
      process.env.NODE_ENV === 'production' && plugin && 'name' in plugin
        ? plugin.name !== 'vite-plugin-svgr'
        : true
    )

    return mergeConfig(
      { ...config, plugins },
      {
        plugins: [
          tsConfigPaths({
            projects: [path.resolve(path.dirname(__dirname), 'tsconfig.json')],
          }),
        ],
        optimizeDeps: {
          include: ['storybook-dark-mode'],
        },
        ...(process.env.NODE_ENV === 'production' && {
          build: {
            rollupOptions: {
              plugins: [svgr({ exportType: 'named' }), dynamicImportVars()],
            },
          },
        }),
      }
    )
  },
}

export default config
