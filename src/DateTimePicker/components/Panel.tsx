import clsx from 'clsx'
import {
  FC,
  RefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'

import { ConditionalWrapper, Portal } from '../..'
import { FADE_ANIMATION_DURATION } from '../../constants'
import { useCalendar } from '../DateTimePicker.context'
import { PanelView, PickerMode } from '../DateTimePicker.types'

import ClickAwayListener from './ClickAwayListener'
import DatePanel from './DatePanel'
import DateTimeSwitcher from './DateTimeSwitcher'
import MonthsPanel from './MonthsPanel'
import TimePanel from './TimePanel'
import YearsPanel from './YearsPanel'

import type { PickerProps } from '..'

interface PanelProps extends PickerProps {
  /* Callback called when clicking outside the panel  */
  onClickOutside: () => void
  /* Panel placement: 'bottom-start' | 'bottom-end'  */
  placement?: 'bottom-start' | 'bottom-end'
  /* Panel size: 'small' | 'medium' | 'large'  */
  size?: UISize
  /* Reference to the HTML element triggering the opening of the panel  */
  triggerRef: RefObject<HTMLElement | null>
}

const INPUT_LABEL_HEIGHT = 24

/**
 * Panel component, will wrap the DatePanel, MonthsPanel, YearsPanel and TimePanel components.
 *
 * @param enablePortal If true, the panel will be rendered in a portal
 * @param onDateChange Called on date click if component is controlled
 * @param onClickOutside Callback function called when clicking outside the panel
 * @param onClose Callback function called when closing the panel
 * @param open If true, the panel is shown
 * @param placement Panel placement: 'bottom-start' | 'bottom-end'
 * @param size Panel size: 'small' | 'medium' | 'large'
 * @param triggerRef Reference to the HTML element triggering the opening of the panel
 *
 * @constructor
 */
const Panel: FC<PanelProps> = ({
  enablePortal,
  onDateChange,
  onClickOutside,
  onClose,
  open,
  placement,
  size,
  triggerRef,
}) => {
  const {
    inputOffset,
    pickerMode,
    isControlled,
    hasLabel,
    panelRect,
    panelView,
    setPanelView,
    setInnerDate,
    ignoreClickAwayRef,
  } = useCalendar()

  const [position, setPosition] = useState({ top: 0, left: 0 })
  const dateTimeSwitcherRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef(null)

  /**
   * Update the panel placement based on the trigger position.
   * The panel is placed below the trigger by default.
   * If the panel goes beyond the viewport, it is placed above the trigger.
   * If the panel goes beyond the viewport on the right, it is placed on the left of the trigger.
   * The position is also updated on resize and on panel change.
   */
  const updatePanelPlacement = useCallback(() => {
    if (!open || !triggerRef.current) return

    const verticalGap = 5

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const dateTimeSwitcherRect = dateTimeSwitcherRef.current
      ? dateTimeSwitcherRef.current.getBoundingClientRect()
      : { height: 0, width: 0 }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (enablePortal) {
      let newTop = triggerRect.y + triggerRect.height + verticalGap
      let newLeft = triggerRect.x

      // Adjust if panel goes beyond viewport
      if (
        triggerRect.bottom + panelRect.height + verticalGap >
        viewportHeight
      ) {
        newTop =
          triggerRect.y -
          (panelRect.height + dateTimeSwitcherRect.height + verticalGap)
        if (hasLabel) newTop += INPUT_LABEL_HEIGHT
      }

      // Absolute position relative to the trigger element
      if (placement === 'bottom-end') {
        newLeft =
          triggerRect.right - panelRect.width > 0
            ? triggerRect.right - panelRect.width
            : triggerRect.x
      }

      if (placement === 'bottom-start') {
        newLeft =
          triggerRect.x + panelRect.width > viewportWidth &&
          panelRect.width > triggerRect.width
            ? triggerRect.right - panelRect.width
            : triggerRect.x
      }

      setPosition({
        top: newTop,
        left: newLeft,
      })
    } else {
      // Default below trigger
      let newTop = triggerRect.height + verticalGap
      let newLeft = 0

      // Adjust if panel goes beyond viewport
      if (
        triggerRect.bottom + panelRect.height + verticalGap >
        viewportHeight
      ) {
        newTop =
          0 - (panelRect.height + dateTimeSwitcherRect.height + verticalGap)
      }

      if (triggerRect.left + panelRect.width > viewportWidth) {
        newLeft = triggerRect.right - panelRect.width
      }

      setPosition({ top: newTop, left: newLeft })
    }
  }, [
    enablePortal,
    hasLabel,
    open,
    panelRect.height,
    panelRect.width,
    placement,
    triggerRef,
  ])

  useEffect(() => {
    updatePanelPlacement()

    window.addEventListener('resize', updatePanelPlacement)

    return () => {
      window.removeEventListener('resize', updatePanelPlacement)
    }
  }, [open, panelRect, updatePanelPlacement])

  /**
   * On day selection, the calendar is closed.
   * On month or year selection, the calendar is back to days view, the calendar doesn't close.
   *
   * If the component is controlled the passed callback is called, otherwise the date is set in the context.
   * IMPORTANT: See if the controlled mechanism is needed. (for now, it's only used in storybook)
   *
   * @param date Date as formatted string in ISO 8601: "YYYY-MM-DD" depending on calendar mode, defaults to today
   * @param from The panel view from which the date is selected
   */
  const handleOnDateChange = (date: number, from?: PanelView) => {
    if (from !== PanelView.TIME) setPanelView(PanelView.DAYS)

    if (isControlled) {
      onDateChange?.(date - inputOffset)
    } else {
      setInnerDate(date)
    }
    if (panelView === PanelView.DAYS) onClose?.()
  }

  return (
    <ConditionalWrapper
      condition={enablePortal ?? false}
      wrapper={(children) => <Portal>{children}</Portal>}
    >
      <CSSTransition
        classNames="dtp"
        in={open}
        timeout={FADE_ANIMATION_DURATION}
        nodeRef={nodeRef}
        unmountOnExit
      >
        <ClickAwayListener
          onClickAway={() => {
            setTimeout(() => {
              setPanelView(
                pickerMode === PickerMode.TIME ? PanelView.TIME : PanelView.DAYS
              )
            }, FADE_ANIMATION_DURATION)
            onClickOutside()
          }}
          ignoreClickAwayRef={ignoreClickAwayRef}
        >
          <div
            className={clsx(
              'flex flex-col bg-white font-roboto',
              'rounded-lg shadow-elevation-1 absolute left-0 top-[54px]',
              {
                'z-[999]': enablePortal,
                'w-[400px]': size === 'large',
                'w-[308px]': size === 'medium',
                'w-[272px]': size === 'small',
              }
            )}
            ref={nodeRef}
            style={{
              position: 'absolute',
              top: `${position.top.toString()}px`,
              left: `${position.left.toString()}px`,
            }}
          >
            {pickerMode === PickerMode.DATETIME && (
              <DateTimeSwitcher
                panelView={panelView}
                ref={dateTimeSwitcherRef}
                size={size}
              />
            )}
            {panelView === PanelView.DAYS && (
              <DatePanel size={size} onDateChange={handleOnDateChange} />
            )}
            {panelView === PanelView.MONTHS && (
              <MonthsPanel size={size} onDateChange={handleOnDateChange} />
            )}
            {panelView === PanelView.YEARS && (
              <YearsPanel size={size} onDateChange={handleOnDateChange} />
            )}
            {panelView === PanelView.TIME && (
              <TimePanel size={size} onDateChange={handleOnDateChange} />
            )}
          </div>
        </ClickAwayListener>
      </CSSTransition>
    </ConditionalWrapper>
  )
}

export default memo(Panel)
