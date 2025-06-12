import { Decorator } from '@storybook/react'

export const withPadding: Decorator = (Story) => (
  <div className="dp-flex w-full dp-p-4 dp-bg-gray-100 dark:dp-bg-gray-900 dp-bg-fixed">
    {Story()}
  </div>
)

export const withPaddingAndFlexGrow: Decorator = (Story) => (
  <div className="dp-flex dp-min-h-screen dp-w-full dp-grow dp-flex-col dp-justify-start dp-p-8 dp-bg-gray-100 dark:dp-bg-gray-900 dp-bg-fixed">
    {Story()}
  </div>
)

export const withLayout: Decorator = (Story) => (
  <div className="dp-flex dp-min-h-screen dp-w-full dp-flex-col dp-flex-wrap dp-items-start dp-bg-gray-100 dark:dp-bg-gray-900 dp-bg-fixed">
    {Story()}
  </div>
)

export const withCenteredLayout: Decorator = (Story) => (
  <div className="dp-flex dp-h-screen dp-w-screen dp-items-center dp-justify-center dp-bg-gray-100 dark:dp-bg-gray-900 dp-bg-fixedr">
    {Story()}
  </div>
)
