import { withPadding } from '@storybook-decorators/withLayout'
import * as hi2 from 'react-icons/hi2'

import Icon from './Icon'

import type { Meta, StoryObj } from '@storybook/react'
import type { FC } from 'react'

const icons = Object.keys(hi2).reduce<Record<Hi2UiIconNames, string>>(
  (obj, key) => {
    const k = key as Hi2UiIconNames
    obj[k] = ''
    return obj
  },
  {} as Record<Hi2UiIconNames, string>
)

const meta = {
  title: 'Components/Icons',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      options: Object.keys(hi2),
      control: {
        type: 'select',
        labels: icons,
      },
      description: 'React icon name ex: "HiOutlineWrenchScrewdriver"',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof Icon>

export const Default = {
  args: {
    name: 'HiOutlineWrenchScrewdriver',
    style: { width: '48px', height: '48px' },
  },
} satisfies Story

const Board: FC = () => {
  return (
    <div className="icons">
      {Object.keys(hi2).map((iconName) => {
        return (
          <div key={iconName} className="icon-container">
            <Icon name={iconName as Hi2UiIconNames} />
            <span title={iconName}>{iconName}</span>
          </div>
        )
      })}
    </div>
  )
}

type StoryBoard = StoryObj<typeof Board>

export const Icons: StoryBoard = {
  render: () => <Board />,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withPadding],
}
