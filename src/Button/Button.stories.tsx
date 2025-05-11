import { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

const meta = {
  title: 'Components/SimpleButton',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary = {
  args: {
    variant: 'primary',
    label: 'Primary Button',
  },
} satisfies Story

export const Secondary = {
  args: {
    variant: 'secondary',
    label: 'Secondary Button',
  },
} satisfies Story
