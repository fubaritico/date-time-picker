import { Decorator } from '@storybook/react'

export const withPadding: Decorator = (Story) => (
  <div className="with-padding">{Story()}</div>
)

export const withLayout: Decorator = (Story) => (
  <div className="with-layout">{Story()}</div>
)

export const withCenteredLayout: Decorator = (Story) => (
  <div className="with-centered-layout">{Story()}</div>
)

export const withDatePicker: Decorator = (Story) => (
  <div className="with-date-picker">{Story()}</div>
)
