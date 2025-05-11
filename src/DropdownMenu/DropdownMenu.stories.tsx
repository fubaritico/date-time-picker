import { Meta, StoryObj } from '@storybook/react'

import { Icon } from '..'

import DropdownMenu from './DropdownMenu'
import Integration from './DropdownMenu.integration'
import {
  coloredMenuItems,
  extraMenuItems,
  longMenuItems,
  menuItems,
} from './mock'

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
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'The appearance of the dropdown',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the dropdown',
    },
    position: {
      control: 'select',
      options: ['bottom-start', 'bottom-end'],
      description: 'The position of the dropdown menu',
    },
    defaultValue: {
      control: 'text',
      description: 'The default value of the Dropdown',
    },
  },
  tags: ['autodocs'],
  component: DropdownWrapper,
}
export default meta

type Story = StoryObj<typeof DropdownWrapper>

export const DropdownLeftAlignment: Story = {
  name: 'White with bottom-start placement',
  args: {
    color: 'white',
    variant: 'primary',
    size: 'large',
    shape: 'rounded',
    position: 'bottom-start',
    items: menuItems,
    menuWidth: 300,
    buttonLabel: 'Select an action',
  },
}

export const Primary: Story = {
  name: 'Primary with bottom-end placement',
  args: {
    variant: 'primary',
    size: 'large',
    shape: 'rounded',
    position: 'bottom-end',
    items: menuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const WithLongItems: Story = {
  name: 'With long items',
  args: {
    variant: 'primary',
    size: 'large',
    shape: 'rounded',
    position: 'bottom-end',
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
    size: 'large',
    shape: 'rounded',
    position: 'bottom-end',
    items: [...menuItems, ...extraMenuItems],
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const PrimaryWithColoredItemAndIcons: Story = {
  name: 'Colored menu items with icons',
  args: {
    variant: 'primary',
    size: 'large',
    shape: 'rounded',
    position: 'bottom-start',
    items: coloredMenuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const Selected: Story = {
  name: 'Primary with selected value',
  args: {
    variant: 'primary',
    size: 'large',
    shape: 'rounded',
    defaultValue: 'Reassign',
    position: 'bottom-end',
    items: menuItems,
    menuWidth: 280,
    buttonLabel: 'Select an action',
  },
}

export const SelectedShown: Story = {
  name: 'Primary with shown selected value',
  args: {
    variant: 'primary',
    size: 'large',
    shape: 'rounded',
    defaultValue: 'Reassign',
    position: 'bottom-end',
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
    size: 'large',
    shape: 'rounded',
    position: 'bottom-end',
    items: [
      {
        label: (
          <div className="flex flex-col">
            <span className="text-sm font-bold">John Doe</span>
            <span className="text-xs">j.doe@odaseva.com</span>
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
    position: 'bottom-start',
    items: menuItems,
    menuWidth: 200,
    triggerComponent: (
      <div className="flex justify-center items-center w-10 h-10 bg-white">
        <Icon name="HiEllipsisVertical" className="size-8" />
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
    position: 'bottom-end',
  },
}
