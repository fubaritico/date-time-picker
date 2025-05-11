import { Decorator } from '@storybook/react'

export const withPadding: Decorator = (Story) => (
  <div className="flex w-full p-4">{Story()}</div>
)

export const withPaddingAndFlexGrow: Decorator = (Story) => (
  <div className="flex min-h-screen w-full grow flex-col justify-start p-8">
    {Story()}
  </div>
)

export const withLayout: Decorator = (Story) => (
  <div className="flex min-h-screen w-full flex-col flex-wrap items-start">
    {Story()}
  </div>
)

export const withCenteredLayout: Decorator = (Story) => (
  <div className="flex h-screen w-screen items-center justify-center">
    {Story()}
  </div>
)
