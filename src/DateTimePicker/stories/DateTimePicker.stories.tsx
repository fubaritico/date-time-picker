import { Meta, StoryObj } from '@storybook/react'

import { DateTimePicker, DateTimePickerProps, PickerMode } from '..'
import { timezones } from '../..'
import { withDateTimePicker } from '../../../.storybook/decorators/withDateTimePicker'

import DateTimePickerIntegration, {
  DateTimePickerIntegrationProps,
} from './DateTimePickerIntegration'

const meta: Meta<typeof DateTimePicker> = {
  title: 'DateTimePicker',
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/yHs1g5COcTsdobcRenIZxl/Odaseva---Design-Guide?node-id=3283-20285&t=mw4Hs3OlG9nCOhn3-1',
    },
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
type IntegrationStory = StoryObj<typeof DateTimePickerIntegration>

export const DateUncontrolled: Story = {
  render: (args: DateTimePickerProps) => <DateTimePicker {...args} />,
  name: 'Date - Uncontrolled',
}

export const WithPortal: Story = {
  render: (args: DateTimePickerProps) => <DateTimePicker {...args} />,
  name: 'Date - With Portal',
  args: {
    enablePortal: true,
  },
}

export const Controlled: IntegrationStory = {
  render: (args: DateTimePickerIntegrationProps) => (
    <DateTimePickerIntegration {...args} />
  ),
  name: 'Date - Controlled',
  args: {
    pickerMode: PickerMode.DATE,
  },
  argTypes: disabledControls,
}

export const DateTimeUncontrolled: Story = {
  ...DateUncontrolled,
  name: 'Date/Time - Uncontrolled',
  args: {
    pickerMode: PickerMode.DATETIME,
  },
}

export const DateTimeUncontrolledWithoutDefault: Story = {
  ...DateUncontrolled,
  name: 'Date/Time - Uncontrolled without default',
  args: {
    noDefault: true,
    pickerMode: PickerMode.DATETIME,
  },
}

export const DateTimeControlled: IntegrationStory = {
  ...Controlled,
  name: 'Date/Time - Controlled',
  args: {
    pickerMode: PickerMode.DATETIME,
  },
  argTypes: disabledControls,
}

export const DateTimeControlledWithPrefill: IntegrationStory = {
  ...Controlled,
  name: 'Date/Time - Controlled with prefill',
  args: {
    pickerMode: PickerMode.DATETIME,
    date: 1726737120000,
  },
  argTypes: disabledControls,
}

export const DateTimeControlledWithNoDefaultDate: IntegrationStory = {
  ...Controlled,
  name: 'Date/Time - Controlled with no default date',
  args: {
    pickerMode: PickerMode.DATETIME,
    noDefault: true,
  },
  argTypes: disabledControls,
}

export const DateTimeControlledWithPlacement: IntegrationStory = {
  ...Controlled,
  name: 'Date/Time - Placement',
  args: {
    pickerMode: PickerMode.DATETIME,
    placement: 'bottom-start',
  },
  argTypes: disabledControls,
}

export const TimeUncontrolled: Story = {
  ...DateUncontrolled,
  name: 'Time - Uncontrolled',
  args: {
    pickerMode: PickerMode.TIME,
  },
}

export const TimeControlled: IntegrationStory = {
  render: (args: DateTimePickerIntegrationProps) => (
    <DateTimePickerIntegration {...args} />
  ),
  name: 'Time - Controlled',
  args: {
    pickerMode: PickerMode.TIME,
    locale: 'en',
  },
  argTypes: disabledControls,
}

export const DateWithMaxAndMin: Story = {
  ...DateUncontrolled,
  name: 'Date - With Max and Min values for date',
  args: {
    pickerMode: PickerMode.DATE,
    date: 1696629600000,
    minDate: 1696370400000, // Current timestamp (now)
    maxDate: 1697752800000, // Timestamp for one week from now
    noDefault: true,
    required: true,
    label: 'Select a Date (within next week)',
  },
  argTypes: disabledControls,
}

export const Loading: Story = {
  ...DateUncontrolled,
  name: 'Loading',
  args: {
    pickerMode: PickerMode.DATE,
    date: 1696629600000,
    noDefault: true,
    label: 'Select a Date ',
    loading: true,
    disabled: true,
  },
  argTypes: disabledControls,
}
