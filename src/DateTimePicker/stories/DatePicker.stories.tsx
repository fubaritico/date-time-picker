import { withDateTimePicker } from '@storybook-decorators/withDateTimePicker'

import { timezones } from '@components'

import DatePicker, { DatePickerProps } from '../DatePicker'

import disabledControls from './disabledControls'
import PickerIntegration, { PickerIntegrationProps } from './PickerIntegration'

import type { Meta, StoryObj } from '@storybook/react'
import type { AnyPickerComponent } from '@types'

const meta: Meta<typeof DatePicker> = {
  title: 'DatePicker',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    timezone: {
      options: timezones.map((tz) => tz.value),
      control: {
        type: 'select',
        labels: timezones.reduce<Record<string, string>>((acc, { value }) => {
          if (value) {
            acc[value] = value
          }
          return acc
        }, {}),
      },
    },
  },
  tags: ['autodocs'],
  component: DatePicker,
  decorators: [withDateTimePicker],
}

export default meta

type Story = StoryObj<typeof DatePicker>
type IntegrationStory = StoryObj<typeof PickerIntegration>

export const Uncontrolled: Story = {
  render: (args: DatePickerProps) => <DatePicker {...args} />,
  name: 'Uncontrolled',
}

export const Controlled: IntegrationStory = {
  render: (args: PickerIntegrationProps) => <PickerIntegration {...args} />,
  name: 'Controlled',
  args: {
    PickerComponent: DatePicker as AnyPickerComponent,
  },
  argTypes: disabledControls,
}

export const WithPortal: Story = {
  ...Uncontrolled,
  name: 'With Portal',
  args: {
    enablePortal: true,
  },
}

export const WithPrefill: IntegrationStory = {
  ...Controlled,
  name: 'Controlled with prefill',
  args: {
    date: 1726737120000,
  },
  argTypes: disabledControls,
}

export const WithNoDefaultDate: IntegrationStory = {
  ...Controlled,
  name: 'Controlled with no default date',
  args: {
    pickerMode: 'DATETIME',
    noDefault: true,
  },
  argTypes: disabledControls,
}

export const WithMaxAndMin: Story = {
  ...Uncontrolled,
  name: 'With max and min dates',
  args: {
    date: 1696629600000,
    minDate: 1696370400000,
    maxDate: 1697752800000,
    noDefault: true,
    required: true,
    label: 'Select a Date (within next week)',
  },
  argTypes: disabledControls,
}

/*
export const DateRange: Story = {
  ...DateUncontrolled,
  name: 'Date Range',
  args: {
    pickerMode: 'DATERANGE',
    dateRange: [1696629600000, 1750369730000],
    label: 'Select a Date ',
  },
  argTypes: disabledControls,
}
*/
