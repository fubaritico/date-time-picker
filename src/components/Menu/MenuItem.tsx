import clsx from 'clsx'

import { cx } from '@utils'

import Button from '../Button'

import { isString } from './Menu.utils'

import type { FC, ReactElement } from 'react'

export type MenuItemType = 'selectable' | 'separator' | 'action' | 'element'

export interface MenuItemConfig {
  /* Menu item color, overrides default color */
  color?: UIColor
  /* Disabled state for a menu item */
  disabled?: boolean
  /* Icon name for a menu item (hi2) */
  icon?: Hi2UiIconNames
  /* Label display for the Item, also used as the value */
  label?: string | ReactElement
  /* Callback called on menu item click (used when menu item type is action) */
  onButtonClick?: (menuItemLabel?: string) => void
  /* A menu item can be a separator */
  separator?: boolean
  /* Menu item type: 'selectable' | 'separator' | 'action' | 'element' */
  type?: MenuItemType
  /* The value associated with the menu item */
  value?: string
  /* the type of the button */
  buttonType?: 'button' | 'submit' | 'reset'
  /* If provided, will take precedence on the fact that the tooltip is shown when the item label is truncated */
  showTooltip?: boolean
  /* If provided, will take precedence on the item label */
  tooltipMessage?: string
  /* Placement of the tooltip displayed on menu item hovering (inherited from Menu) */
  tooltipPlacement?: Placement
}

interface MenuItemProps {
  /* The type of button used in place of Button, with or without inactivity reset time */
  buttonComponent?: typeof Button
  /* Menu item color, overrides default color */
  color?: UIColor
  /* Menu item properties */
  item: MenuItemConfig
  /* Callback called on menu item click */
  onMenuItemClick?: (item: MenuItemConfig) => void
  /* The menu item is selected or not */
  selected?: boolean
  /* Menu items size 'sm' | 'md' | 'lg' */
  size?: UISize
}

const MenuItem: FC<MenuItemProps> = ({
  buttonComponent: ButtonComponent = Button,
  item: menuItem,
  onMenuItemClick,
  color,
  selected,
  size,
}) => {
  const item = { ...menuItem, type: menuItem.type ?? 'selectable' }

  return (
    <li
      className={clsx('dp-w-full', {
        'dp-text-gray-500 dp-p-0.5': typeof item.label !== 'string',
        '!dp-p-0': item.separator,
      })}
    >
      {item.separator ? (
        <hr className="dp-w-full" />
      ) : (
        <ButtonComponent
          type={item.buttonType}
          aria-hidden={item.separator}
          aria-label={isString(item.label) ? item.label : undefined}
          className={cx(
            'dp-truncate dp-text-left dp-w-full dp-flex-nowrap dp-justify-start',
            {
              '!dp-bg-blue-100 hover:!dp-bg-blue-200 !dp-text-blue-500':
                !item.disabled && selected,
            }
          )}
          aria-current={selected}
          aria-disabled={item.disabled ?? typeof item.label !== 'string'}
          color={color}
          disabled={item.disabled ?? typeof item.label !== 'string'}
          onClick={() => {
            if (item.type === 'action') {
              item.onButtonClick?.()
            }

            onMenuItemClick?.(item)
          }}
          icon={item.icon}
          variant="ghost"
          notRounded
          size={size ?? 'md'}
          label={
            <>
              {/* If the label is selectable or is an action */}
              {isString(item.label) && (
                <span
                  id={`item-${item.value ?? item.label}`}
                  className="dp-truncate dp-flex-shrink"
                >
                  {item.label}
                </span>
              )}
              {/* If the label is an arbitrary component */}
              {!isString(item.label) && item.type === 'element' && item.label}
            </>
          }
        />
      )}
    </li>
  )
}

export default MenuItem
