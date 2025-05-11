import { Meta, StoryObj } from '@storybook/react'

import Icon from './Icon'

const meta = {
  title: 'Components/Icons',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Any css class to apply to the icon container (optional)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof Icon>

export const HeroIcon = {
  args: {
    name: 'HiOutlineWrenchScrewdriver',
  },
} satisfies Story
