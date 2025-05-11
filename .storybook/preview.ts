import '../src/index.css'

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
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'en-US',
      },
    },
  },
}

export default preview
