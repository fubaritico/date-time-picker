import tsConfigPaths from 'vite-tsconfig-paths'

import * as path from 'path'

import type { UserConfig } from 'vite'
import type { StorybookConfig } from '@storybook/react-vite'

const getAbsolutePath = (packageName: string): any =>
  path.dirname(require.resolve(path.join(packageName, 'package.json')))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    //👇 Use getAbsolutePath when referencing Storybook's addons and frameworks
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-styling-webpack'),
    getAbsolutePath('@storybook/addon-designs'),
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    // Replace your-framework with the same one you've imported above.
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  async viteFinal(config: UserConfig) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      // will manage aliases, if any
      plugins: [
        tsConfigPaths({
          projects: [path.resolve(path.dirname(__dirname), 'tsconfig.json')],
        }),
      ],
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
    })
  },
}

export default config
