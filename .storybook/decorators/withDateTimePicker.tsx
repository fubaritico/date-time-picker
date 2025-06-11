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
  <div className="dp-flex dp-min-h-[450px] dp-w-full dp-flex-col dp-items-start dp-p-8 dp-justify-start dp-bg-storybook dp-bg-fixed">
    {Story()}
  </div>
)
