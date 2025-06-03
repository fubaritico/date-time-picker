import { Meta, StoryObj } from '@storybook/react'

import { PickerMode } from '@enums'

import { DateTimePicker } from '..'
import { timezones } from '../..'
import { withDateTimePicker } from '../../../.storybook/decorators/withDateTimePicker'

import DateRangePickerIntegration, {
  DateRangePickerIntegrationProps,
} from './DateRangePickerIntegration'

import type { DateTimePickerProps } from '@types'

const meta: Meta<typeof DateTimePicker> = {
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
  component: DateTimePicker,
  decorators: [withDateTimePicker],
}

export default meta

const disabledControls = {
  pickerMode: {
    table: {
      disable: true,
    },
  },
  disabled: {
    table: {
      disable: true,
    },
  },
  errorMessage: {
    table: {
      disable: true,
    },
  },
  helperText: {
    table: {
      disable: true,
    },
  },
  label: {
    table: {
      disable: true,
    },
  },
  labelInfo: {
    table: {
      disable: true,
    },
  },
  required: {
    table: {
      disable: true,
    },
  },
  severity: {
    table: {
      disable: true,
    },
  },
  size: {
    table: {
      disable: true,
    },
  },
  noDefault: {
    table: {
      disable: true,
    },
  },
  isControlled: {
    table: {
      disable: true,
    },
  },
  onClose: {
    table: {
      disable: true,
    },
  },
  locale: {
    table: {
      disable: true,
    },
  },
  onDateChange: {
    table: {
      disable: true,
    },
  },
  onDateRangeChange: {
    table: {
      disable: true,
    },
  },
  enablePortal: {
    table: {
      disable: true,
    },
  },
  open: {
    table: {
      disable: true,
    },
  },
  placement: {
    table: {
      disable: true,
    },
  },
  date: {
    table: {
      disable: true,
    },
  },
}

type Story = StoryObj<typeof DateTimePicker>
type IntegrationStory = StoryObj<typeof DateRangePickerIntegration>

export const DateRangeUncontrolled: Story = {
  render: (args: DateTimePickerProps) => <DateTimePicker {...args} />,
  name: 'Uncontrolled',
  args: {
    timezone: 'Europe/Paris',
    pickerMode: PickerMode.DATERANGE,
  },
}

export const WithPortal: Story = {
  render: (args: DateTimePickerProps) => <DateTimePicker {...args} />,
  name: 'With Portal',
  args: {
    enablePortal: true,
    pickerMode: PickerMode.DATERANGE,
    dateRange: [1744137767000, 1745520167000],
  },
}

export const Controlled: IntegrationStory = {
  render: (args: DateRangePickerIntegrationProps) => (
    <DateRangePickerIntegration {...args} />
  ),
  name: 'Controlled',
  args: {
    timezone: 'Europe/Paris',
    pickerMode: PickerMode.DATERANGE,
    dateRange: [1744137767000, 1745520167000],
  },
  argTypes: disabledControls,
}

export const DateWithMaxAndMin: Story = {
  ...DateRangeUncontrolled,
  name: 'with min & max values for date',
  args: {
    pickerMode: PickerMode.DATERANGE,
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
  ...DateRangeUncontrolled,
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
  ...DateRangeUncontrolled,
  name: 'Date Range picker with dates',
  args: {
    dateRange: [1744137767000, 1745520167000],
    label: 'Select a Date',
  },
  argTypes: disabledControls,
}
