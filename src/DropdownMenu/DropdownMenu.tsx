import clsx from 'clsx'
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Button, Icon, Label, Menu } from '..'

import { isString } from './DropdownMenu.utils'

import type { ButtonProps, MenuItemConfig, MenuPlacement } from '..'

export interface DropdownMenuProps {
  /* Extra CSS classes for the button (tailwind) */
  buttonClassName?: string
  /* The version of button use in place of SimpleButton, with or without inactivity reset time (use for menu items) */
  buttonComponent?: typeof Button
  /* Default label displayed in the opener button */
  buttonLabel?: ReactNode
  /* Button type */
  buttonType?: 'button' | 'submit' | 'reset'
  /* Button color */
  color?: UIColor
  /* Deprecated: Value on init (preselection in the case of controlled component */
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
  /* Menu placement: 'bottom-start' | 'bottom-end'  */
  position?: MenuPlacement
  /* Dropdown is required */
  required?: boolean
  /* Extra CSS classes for the root element (tailwind) */
  rootClassName?: string
  /* Button shape 'rounded' | 'square' */
  shape?: 'rounded' | 'square'
  /*
   * Will show the selected value instead of the button label, defaults to false.
   * Use this if you want a selectable menu item to be highlighted when selected.
   */
  showSelectedValue?: boolean
  /* Dropdown button size 'small' | 'medium' | 'large' */
  size?: UISize
  /* Placement of the tooltip displayed on menu item hovering */
  Placement?: Placement
  /* Component used instead of the button, defaults to null */
  triggerComponent?: ReactNode
  /* Extra CSS classes for the trigger component element (tailwind) */
  triggerComponentClassName?: string
  /* Value passed to the component when controlled */
  value?: string
  /* Menu button style 'primary' | 'secondary' */
  variant?: ButtonProps['variant']
  /* Width of the dropdown button in pixels */
  width?: number
}

const labelSizes: Record<UISize, UISize> = {
  small: 'small',
  medium: 'medium',
  large: 'medium',
}

const DropdownMenu: FC<DropdownMenuProps> = ({
  variant = 'primary',
  buttonComponent,
  buttonLabel,
  buttonType,
  disabled,
  enablePortal = false,
  items,
  label,
  labelInfo,
  menuWidth,
  menuFullWidth,
  dropdownFullWidth = false,
  onValueChange,
  open,
  position = 'bottom-end',
  required,
  rootClassName,
  shape = 'rounded',
  showSelectedValue,
  size = 'large',
  triggerComponent = null,
  triggerComponentClassName,
  value,
  width,
  loading,
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
      className={clsx('flex flex-col gap-1', rootClassName, {
        'max-w-[210px]': !dropdownFullWidth,
        'pointer-events-none': disabled ?? loading,
      })}
    >
      {label && (
        <Label
          className="mb-1"
          label={label}
          labelInfo={labelInfo}
          required={required}
          size={labelSizes[size]}
          disabled={disabled}
        />
      )}
      <div className="relative w-full">
        <div
          className={clsx(
            'w-auto',
            {
              '!w-fit': triggerComponent,
            },
            triggerComponentClassName
          )}
          ref={buttonContainerRef}
        >
          {triggerComponent ? (
            <button
              className="appearance-none border-0 bg-transparent p-0"
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
              label={
                <>
                  <span
                    data-test="dropdown-value"
                    className="truncate flex-shrink"
                  >
                    {currentLabel}
                  </span>
                  <div
                    className={clsx('w-5', {
                      'mt-0.5': !isOpen,
                      'mb-0.5': isOpen,
                    })}
                  >
                    <Icon
                      name={isOpen ? 'HiChevronUp' : 'HiChevronDown'}
                      className="size-5"
                    />
                  </div>
                </>
              }
              loading={loading}
              onClick={() => {
                setIsOpen(!isOpen)
              }}
              size={size}
              style={{ width }}
              type={buttonType}
              variant={variant}
            ></Button>
          )}
        </div>
        <Menu
          buttonComponent={buttonComponent}
          className={clsx({ 'w-full': menuFullWidth })}
          enablePortal={enablePortal}
          items={items ?? []}
          menuWidth={menuWidth} // Don't really know what to do with that, to be settled.
          onClose={closeMenu}
          onMenuItemClick={handleMenuItemClick}
          open={isOpen}
          placement={position}
          selectedValue={value}
          shape={shape}
          showSelectedValue={showSelectedValue}
          size={size}
          triggerRef={buttonContainerRef}
        />
      </div>
    </div>
  )
}

export default DropdownMenu
