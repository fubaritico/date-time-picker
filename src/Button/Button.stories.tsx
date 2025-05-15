import { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

import type { FC } from 'react'

const meta = {
  title: 'Components/Button',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['red', 'blue', 'green'],
      description: 'Color of the button',
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
      options: ['primary', 'secondary'],
      description: 'Variant of the button: "primary" or "secondary"',
    },
  },
  tags: ['autodocs'],
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
//  BUTTONS BOARD
//////////////////////////////////////////////////////////

const IntegrationBoard: FC = () => {
  return (
    <div className="flex flex-col relative w-full gap-12 m-10">
      <div className="flex flex-wrap gap-4">
        <h3 className="text-xl font-semibold w-full">Primary large</h3>
        <Button
          variant="primary"
          label="Primary Button"
          size="lg"
          color="stone"
        />
        <Button
          variant="primary"
          label="Primary Button"
          size="lg"
          color="stone"
          disabled
        />
        <Button
          variant="primary"
          label="Primary Button"
          size="lg"
          color="stone"
          loading
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <h3 className="text-xl font-semibold w-full">Primary medium</h3>
        <Button
          variant="primary"
          label="Primary Button"
          size="md"
          color="stone"
        />
        <Button
          variant="primary"
          label="Primary Button"
          size="md"
          color="stone"
          disabled
        />
        <Button
          variant="primary"
          label="Primary Button"
          size="md"
          color="stone"
          loading
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <h3 className="text-xl font-semibold w-full">Primary small</h3>
        <Button
          variant="primary"
          label="Primary Button"
          size="sm"
          color="stone"
        />
        <Button
          variant="primary"
          label="Primary Button"
          size="sm"
          color="stone"
          disabled
        />
        <Button
          variant="primary"
          label="Primary Button"
          size="sm"
          color="stone"
          loading
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <h3 className="text-xl font-semibold w-full">Secondary large</h3>
        <Button
          variant="secondary"
          label="Primary Button"
          size="lg"
          color="stone"
        />
        <Button
          variant="secondary"
          label="Primary Button"
          size="lg"
          color="stone"
          disabled
        />
        <Button
          variant="secondary"
          label="Primary Button"
          size="lg"
          color="stone"
          loading
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <h3 className="text-xl font-semibold w-full">Secondary medium</h3>
        <Button
          variant="secondary"
          label="Primary Button"
          size="md"
          color="stone"
        />
        <Button
          variant="secondary"
          label="Primary Button"
          size="md"
          color="stone"
          disabled
        />
        <Button
          variant="secondary"
          label="Primary Button"
          size="md"
          color="stone"
          loading
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <h3 className="text-xl font-semibold w-full">Secondary small</h3>
        <Button
          variant="secondary"
          label="Primary Button"
          size="sm"
          color="stone"
        />
        <Button
          variant="secondary"
          label="Primary Button"
          size="sm"
          color="stone"
          disabled
        />
        <Button
          variant="secondary"
          label="Primary Button"
          size="sm"
          color="stone"
          loading
        />
      </div>
    </div>
  )
}

export const Board = {
  render: () => <IntegrationBoard />,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    color: {
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
