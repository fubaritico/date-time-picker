import { Meta, StoryObj } from '@storybook/react'
import { FC, useState } from 'react'

import { withPadding } from '../../.storybook/decorators/withLayout'

import TextField, { TextFieldProps } from './TextField'

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  // decorators: [withDesign],
  component: TextField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/yHs1g5COcTsdobcRenIZxl/Odaseva---Design-Guide-2023?type=design&node-id=3279-34619&mode=design&t=fPou3ctT7V1YH8ZF-4',
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // General parameters
  argTypes: {
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
      options: ['small', 'medium', 'large'],
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
//  BUTTONS BOARD
//////////////////////////////////////////////////////////

const IntegrationBoard: FC = () => {
  return (
    <div className="flex flex-col relative w-full pt-[70px]">
      <div className="grid grid-cols-3 gap-6 w-full fixed top-0 left-0 z-10 p-4 bg-gray-100 border-b border-b-gray-200">
        <h3 className="text-xl font-semibold">Small</h3>
        <h3 className="text-xl font-semibold">Medium</h3>
        <h3 className="text-xl font-semibold">Large</h3>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-4">
            <Integration
              label="First name"
              initialValue={''}
              size="small"
              canClear
            />
            <Integration
              label="First name with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="small"
              canClear
            />
            <Integration
              label="Required first name"
              initialValue={''}
              size="small"
              canClear
              required
            />
            <Integration
              label="First name disabled"
              initialValue={''}
              size="small"
              canClear
              disabled
            />
            <Integration
              label="First name disabled with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="small"
              canClear
              disabled
            />
            <Integration
              label="First name disabled /w value"
              size="small"
              canClear
              disabled
              initialValue="Oda Nobunaga"
            />
            <Integration
              label="First name success /w value"
              size="small"
              canClear
              initialValue="Oda Nobunaga"
              severity="success"
            />
            <Integration
              label="First name error /w value"
              size="small"
              canClear
              initialValue="Oda Nobunaga"
              severity="error"
              errors={['This is an error message']}
            />
            <Integration
              label="First name /w icon"
              initialValue={''}
              size="small"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="First name /w clickable icon and no clear icon"
              initialValue={''}
              size="small"
              iconName="HiCalendar"
              onIconClick={() => {
                alert('Icon clicked')
              }}
            />
            <Integration
              label="Required first name /w icon"
              initialValue={''}
              size="small"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name disabled /w icon"
              initialValue={''}
              size="small"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name success /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              size="small"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required success first name /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              size="small"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name success disabled /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              size="small"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name error /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              size="small"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required error first name /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              size="small"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name error disabled /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              size="small"
              canClear
              iconName="HiMiniUser"
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-4">
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
              initialValue="Oda Nobunaga"
            />
            <Integration
              label="First name success /w value"
              canClear
              initialValue="Oda Nobunaga"
              severity="success"
            />
            <Integration
              label="First name error /w value"
              canClear
              initialValue="Oda Nobunaga"
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
              initialValue="Oda Nobunaga"
              severity="success"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required success first name /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name success disabled /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name error /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required error first name /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name error disabled /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              canClear
              iconName="HiMiniUser"
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-4">
            <Integration
              label="First name"
              initialValue={''}
              size="large"
              canClear
            />
            <Integration
              label="First name with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="large"
              canClear
            />
            <Integration
              label="Required first name"
              initialValue={''}
              size="large"
              canClear
              required
            />
            <Integration
              label="First name disabled"
              initialValue={''}
              size="large"
              canClear
              disabled
            />
            <Integration
              label="First name disabled with label info"
              labelInfo={'(Optional)'}
              initialValue={''}
              size="large"
              canClear
              disabled
            />
            <Integration
              label="First name disabled /w value"
              size="large"
              canClear
              disabled
              initialValue="Oda Nobunaga"
            />
            <Integration
              label="First name success /w value"
              size="large"
              canClear
              initialValue="Oda Nobunaga"
              severity="success"
            />
            <Integration
              label="First name error /w value"
              size="large"
              canClear
              initialValue="Oda Nobunaga"
              severity="error"
              errors={['This is an error message']}
            />
            <Integration
              label="First name /w icon"
              initialValue={''}
              size="large"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="First name /w clickable icon and no clear icon"
              initialValue={''}
              size="large"
              iconName="HiCalendar"
              onIconClick={() => {
                alert('Icon clicked')
              }}
            />
            <Integration
              label="Required first name /w icon"
              initialValue={''}
              size="large"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name disabled /w icon"
              initialValue={''}
              size="large"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name success /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              size="large"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required success first name /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              size="large"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name success disabled /w icon"
              initialValue="Oda Nobunaga"
              severity="success"
              size="large"
              canClear
              iconName="HiMiniUser"
              disabled
            />
            <Integration
              label="First name error /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              size="large"
              canClear
              iconName="HiMiniUser"
            />
            <Integration
              label="Required error first name /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              size="large"
              canClear
              iconName="HiMiniUser"
              required
            />
            <Integration
              label="First name error disabled /w icon"
              initialValue="Oda Nobunaga"
              severity="error"
              size="large"
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
  decorators: [withPadding],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
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
