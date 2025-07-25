import { withDatePicker } from '@storybook-decorators/withLayout'

import { COLORS } from '@constants'
import { timezones } from '@components'

import DateTimePicker, { DateTimePickerProps } from '../DateTimePicker'

import disabledControls from './disabledControls'
import PickerIntegration, { PickerIntegrationProps } from './PickerIntegration'

import type { AnyPickerComponent } from '../types'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DateTimePicker> = {
  title: 'DateTimePicker',
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
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select', labels: { sm: 'sm', md: 'md', lg: 'lg' } },
      description: 'Size of the DateTimePicker',
    },
  },
  tags: ['autodocs'],
  component: DateTimePicker,
  decorators: [withDatePicker],
}

export default meta

type Story = StoryObj<typeof DateTimePicker>
type IntegrationStory = StoryObj<typeof PickerIntegration>

export const Uncontrolled: Story = {
  render: (args: DateTimePickerProps) => <DateTimePicker {...args} />,
  name: 'Uncontrolled',
}

export const Controlled: IntegrationStory = {
  render: (args: PickerIntegrationProps) => <PickerIntegration {...args} />,
  name: 'Controlled',
  args: {
    date: 1742052493000, //1723220893000,
    PickerComponent: DateTimePicker as AnyPickerComponent,
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
  },
  argTypes: disabledControls,
}

export const WithNoDefaultDate: IntegrationStory = {
  ...Controlled,
  name: 'Controlled with no default date',
  args: {
    ...Controlled.args,
    date: undefined,
    noDefaultDate: true,
  },
  argTypes: disabledControls,
}

export const WithMaxAndMin: Story = {
  ...Uncontrolled,
  name: 'With max and min dates',
  args: {
    ...Uncontrolled.args,
    date: 1696629600000,
    minDate: 1696370400000,
    maxDate: 1697752800000,
    noDefaultDate: true,
    required: true,
    label: 'Select a Date (within next week)',
  },
  argTypes: disabledControls,
}

export const Colored: Story = {
  ...Uncontrolled,
  name: 'With theme colors',
  args: {
    ...Uncontrolled.args,
    date: 1696629600000,
    color: 'orange',
  },
  argTypes: {
    ...disabledControls,
    color: {
      options: COLORS,
      control: {
        type: 'select',
        labels: COLORS.reduce<Record<UIColor, string>>(
          (acc, color) => {
            acc[color] = color

            return acc
          },
          {} as Record<UIColor, string>
        ),
      },
    },
  },
}
