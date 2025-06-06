import { Meta, StoryObj } from '@storybook/react'
import { withDateTimePicker } from '@storybook-decorators/withDateTimePicker'

import { timezones } from '@components'

import DateRangePicker, { DateRangePickerProps } from '../DateRangePicker'

import DateRangePickerIntegration, {
  DateRangePickerIntegrationProps,
} from './DateRangePickerIntegration'
import disabledControls from './disabledControls'

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
  },
  tags: ['autodocs'],
  component: DateRangePicker,
  decorators: [withDateTimePicker],
}

export default meta

type Story = StoryObj<typeof DateRangePicker>
type IntegrationStory = StoryObj<typeof DateRangePickerIntegration>

export const Uncontrolled: Story = {
  render: (args: DateRangePickerProps) => <DateRangePicker {...args} />,
  name: 'Uncontrolled',
  args: {
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
    dateRange: [1744137767000, 1745520167000],
  },
}

export const WithMaxAndMin: Story = {
  ...Uncontrolled,
  name: 'with min & max values for date',
  args: {
    dateRange: [1744137767000, 1745520167000],
    minDate: 1741718567000,
    maxDate: 1750272167000,
    noDefault: true,
    required: true,
    label: 'Select a Date',
  },
  argTypes: disabledControls,
}

export const Loading: Story = {
  ...Uncontrolled,
  name: 'Loading',
  args: {
    dateRange: [1744137767000, 1745520167000],
    noDefault: true,
    label: 'Select a Date',
    loading: true,
    disabled: true,
  },
  argTypes: disabledControls,
}

export const DateRangeWithDates: Story = {
  ...Uncontrolled,
  name: 'Date Range picker with dates',
  args: {
    dateRange: [1744137767000, 1745520167000],
    label: 'Select a Date',
  },
  argTypes: disabledControls,
}
