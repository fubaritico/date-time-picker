import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Button, ClickAwayListener, ConditionalWrapper, Portal } from '..'
import { FADE_ANIMATION_DURATION } from '../constants'
import { debounce } from '../utils'

import './Menu.index.css'

import MenuItem from './MenuItem'

import type { MenuItemConfig } from './MenuItem'
import type {
  CSSProperties,
  FC,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from 'react'

export type MenuPlacement = 'bottom-start' | 'bottom-end'

export type MenuProps = HTMLAttributes<HTMLDivElement> & {
  /* The version of button used in place of 'Button component', must extend Button interface */
  buttonComponent?: typeof Button
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Menu items color, overrides default color */
  color?: UIColor
  /* If true will render the menu in a portal */
  enablePortal?: boolean
  /* List of menu items */
  items: MenuItemConfig[]
  /* Number of menu items display at once, if there are more than the provided value, a scrollbar will be used. Defaults to 6 items  */
  maxMenuItems?: number
  /* Menu width in pixels */
  menuWidth?: number
  /* Callback called on menu close */
  onClose?: () => void
  /* Callback called on menu item click */
  onMenuItemClick?: (item: MenuItemConfig) => void
  /* If true, will trigger display and positioning of the menu  */
  open: boolean
  /* Menu placement: 'bottom-start' | 'bottom-end'  */
  placement?: Extract<Placement, 'bottom-start' | 'bottom-end'>
  /* Menu shape 'rounded' | 'square' */
  shape?: 'rounded' | 'square'
  /* Selected value to highlight */
  selectedValue?: string
  /* Menu items size 'sm' | 'md' | 'lg', defaults to "lg" */
  size?: UISize
  /* Will allow the selected value to be displayed combined with the 'selectedValue' property */
  showSelectedValue?: boolean
  /* Reference of the element that triggers opening */
  triggerRef: RefObject<HTMLElement | null>
}

const maxMenuHeights: Record<UISize, number> = {
  sm: 30,
  md: 36,
  lg: 40,
}

const Menu: FC<MenuProps> = ({
  buttonComponent,
  className,
  color,
  enablePortal = false,
  items,
  menuWidth,
  maxMenuItems = 6,
  onClose,
  onMenuItemClick,
  open,
  placement,
  selectedValue,
  shape,
  showSelectedValue,
  size = 'lg',
  triggerRef,
  ...rest
}) => {
  const [absolutePosition, setAbsolutePosition] = useState({
    top: 0,
    left: 0,
    visibility: 'hidden',
  })
  const menuRef = useRef<HTMLDivElement>(null)

  /**
   * Compute the menu placement based on the button position.
   * The menu is placed below the trigger by default.
   * If the menu goes beyond the viewport, it is placed above the trigger.
   * If the menu goes beyond the viewport on the right, it is placed on the left of the button.
   * The position is also updated on resize and on menu change.
   *
   * On first opening, the visibility of the menu needs to be set to 'hidden'.
   */
  const computePlacement = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) return

    const verticalGap = 5

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const menuRect = menuRef.current.getBoundingClientRect()

    if (menuRect.width === 0) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (enablePortal) {
      // Default below trigger
      let newTop = triggerRect.y + triggerRect.height + verticalGap
      let newLeft = triggerRect.x

      // Adjust if panel goes beyond viewport
      if (triggerRect.bottom + menuRect.height + verticalGap > viewportHeight) {
        newTop =
          triggerRect.top - (menuRect.height + verticalGap - window.scrollY)
      }

      // Absolute position relative to the trigger element
      if (placement === 'bottom-end') {
        newLeft =
          triggerRect.right - menuRect.width > 0
            ? triggerRect.right - menuRect.width
            : triggerRect.x
      }

      if (placement === 'bottom-start') {
        newLeft =
          triggerRect.x + menuRect.width > viewportWidth
            ? triggerRect.right - menuRect.width
            : triggerRect.x
      }

      setAbsolutePosition({
        top: newTop,
        left: newLeft,
        visibility: 'visible',
      })
    } else {
      // Default below trigger
      let newTop = triggerRect.height + verticalGap
      let newLeft = 0

      // Adjust if panel goes beyond viewport
      if (triggerRect.bottom + menuRect.height + verticalGap > viewportHeight) {
        newTop = 0 - (menuRect.height + verticalGap)
      }

      // Absolute position relative to the trigger element
      if (placement === 'bottom-end') {
        newLeft =
          triggerRect.right - menuRect.width > 0
            ? triggerRect.width - menuRect.width
            : 0
      }

      if (placement === 'bottom-start') {
        newLeft =
          triggerRect.x + menuRect.width > viewportWidth
            ? triggerRect.width - menuRect.width
            : 0
      }

      setAbsolutePosition({
        top: newTop,
        left: newLeft,
        visibility: 'visible',
      })
    }
  }, [triggerRef, enablePortal, placement])

  /**
   * Update the menu placement based on the button position.
   * The menu is placed below the trigger by default.
   * If the menu goes beyond the viewport, it is placed above the trigger.
   * If the menu goes beyond the viewport on the right, it is placed on the left of the button.
   * The position is also updated on resize and on menu change.
   *
   * On first opening, the visibility of the menu needs to be set to 'hidden'.
   */
  const updateMenuPlacement = useMemo(
    () => debounce(computePlacement, 200),
    [computePlacement]
  )

  /**
   * Update the menu placement on resize
   */
  useEffect(() => {
    updateMenuPlacement()

    window.addEventListener('resize', updateMenuPlacement)

    return () => {
      window.removeEventListener('resize', updateMenuPlacement)
    }
  }, [open, updateMenuPlacement, enablePortal])

  /**
   * To open new, reset visibility to hidden
   */
  useEffect(() => {
    if (!open && absolutePosition.visibility === 'hidden') {
      setAbsolutePosition({ ...absolutePosition, visibility: 'hidden' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, enablePortal])

  return (
    <ConditionalWrapper
      condition={enablePortal}
      wrapper={(children: ReactNode) => <Portal>{children}</Portal>}
    >
      <CSSTransition
        classNames="menu"
        in={open}
        timeout={FADE_ANIMATION_DURATION}
        unmountOnExit
        nodeRef={menuRef}
      >
        <ClickAwayListener
          onClickAway={() => {
            onClose?.()
          }}
          ignoreClickAwayRef={triggerRef}
        >
          <div
            className={clsx(
              'bg-white shadow rounded-sm absolute z-[999] overflow-hidden',
              {
                '!overflow-y-scroll': items.length > maxMenuItems,
                '!rounded-md': shape === 'rounded',
              },
              className
            )}
            data-test="dropdown-menu"
            ref={menuRef}
            style={{
              position: 'absolute',
              top: `${absolutePosition.top.toString()}px`,
              left: `${absolutePosition.left.toString()}px`,
              visibility:
                absolutePosition.visibility as CSSProperties['visibility'],
              ...(menuWidth && { width: `${menuWidth.toString()}px` }),
              ...(items.length > maxMenuItems && {
                height: `${(maxMenuHeights[size] * maxMenuItems).toString()}px`,
              }),
            }}
            {...rest}
          >
            <ul className="flex flex-col">
              {items.map((item: MenuItemConfig, index) => (
                <MenuItem
                  buttonComponent={buttonComponent}
                  key={
                    typeof item.label === 'string'
                      ? item.label + index.toString()
                      : 'menu-item-' + index.toString()
                  }
                  item={item}
                  onMenuItemClick={onMenuItemClick}
                  color={color}
                  size={size}
                  selected={
                    item.value === selectedValue &&
                    (item.type === 'selectable' || !item.type) &&
                    showSelectedValue
                  }
                />
              ))}
            </ul>
          </div>
        </ClickAwayListener>
      </CSSTransition>
    </ConditionalWrapper>
  )
}

export default Menu
