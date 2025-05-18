import { Decorator } from '@storybook/react'

export const withDateTimePicker: Decorator = (Story) => (
  <div className="flex min-h-[450px] w-full flex-col items-start p-8 justify-start">
    {Story()}
  </div>
)
