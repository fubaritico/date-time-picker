import { Meta, StoryObj } from '@storybook/react'
import { withLayout } from '@storybook-decorators/withLayout'

import { COLORS } from '@constants'

import Button, { ButtonProps } from './Button'

import type { FC } from 'react'

const meta = {
  title: 'Components/Button',
  parameters: {
    layout: 'centered',
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
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the icon relative to the label',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state of the button',
    },
    label: {
      control: 'text',
      description: 'Label of the button',
    },
    ref: {
      table: {
        disable: true,
      },
    },
    size: {
      control: 'select',
      description: 'Size of the button: "sm", "md", or "lg"',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Variant of the button: "primary" or "secondary"',
    },
  },
  tags: ['autodocs', 'hidden'],
  decorators: [withLayout],
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    variant: 'primary',
    label: 'My button',
  },
} satisfies Story

//////////////////////////////////////////////////////////
//  BUTTONS BOARD STORY
//////////////////////////////////////////////////////////
const IntegrationBoard: FC<ButtonProps> = ({ color }) => (
  <div className="case-blocks">
    <div className="case-block">
      <h3 className="case-title">Primary large</h3>
      <Button
        variant="primary"
        label="Primary Button"
        size="lg"
        color={color}
      />
      <Button
        variant="primary"
        label="Primary Button"
        size="lg"
        color={color}
        disabled
      />
      <Button
        variant="primary"
        label="Primary Button"
        size="lg"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Primary medium</h3>
      <Button
        variant="primary"
        label="Primary Button"
        size="md"
        color={color}
      />
      <Button
        variant="primary"
        label="Primary Button"
        size="md"
        color={color}
        disabled
      />
      <Button
        variant="primary"
        label="Primary Button"
        size="md"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Primary small</h3>
      <Button
        variant="primary"
        label="Primary Button"
        size="sm"
        color={color}
      />
      <Button
        variant="primary"
        label="Primary Button"
        size="sm"
        color={color}
        disabled
      />
      <Button
        variant="primary"
        label="Primary Button"
        size="sm"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Secondary large</h3>
      <Button
        variant="secondary"
        label="Primary Button"
        size="lg"
        color={color}
      />
      <Button
        variant="secondary"
        label="Primary Button"
        size="lg"
        color={color}
        disabled
      />
      <Button
        variant="secondary"
        label="Primary Button"
        size="lg"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Secondary medium</h3>
      <Button
        variant="secondary"
        label="Primary Button"
        size="md"
        color={color}
      />
      <Button
        variant="secondary"
        label="Primary Button"
        size="md"
        color={color}
        disabled
      />
      <Button
        variant="secondary"
        label="Primary Button"
        size="md"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Secondary small</h3>
      <Button
        variant="secondary"
        label="Primary Button"
        size="sm"
        color={color}
      />
      <Button
        variant="secondary"
        label="Primary Button"
        size="sm"
        color={color}
        disabled
      />
      <Button
        variant="secondary"
        label="Primary Button"
        size="sm"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Ghost large</h3>
      <Button variant="ghost" label="Ghost Button" size="lg" color={color} />
      <Button
        variant="ghost"
        label="Ghost Button"
        size="lg"
        color={color}
        disabled
      />
      <Button
        variant="ghost"
        label="Ghost Button"
        size="lg"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Ghost medium</h3>
      <Button variant="ghost" label="Ghost Button" size="md" color={color} />
      <Button
        variant="ghost"
        label="Ghost Button"
        size="md"
        color={color}
        disabled
      />
      <Button
        variant="ghost"
        label="Ghost Button"
        size="md"
        color={color}
        loading
      />
    </div>
    <div className="case-block">
      <h3 className="case-title">Ghost small</h3>
      <Button variant="ghost" label="Ghost Button" size="sm" color={color} />
      <Button
        variant="ghost"
        label="Ghost Button"
        size="sm"
        color={color}
        disabled
      />
      <Button
        variant="ghost"
        label="Ghost Button"
        size="sm"
        color={color}
        loading
      />
    </div>
  </div>
)

type IntegrationStory = StoryObj<typeof IntegrationBoard>

export const Board: IntegrationStory = {
  render: (args: ButtonProps) => <IntegrationBoard {...args} />,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    color: 'stone',
  },
  argTypes: {
    iconPosition: {
      table: {
        disable: true,
      },
    },
    icon: {
      table: {
        disable: true,
      },
    },
    loading: {
      table: {
        disable: true,
      },
    },
    label: {
      table: {
        disable: true,
      },
    },
    ref: {
      table: {
        disable: true,
      },
    },
    size: {
      table: {
        disable: true,
      },
    },
    variant: {
      table: {
        disable: true,
      },
    },
  },
}
