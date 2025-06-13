import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button, Icon, Label, Menu } from '..'

import { isString } from './DropdownMenu.utils'

import type { ButtonProps, MenuItemConfig } from '..'
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
      className={clsx('dp-flex dp-flex-col dp-gap-1', rootClassName, {
        'dp-max-w-[210px]': !dropdownFullWidth,
        'dp-pointer-events-none': disabled ?? loading,
      })}
      style={{ width }}
    >
      {label && (
        <Label
          className="dp-mb-1"
          label={label}
          labelInfo={labelInfo}
          required={required}
          size={size}
          disabled={disabled}
        />
      )}
      <div className="dp-relative dp-w-full">
        <div
          className={clsx(
            'w-auto',
            {
              '!w-fit': triggerComponent,
            },
            triggerComponentClassName
          )}
          ref={buttonContainerRef}
          style={{ width }}
        >
          {triggerComponent ? (
            <button
              className="dp-appearance-none dp-border-0 dp-bg-transparent dp-p-0"
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
              className="dp-w-full dp-flex-nowrap"
              label={
                <>
                  <span
                    data-test="dropdown-value"
                    className="dp-truncate dp-flex-shrink"
                  >
                    {currentLabel}
                  </span>
                  <div
                    className={clsx('dp-w-5 dp-justify-self-end', {
                      'dp-mt-0.5': !isOpen,
                      'dp-mb-0.5': isOpen,
                    })}
                  >
                    <Icon
                      name="HiChevronDown"
                      className={clsx('dp-text-white dp-transition-transform', {
                        'dp-size-4': size === 'sm',
                        'dp-size-4.5': size === 'md',
                        'dp-size-5': size === 'lg',
                        'dp-rotate-180': isOpen,
                      })}
                    />
                  </div>
                </>
              }
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
          className={clsx({ 'dp-w-full': menuFullWidth })}
          color={color}
          enablePortal={enablePortal}
          items={items ?? []}
          menuWidth={menuWidth} // Don't really know what to do with that, to be settled.
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
