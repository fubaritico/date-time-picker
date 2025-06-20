import { themes } from '@storybook/theming'

import './stories.css'
import '../src/storybook.css'
import '../dev/native-styles.css'

/** @type { import('@storybook/react').Preview } */
const preview = {
  tags: ['autodocs'],
  parameters: {
    actions: { argTypesRegex: '^.On[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      dark: { ...themes.dark, appBg: '#111827' },
      light: { ...themes.normal, appBg: '#f3f4f6' },
      current: 'light',
      darkClass: ['dark', 'dp-dark'],
      lightClass: ['light', 'dp-light'],
      stylePreview: true,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'en-US',
      },
    },
  },
}

export default preview
