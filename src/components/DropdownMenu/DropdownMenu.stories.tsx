import { Meta, StoryObj } from '@storybook/react'
import { withCenteredLayout } from '@storybook-decorators/withLayout'

import { COLORS } from '@constants'

import DropdownMenu from './DropdownMenu'
import Integration from './DropdownMenu.integration'
import {
  coloredMenuItems,
  extraMenuItems,
  longMenuItems,
  menuItems,
} from './mock'
import HiEllipsisVertical from '../../assets/svg/HiEllipsisVertical.svg'

import type { DropdownMenuProps } from './DropdownMenu'
import type { FC } from 'react'

const DropdownWrapper: FC<DropdownMenuProps> = (args) => {
  return (
    <Integration {...args}>
      {({ props, currentValue, setCurrentValue }) => (
        <DropdownMenu
          {...props}
          value={currentValue}
          onValueChange={setCurrentValue}
        />
      )}
    </Integration>
  )
}

const meta: Meta<typeof DropdownWrapper> = {
  title: 'Components/Dropdown',
  parameters: {
    layout: 'fullscreen',
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
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'The appearance of the dropdown',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the dropdown',
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end'],
      description: 'The placement of the dropdown menu',
    },
    defaultValue: {
      control: 'text',
      description: 'The default value of the Dropdown',
    },
  },
  tags: ['autodocs'],
  decorators: [withCenteredLayout],
  component: DropdownWrapper,
}
export default meta

type Story = StoryObj<typeof DropdownWrapper>

export const DropdownLeftAlignment: Story = {
  name: 'Blue with bottom-start placement',
  args: {
    color: 'blue',
    variant: 'primary',
    size: 'lg',
    placement: 'bottom-start',
    items: menuItems,
    menuWidth: 300,
    buttonLabel: 'Select an action',
  },
}

export const Primary: Story = {
  name: 'Primary with bottom-end placement',
  args: {
    variant: 'primary',
    size: 'lg',
    placement: 'bottom-end',
    items: menuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const WithLongItems: Story = {
  name: 'With long items',
  args: {
    variant: 'primary',
    size: 'lg',
    placement: 'bottom-end',
    items: longMenuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
    showSelectedValue: true,
  },
}

export const WithManyItems: Story = {
  name: 'Menu with many items',
  args: {
    variant: 'primary',
    size: 'lg',
    placement: 'bottom-end',
    items: [...menuItems, ...extraMenuItems],
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const PrimaryWithColoredItemAndIcons: Story = {
  name: 'Colored menu items with icons',
  args: {
    variant: 'primary',
    size: 'lg',
    placement: 'bottom-start',
    items: coloredMenuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const Selected: Story = {
  name: 'Primary with selected value',
  args: {
    variant: 'primary',
    size: 'lg',
    defaultValue: 'Reassign',
    placement: 'bottom-end',
    items: menuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const SelectedShown: Story = {
  name: 'Primary with shown selected value',
  args: {
    variant: 'primary',
    size: 'lg',
    defaultValue: 'Reassign',
    placement: 'bottom-end',
    items: menuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
    showSelectedValue: true,
  },
}

export const WithEmailAndName: Story = {
  name: 'Primary with name and email',
  args: {
    variant: 'primary',
    size: 'lg',
    placement: 'bottom-end',
    items: [
      {
        label: (
          <div className="react-node-example">
            <span>John Doe</span>
            <span>j.doe@odaseva.com</span>
          </div>
        ),
      },
      {
        separator: true,
      },
      ...menuItems,
    ],
    menuWidth: 280,
    buttonLabel: 'Select an action',
    showSelectedValue: true,
  },
}

export const IconButtonWithMenuToTheLeft: Story = {
  name: 'Icon button with menu to the left',
  args: {
    variant: 'secondary',
    placement: 'bottom-start',
    items: menuItems,
    menuWidth: 200,
    triggerComponent: (
      <div className="trigger-component-example">
        <HiEllipsisVertical />
      </div>
    ),
    showSelectedValue: true,
    buttonLabel: 'Select an action',
  },
}

export const IconButtonWithMenuToTheRight: Story = {
  name: 'Icon button with menu to the right',
  args: {
    ...IconButtonWithMenuToTheLeft.args,
    placement: 'bottom-end',
  },
}
