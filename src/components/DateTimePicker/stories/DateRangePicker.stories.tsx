import { withDatePicker } from '@storybook-decorators/withLayout'

import { COLORS } from '@constants'
import { timezones } from '@components'

import DateRangePicker from '../DateRangePicker'

import DateRangePickerIntegration from './DateRangePickerIntegration'
import disabledControls from './disabledControls'

import type { DateRangePickerIntegrationProps } from './DateRangePickerIntegration'
import type { DateRangePickerProps } from '../DateRangePicker'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DateRangePicker> = {
  title: 'DateRangePicker',
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
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select', labels: { sm: 'sm', md: 'md', lg: 'lg' } },
      description: 'Size of the DateRangePicker',
    },
  },
  tags: ['autodocs'],
  component: DateRangePicker,
  decorators: [withDatePicker],
}

export default meta

type Story = StoryObj<typeof DateRangePicker>
type IntegrationStory = StoryObj<typeof DateRangePickerIntegration>

export const Uncontrolled: Story = {
  render: (args: DateRangePickerProps) => <DateRangePicker {...args} />,
  name: 'Uncontrolled',
  args: {
    label: 'Select a range of dates',
    pickerMode: 'DATERANGE',
    timezone: 'Europe/Paris',
  },
}

export const Controlled: IntegrationStory = {
  render: (args: DateRangePickerIntegrationProps) => (
    <DateRangePickerIntegration {...args} />
  ),
  name: 'Controlled',
  args: {
    timezone: 'Europe/Paris',
    pickerMode: 'DATERANGE',
    dateRange: [1744137767000, 1745520167000],
  },
  argTypes: disabledControls,
}

export const WithPortal: Story = {
  render: (args: DateRangePickerProps) => <DateRangePicker {...args} />,
  name: 'With Portal',
  args: {
    enablePortal: true,
    pickerMode: 'DATERANGE',
    dateRange: [1744137767000, 1745520167000],
  },
}

export const WithMaxAndMin: Story = {
  ...Uncontrolled,
  name: 'With max and min dates',
  args: {
    ...Uncontrolled.args,
    dateRange: [1744137767000, 1745520167000],
    minDate: 1741718567000,
    maxDate: 1750272167000,
    noDefault: true,
    required: true,
    label: 'Select a Date',
  },
  argTypes: disabledControls,
}

export const DateRangeWithDates: Story = {
  ...Uncontrolled,
  name: 'Uncontrolled with dates',
  args: {
    ...Uncontrolled.args,
    dateRange: [1744137767000, 1745520167000],
  },
  argTypes: disabledControls,
}

export const Colored: Story = {
  ...Uncontrolled,
  name: 'With theme colors',
  args: {
    ...Uncontrolled.args,
    dateRange: [1744137767000, 1745520167000],
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
