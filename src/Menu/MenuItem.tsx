import clsx from 'clsx'

import { Button, Icon } from '..'
import { cx } from '../utils'

import { isString } from './Menu.utils'

import type { Hi2UiIconNames } from '..'
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
  /* The version of button use in place of Button, with or without inactivity reset time */
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
      className={clsx('w-full', {
        'text-gray-500 p-0.5': typeof item.label !== 'string',
        '!p-0': item.separator,
      })}
    >
      <ButtonComponent
        type={item.buttonType}
        aria-hidden={item.separator}
        aria-label={isString(item.label) ? item.label : undefined}
        className={cx('truncate text-left w-full flex-nowrap justify-start', {
          '!px-4 !h-10': size === 'lg' && !item.separator,
          '!px-3 !h-[36px] !text-sm':
            size === 'md' && !item.separator && item.type !== 'element',
          '!px-2.5 !h-[30px] !text-xs':
            size === 'sm' && !item.separator && item.type !== 'element',
          '!p-0 !border-0 !h-auto': item.separator,
          '!text-gray-300 [&_svg]: !stroke-gray-300': item.disabled,
          '!bg-blue-100 hover:!bg-blue-200 !text-blue-500':
            !item.disabled && selected,
          '!h-[63px]': item.type === 'element',
        })}
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
        variant="ghost"
        size={size ?? 'md'}
        label={
          item.separator ? (
            <hr className="w-full" />
          ) : (
            <>
              {/* If the item displays an icon on the left */}
              {isString(item.label) && !!item.icon && (
                <Icon
                  name={item.icon}
                  className={clsx({
                    'h-6 w-6': size === 'lg',
                    'h-5 w-5': size === 'md',
                    'h-3 w-3': size === 'sm',
                  })}
                />
              )}
              {/* If the label is selectable or is an action */}
              {isString(item.label) && (
                <span
                  id={`item-${item.value ?? item.label}`}
                  className="truncate flex-shrink"
                >
                  {item.label}
                </span>
              )}
              {/* If the label is an arbitrary component */}
              {!isString(item.label) && item.type === 'element' && item.label}
            </>
          )
        }
      />
    </li>
  )
}

export default MenuItem
