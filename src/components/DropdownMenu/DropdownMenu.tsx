import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import Button from '../Button'
import Label from '../Label'
import Menu from '../Menu'

import { isString } from './DropdownMenu.utils'
import { ReactComponent as HiChevronDown } from '../../assets/svg/HiChevronDown.svg'
import { ReactComponent as HiChevronUp } from '../../assets/svg/HiChevronUp.svg'

import type { ButtonProps, MenuItemConfig } from '@components'
import type { FC, ReactNode } from 'react'

export interface DropdownMenuProps {
  /* Extra CSS classes for the button (tailwind) */
  buttonClassName?: string
  /* The version of the button used in place of SimpleButton, with or without inactivity reset time (use for menu items) */
  buttonComponent?: typeof Button
  /* Default label displayed in the open button */
  buttonLabel?: ReactNode
  /* Button type */
  buttonType?: 'button' | 'submit' | 'reset'
  /* Button color */
  color?: UIColor
  /* Deprecated: Value on init (preselection in the case of a controlled component) */
  defaultValue?: string
  /* Dropdown is disabled */
  disabled?: boolean
  /* If true will render the menu in a portal */
  enablePortal?: boolean
  /* Array of menu items */
  items?: MenuItemConfig[]
  /* Text input label */
  label?: string
  /* Information displayed on hovering the exclamation mark in a tooltip */
  labelInfo?: string
  /* Loading state (in case values are fetched) */
  loading?: boolean
  /* Menu width in pixels */
  menuWidth?: number
  /* If true, the menu will have the same width as the trigger */
  menuFullWidth?: boolean
  /* If true will render the dropdown in full width */
  dropdownFullWidth?: boolean
  /* Callback called on any menu item click */
  onValueChange?: (value: string) => void
  /* The open state can be controlled */
  open?: boolean
  /* Menu placement: 'bottom-start' | 'bottom-end' */
  placement?: Extract<Placement, 'bottom-start' | 'bottom-end'>
  /* Dropdown is required */
  required?: boolean
  /* Extra CSS classes for the root element (tailwind) */
  rootClassName?: string
  /*
   * Will show the selected value instead of the button label, defaults to false.
   * Use this if you want a selectable menu item to be highlighted when selected.
   */
  showSelectedValue?: boolean
  /* Dropdown button size 'sm' | 'md' | 'lg' */
  size?: UISize
  /* Component used instead of the button, defaults to null */
  triggerComponent?: ReactNode
  /* Extra CSS classes for the trigger component element (tailwind) */
  triggerComponentClassName?: string
  /* Value passed to the component when controlled */
  value?: string
  /* Menu button style 'primary' | 'secondary' | 'ghost' */
  variant?: ButtonProps['variant']
  /* Width of the dropdown button in pixels */
  width?: number
}

const DropdownMenu: FC<DropdownMenuProps> = ({
  buttonComponent,
  buttonLabel,
  buttonType,
  color = 'stone',
  disabled,
  enablePortal = false,
  items,
  label,
  labelInfo,
  loading,
  menuWidth,
  menuFullWidth,
  placement = 'bottom-start',
  dropdownFullWidth = false,
  onValueChange,
  open,
  required,
  rootClassName,
  showSelectedValue,
  size = 'lg',
  triggerComponent = null,
  triggerComponentClassName,
  value,
  variant = 'primary',
  width,
}) => {
  const [isOpen, setIsOpen] = useState(open ?? false)
  const buttonContainerRef = useRef<HTMLDivElement>(null)
  const currentLabel =
    showSelectedValue && value
      ? items?.find((i) => i.value === value)?.label
      : (buttonLabel ?? '')

  /**
   *
   */
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  /**
   * Will emit the value of a selectable menu item
   *
   * @param item
   */
  const handleMenuItemClick = (item: MenuItemConfig) => {
    if (item.type === 'selectable' && !item.value) {
      throw Error('Value is required for selectable menu item')
    }

    if (isString(item.label) && item.type === 'selectable' && !!item.value) {
      onValueChange?.(item.value)
    }

    if (item.type !== 'selectable') {
      // Will unselect any selectable menu item already selected
      onValueChange?.('')
    }

    closeMenu()
  }

  useEffect(() => {
    document
      .getElementById('page-content')
      ?.addEventListener('scroll', closeMenu)

    return () => {
      document
        .getElementById('page-content')
        ?.removeEventListener('scroll', closeMenu)
    }
  }, [closeMenu])

  return (
    <div
      className={clsx(
        'Dropdown',
        {
          'full-width': !dropdownFullWidth,
          'menu-full-width': menuFullWidth,
          disabled: disabled ?? loading,
        },
        rootClassName
      )}
      style={{ width }}
    >
      {label && (
        <Label
          label={label}
          labelInfo={labelInfo}
          required={required}
          size={size}
          disabled={disabled}
        />
      )}
      <div className="container">
        <div
          className={clsx(
            'button-container',
            {
              'has-trigger-component': triggerComponent,
            },
            triggerComponentClassName
          )}
          ref={buttonContainerRef}
          style={{ width }}
        >
          {triggerComponent ? (
            <button
              onClick={() => {
                setIsOpen(!isOpen)
              }}
              aria-label={isString(buttonLabel) ? buttonLabel : undefined}
            >
              {triggerComponent}
            </button>
          ) : (
            <Button
              aria-label={
                isString(buttonLabel) ? buttonLabel : 'Select an option'
              }
              icon={isOpen ? HiChevronDown : HiChevronUp}
              iconPosition="right"
              data-test="dropdown-value"
              label={currentLabel}
              loading={loading}
              onClick={() => {
                setIsOpen(!isOpen)
              }}
              size={size}
              color={color}
              style={{ width }}
              type={buttonType}
              variant={variant}
            />
          )}
        </div>
        <Menu
          buttonComponent={buttonComponent}
          color={color}
          enablePortal={enablePortal}
          items={items ?? []}
          menuWidth={menuWidth}
          onClose={closeMenu}
          onMenuItemClick={handleMenuItemClick}
          open={isOpen}
          placement={placement}
          selectedValue={value}
          showSelectedValue={showSelectedValue}
          size={size}
          triggerRef={buttonContainerRef}
        />
      </div>
    </div>
  )
}

export default DropdownMenu
