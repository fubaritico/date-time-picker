import { Decorator } from '@storybook/react'

/**
 * Decorator to wrap the story in a DateTimePicker component.
 * New storybook syntax.
 *
 * @param Story
 *
 * @returns Element
 */
export const withDateTimePicker: Decorator = (Story) => (
  <div className="flex min-h-[450px] w-full flex-col items-start p-8 justify-start bg-storybook bg-fixed">
    {Story()}
  </div>
)
