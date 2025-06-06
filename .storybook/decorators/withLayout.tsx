import { Decorator } from '@storybook/react'

export const withPadding: Decorator = (Story) => (
  <div className="flex w-full p-4 bg-storybook bg-fixed">{Story()}</div>
)

export const withPaddingAndFlexGrow: Decorator = (Story) => (
  <div className="flex min-h-screen w-full grow flex-col justify-start p-8 bg-storybook bg-fixed">
    {Story()}
  </div>
)

export const withLayout: Decorator = (Story) => (
  <div className="flex min-h-screen w-full flex-col flex-wrap items-start bg-storybook bg-fixed">
    {Story()}
  </div>
)

export const withCenteredLayout: Decorator = (Story) => (
  <div className="flex h-screen w-screen items-center justify-cente bg-storybook bg-fixedr">
    {Story()}
  </div>
)
