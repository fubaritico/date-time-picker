import type { MenuItemConfig } from '@components'

export const menuItems: MenuItemConfig[] = [
  {
    label: 'Quick save (selectable)',
    value: 'Quick save',
  },
  {
    label: 'Save (action)',
    onButtonClick: () => {
      alert('Save')
    },
    type: 'action',
  },
  {
    label: 'Reassign (action)',
    onButtonClick: () => {
      alert('Reassigning')
    },
    type: 'action',
  },
  {
    label: 'Edit (selectable)',
    value: 'Edit',
  },
  {
    label: 'Delete',
    onButtonClick: () => {
      alert('Delete (action)')
    },
    type: 'action',
  },
]

export const selectableMenuItems: MenuItemConfig[] = [
  {
    label: 'Quick save ',
    value: 'Quick save',
  },
  {
    label: 'Save',
    value: 'Save',
  },
  {
    label: 'Reassign',
    value: 'Reassign',
  },
  {
    label: 'Edit',
    value: 'Edit',
  },
  {
    label: 'Delete',
    value: 'Delete',
  },
]

export const longMenuItems: MenuItemConfig[] = [
  {
    label: 'This is a very long menu item for an "action"',
    onButtonClick: () => {
      alert('This is a very long menu item for an "action"')
    },
  },
  {
    label: 'Another long menu item for an "selectable" item',
    value: 'value2',
  },
  {
    label: 'Very long menu item with icon for an "selectable" item',
    value: 'value3',
    icon: 'HiDocument',
  },
  {
    label: 'Another long menu item for an "selectable" item',
    onButtonClick: () => {
      alert('Another long menu item for an "selectable" item')
    },
  },
  {
    label: 'Very long menu item with icon for an "action" item',
    onButtonClick: () => {
      alert('Very long menu item with icon for an "action" item')
    },
    icon: 'HiDocument',
  },
  {
    label: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    value: 'value6',
  },
  {
    label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    value: 'value7',
  },
  {
    label: 'adipiscing elit, sed do eiusmod tempor incididunt ut ',
    value: 'value8',
  },
  {
    label: 'ea commodo consequat. Duis aute irure dolor tende',
    value: 'value9',
  },
  {
    label: 'iusmod temea commodo consequat. Duis aute irure d',
    value: 'value10',
  },
]

export const coloredMenuItems: MenuItemConfig[] = [
  {
    label: 'Quick save',
    onButtonClick: () => {
      alert('Quick save')
    },
    icon: 'HiDocument',
  },
  {
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temea commodo consequat. Duis aute irure dolor tende minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor tende.',
    onButtonClick: () => {
      alert('Save')
    },
  },
  {
    label: 'Reassign',
    onButtonClick: () => {
      alert('Reassign')
    },
    icon: 'HiEnvelope',
    color: 'yellow',
  },
  {
    label: 'Edit',
    onButtonClick: () => {
      alert('Edit')
    },
    icon: 'HiPencil',
    color: 'green',
  },
  {
    label: 'Delete',
    onButtonClick: () => {
      alert('Delete')
    },
    icon: 'HiTrash',
    color: 'red',
  },
]

export const extraMenuItems: MenuItemConfig[] = [
  {
    label: 'Go back',
    onButtonClick: () => {
      alert('Go back')
    },
  },
  {
    label: 'Create',
    onButtonClick: () => {
      alert('Create')
    },
  },
  {
    label: 'Move',
    onButtonClick: () => {
      alert('Move')
    },
  },
  {
    label: 'Close',
    onButtonClick: () => {
      alert('Close')
    },
  },
]
