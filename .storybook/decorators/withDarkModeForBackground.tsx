import { Decorator } from '@storybook/react'

/**
 * Decorator to wrap the story in a DateTimePicker component.
 * New storybook syntax.
 *
 * @param Story
 *
 * @returns Element
 */
export const withDarkModeForBackground: Decorator = (Story) => (
  <div className="dp-flex dp-min-h-screen dp-w-full dp-flex-col dp-items-start dp-p-8 dp-justify-start dp-bg-gray-100 dark:dp-bg-gray-900 dp-bg-fixed">
    {Story()}
  </div>
)
