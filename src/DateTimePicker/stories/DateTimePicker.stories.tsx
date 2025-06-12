import { withDateTimePicker } from '@storybook-decorators/withDateTimePicker'
import withToggleDarkMode from '@storybook-decorators/withToggleDarkMode'

import { COLORS } from '@constants'
import { timezones } from '@components'

import DateTimePicker, { DateTimePickerProps } from '../DateTimePicker'

import disabledControls from './disabledControls'
import PickerIntegration, { PickerIntegrationProps } from './PickerIntegration'

import type { Meta, StoryObj } from '@storybook/react'
import type { AnyPickerComponent } from '@types'

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
  },
  tags: ['autodocs'],
  component: DateTimePicker,
  decorators: [withDateTimePicker, withToggleDarkMode],
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

export const WithMaxAndMin: Story = {
  ...Uncontrolled,
  name: 'With max and min dates',
  args: {
    ...Uncontrolled.args,
    date: 1696629600000,
    minDate: 1696370400000,
    maxDate: 1697752800000,
    noDefault: true,
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
