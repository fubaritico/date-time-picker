import { Meta, StoryObj } from '@storybook/react'
import { withDarkModeForBackground } from '@storybook-decorators/withDarkModeForBackground'
import { FC, useState } from 'react'

import { COLORS } from '@constants'

import TextField, { TextFieldProps } from './TextField'

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  decorators: [withDarkModeForBackground],
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'TextField is a component that allows users to input text. It can be used for various purposes such as entering names, emails, passwords, etc.',
      },
    },
  },
  argTypes: {
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
    label: {
      control: 'text',
      description: 'Label of the input',
      table: {
        type: { summary: 'string' },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'tel', 'search', 'url'],
      description: 'Type of the input<br/>' + 'Defaut is "text"',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input."Medium" is the default value',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: 'text',
      description: 'Helper text to be displayed under the input',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description:
        'Default value to be displayed inside a textual input<br/>' +
        'Will usually be empty<br/>' +
        'Mandatory for textual input<br/>' +
        'It corresponds to the useState value of the input<br/>' +
        'Example: value = {valueInput1}',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder to be displayed inside a textual input',
      table: {
        type: { summary: 'string' },
      },
    },
    iconName: {
      control: 'text',
      description: 'Icon file name',
      table: {
        type: { summary: 'string' },
      },
    },
    canClear: {
      control: 'boolean',
      description:
        'Make the textual input clearable with a cross<br/>' +
        'The cross is displayed when the input is not empty',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Integration>

const Integration: FC<{ initialValue: string } & TextFieldProps> = (props) => {
  const [value, setValue] = useState(props.initialValue)

  return (
    <TextField
      label="Label"
      placeholder="Placeholder"
      {...props}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      value={value}
    />
  )
}

const storyRenderer = (args: { initialValue: string } & TextFieldProps) => (
  <Integration {...args} />
)

export const Default: Story = {
  render: storyRenderer,
}

//////////////////////////////////////////////////////////
//  TEXTFIELD BOARD
//////////////////////////////////////////////////////////

const IntegrationBoard: FC = () => {
  return (
    <div className="dp-flex dp-flex-col dp-relative dp-w-full dp-pt-[70px]">
      <div className="dp-grid dp-grid-cols-3 dp-gap-6 dp-w-full dp-fixed dp-top-0 dp-left-0 dp-z-10 dp-p-4 dp-bg-gray-100 dp-border-b dp-border-b-gray-200 dark:dp-bg-gray-900 dark:dp-border-b-gray-800 dark:dp-text-gray-300">
        <h3 className="dp-text-xl dp-font-semibold">Small</h3>
        <h3 className="dp-text-xl dp-font-semibold">Medium</h3>
        <h3 className="dp-text-xl dp-font-semibold">Large</h3>
      </div>
      <div className="dp-grid dp-grid-cols-3 dp-gap-6 dp-w-full">
        <div className="dp-flex dp-flex-col dp-w-full">
          <div className="dp-flex dp-flex-col dp-gap-4">
            <Integration
              label="First name"
              initialValue={''}
              size="sm"
              canClear
              hideFocus
            />
            <Integration
              label="First name with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="sm"
              canClear
            />
            <Integration
              label="Required first name"
              initialValue={''}
              size="sm"
              canClear
              required
            />
            <Integration
              label="First name disabled"
              initialValue={''}
              size="sm"
              canClear
              disabled
            />
            <Integration
              label="First name disabled with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="sm"
              canClear
              disabled
            />
            <Integration
              label="First name disabled /w value"
              size="sm"
              canClear
              disabled
              initialValue="John Doe"
            />
            <Integration
              label="First name success /w value"
              size="sm"
              canClear
              initialValue="John Doe"
              severity="success"
            />
            <Integration
              label="First name error /w value"
              size="sm"
              canClear
              initialValue="John Doe"
              severity="error"
              errors={['This is an error message']}
            />
            <Integration
              label="First name /w icon"
              initialValue={''}
              size="sm"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="First name /w clickable icon and no clear icon"
              initialValue={''}
              size="sm"
              iconName="HiCalendar"
              onIconClick={() => {
                alert('Icon clicked')
              }}
            />
            <Integration
              label="Required first name /w icon"
              initialValue={''}
              size="sm"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name disabled /w icon"
              initialValue={''}
              size="sm"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name success /w icon"
              initialValue="John Doe"
              severity="success"
              size="sm"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required success first name /w icon"
              initialValue="John Doe"
              severity="success"
              size="sm"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name success disabled /w icon"
              initialValue="John Doe"
              severity="success"
              size="sm"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name error /w icon"
              initialValue="John Doe"
              severity="error"
              size="sm"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required error first name /w icon"
              initialValue="John Doe"
              severity="error"
              size="sm"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name error disabled /w icon"
              initialValue="John Doe"
              severity="error"
              size="sm"
              canClear
              iconName="HiMiniUser"
              disabled
            />
          </div>
        </div>
        <div className="dp-flex dp-flex-col dp-w-full">
          <div className="dp-flex dp-flex-col dp-gap-4">
            <Integration label="First name" initialValue={''} canClear />
            <Integration
              label="Required first name"
              initialValue={''}
              canClear
              required
            />
            <Integration
              label="First name with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              canClear
            />
            <Integration
              label="First name disabled"
              initialValue={''}
              canClear
              disabled
            />
            <Integration
              label="First name disabled with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              canClear
              disabled
            />
            <Integration
              label="First name disabled /w value"
              canClear
              disabled
              initialValue="John Doe"
            />
            <Integration
              label="First name success /w value"
              canClear
              initialValue="John Doe"
              severity="success"
            />
            <Integration
              label="First name error /w value"
              canClear
              initialValue="John Doe"
              severity="error"
              errors={['This is an error message']}
            />
            <Integration
              label="First name /w icon"
              initialValue={''}
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="First name /w clickable icon and no clear icon"
              initialValue={''}
              iconName="HiCalendar"
              onIconClick={() => {
                alert('Icon clicked')
              }}
            />
            <Integration
              label="Required first name /w icon"
              initialValue={''}
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name disabled /w icon"
              initialValue={''}
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name success /w icon"
              initialValue="John Doe"
              severity="success"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required success first name /w icon"
              initialValue="John Doe"
              severity="success"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name success disabled /w icon"
              initialValue="John Doe"
              severity="success"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name error /w icon"
              initialValue="John Doe"
              severity="error"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required error first name /w icon"
              initialValue="John Doe"
              severity="error"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name error disabled /w icon"
              initialValue="John Doe"
              severity="error"
              canClear
              iconName="HiMiniUser"
              disabled
            />
          </div>
        </div>
        <div className="dp-flex dp-flex-col dp-w-full">
          <div className="dp-flex dp-flex-col dp-gap-4">
            <Integration
              label="First name"
              initialValue={''}
              size="lg"
              canClear
            />
            <Integration
              label="First name with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="lg"
              canClear
            />
            <Integration
              label="Required first name"
              initialValue={''}
              size="lg"
              canClear
              required
            />
            <Integration
              label="First name disabled"
              initialValue={''}
              size="lg"
              canClear
              disabled
            />
            <Integration
              label="First name disabled with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="lg"
              canClear
              disabled
            />
            <Integration
              label="First name disabled /w value"
              size="lg"
              canClear
              disabled
              initialValue="John Doe"
            />
            <Integration
              label="First name success /w value"
              size="lg"
              canClear
              initialValue="John Doe"
              severity="success"
            />
            <Integration
              label="First name error /w value"
              size="lg"
              canClear
              initialValue="John Doe"
              severity="error"
              errors={['This is an error message']}
            />
            <Integration
              label="First name /w icon"
              initialValue={''}
              size="lg"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="First name /w clickable icon and no clear icon"
              initialValue={''}
              size="lg"
              iconName="HiCalendar"
              onIconClick={() => {
                alert('Icon clicked')
              }}
            />
            <Integration
              label="Required first name /w icon"
              initialValue={''}
              size="lg"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name disabled /w icon"
              initialValue={''}
              size="lg"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name success /w icon"
              initialValue="John Doe"
              severity="success"
              size="lg"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required success first name /w icon"
              initialValue="John Doe"
              severity="success"
              size="lg"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name success disabled /w icon"
              initialValue="John Doe"
              severity="success"
              size="lg"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name error /w icon"
              initialValue="John Doe"
              severity="error"
              size="lg"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required error first name /w icon"
              initialValue="John Doe"
              severity="error"
              size="lg"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name error disabled /w icon"
              initialValue="John Doe"
              severity="error"
              size="lg"
              canClear
              iconName="HiMiniUser"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const boardStoryRenderer = (args: TextFieldProps) => (
  <IntegrationBoard {...args} />
)

export const Board: Story = {
  render: boardStoryRenderer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    containerClassName: {
      table: {
        disable: true,
      },
    },
    color: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    errors: {
      table: {
        disable: true,
      },
    },
    helperText: {
      table: {
        disable: true,
      },
    },
    hideFocus: {
      table: {
        disable: true,
      },
    },
    iconName: {
      table: {
        disable: true,
      },
    },
    iconAriaLabel: {
      table: {
        disable: true,
      },
    },
    iconPosition: {
      table: {
        disable: true,
      },
    },
    iconRef: {
      table: {
        disable: true,
      },
    },
    canClear: {
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
    onChange: {
      table: {
        disable: true,
      },
    },
    onIconClick: {
      table: {
        disable: true,
      },
    },
    placeholder: {
      table: {
        disable: true,
      },
    },
    preserveIconClick: {
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
    type: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
}
