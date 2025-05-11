import type { UserConfig } from 'vite'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack',
    '@storybook/addon-designs',
  ],
  staticDirs: ['../public'],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: '@storybook/react-vite',
  /**
   *
   * @param {UserConfig} config - The Storybook vite configuration
   * @returns {Promise<UserConfig>} - The extended Storybook vite configuration
   */
  viteFinal: async (config: UserConfig) => {
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
    })
  },
}

export default config
