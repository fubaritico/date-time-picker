import { withDatePicker } from '@storybook-decorators/withLayout'

import TimePicker, { TimePickerProps } from '../TimePicker'

import disabledControls from './disabledControls'
import PickerIntegration, { PickerIntegrationProps } from './PickerIntegration'

import type { AnyPickerComponent } from '../types'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof TimePicker> = {
  title: 'TimePicker',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  component: TimePicker,
  decorators: [withDatePicker],
}

export default meta

type Story = StoryObj<typeof TimePicker>
type IntegrationStory = StoryObj<typeof PickerIntegration>

export const Uncontrolled: Story = {
  render: (args: TimePickerProps) => <TimePicker {...args} />,
  name: 'Uncontrolled',
}

export const Controlled: IntegrationStory = {
  render: (args: PickerIntegrationProps) => <PickerIntegration {...args} />,
  name: 'Controlled',
  args: {
    PickerComponent: TimePicker as AnyPickerComponent,
  },
  argTypes: disabledControls,
}

export const WithPortal: Story = {
  ...Uncontrolled,
  name: 'With Portal',
  args: {
    ...Uncontrolled.args,
    enablePortal: true,
  },
}

export const WithPrefill: IntegrationStory = {
  ...Controlled,
  name: 'Controlled with prefill',
  args: {
    ...Controlled.args,
    date: 1726737120000,
  },
  argTypes: disabledControls,
}

export const WithNoDefaultDate: IntegrationStory = {
  ...Controlled,
  name: 'Controlled with no default date',
  args: {
    ...Controlled.args,
    noDefault: true,
  },
  argTypes: disabledControls,
}
