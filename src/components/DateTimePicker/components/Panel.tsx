import clsx from 'clsx'
import {
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'

import { FADE_ANIMATION_DURATION } from '@constants'

import ClickAwayListener from '../../ClickAwayListener'
import ConditionalWrapper from '../../ConditionalWrapper'
import Portal from '../../Portal'
import { DateRangePanelProvider } from '../context'
import useDateTimePicker from '../hooks/useDateTimePicker'
import { PanelView } from '../types'

import DatePanel from './DatePanel'
import DateRangePanel from './DateRangePanel'
import DateTimeSwitcher from './DateTimeSwitcher'
import MonthsPanel from './MonthsPanel'
import TimePanel from './TimePanel'
import YearsPanel from './YearsPanel'

import type { DateRange, PickerProps } from '../types'
import type { FC, RefObject } from 'react'

interface PanelProps extends PickerProps {
  /* Callback called when clicking outside the panel  */
  onClickOutside: () => void
  /* Panel placement: 'bottom-start' | 'bottom-end'  */
  placement?: 'bottom-start' | 'bottom-end'
  /* Panel size: 'sm' | 'md' | 'lg'  */
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
 * @param size Panel size: 'sm' | 'md' | 'lg'
 * @param triggerRef Reference to the HTML element triggering the opening of the panel
 *
 * Issue: hadd vertical placement problems due to not taking scrollY into account.
 * One issue remains: If the panel is shown in a portal and the date picker is in a scrollable div,
 * it will sound to not enable the portal and have an absolute positioning.
 *
 * @constructor
 */
const Panel: FC<PanelProps> = ({
  enablePortal,
  onChange,
  onDateRangeChange,
  onClickOutside,
  onClose,
  open,
  placement,
  size,
  triggerRef,
}) => {
  const {
    dateRangePickerTimeOffsets,
    finalOffset,
    pickerMode,
    isControlled,
    hasLabel,
    localeDateRange,
    panelRect,
    panelView,
    setPanelView,
    setLocaleDate,
    ignoreClickAwayRef,
  } = useDateTimePicker()

  const [position, setPosition] = useState({ top: 0, left: 0 })
  const dateTimeSwitcherRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const isNotDateRangePicker = pickerMode !== 'DATERANGE'

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
      let newTop =
        triggerRect.y + triggerRect.height + verticalGap + window.scrollY
      let newLeft = triggerRect.x

      // Adjust if the panel goes beyond the viewport
      if (
        triggerRect.bottom + panelRect.height + verticalGap >
        viewportHeight
      ) {
        newTop =
          triggerRect.y -
          (panelRect.height + dateTimeSwitcherRect.height + verticalGap) +
          window.scrollY
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

      // Adjust if the panel goes beyond the viewport
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

  /**
   * When the 'esc' is selected, it will close the panel (possible issue with the fact that it has to be focused).
   *
   * @param {KeyboardEvent} event
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClickOutside()
    }
  }

  /**
   * On mount/init, will position the panel accordingly to the 'placement' property.
   * Then attach a resize event listener to update the panel position when the window is resized.
   */
  useEffect(() => {
    updatePanelPlacement()

    window.addEventListener('resize', updatePanelPlacement)

    return () => {
      window.removeEventListener('resize', updatePanelPlacement)
    }
  }, [open, panelRect, updatePanelPlacement])

  /**
   * When the panel is opened, it will focus the panel element.
   */
  useEffect(() => {
    if (open && nodeRef.current) nodeRef.current.focus()
  }, [open])

  /**
   * On day selection, the calendar is closed.
   * On month or year selection, the calendar is back to days view, the calendar doesn't close.
   *
   * If the component is controlled, the passed callback is called. Otherwise, the date is set in the context.
   * IMPORTANT: See if the controlled mechanism is needed. (for now, it's only used in storybook)
   *
   * @param date Date as a timestamp in milliseconds (offset is not removed)
   * @param from The panel view from which the date is selected
   */
  const handleOnDateChange = (date: number, from?: PanelView) => {
    if (from !== PanelView.TIME) setPanelView(PanelView.DAYS)

    if (isControlled) {
      onChange?.(date - finalOffset)
    } else {
      setLocaleDate(date)
    }
    if (panelView === PanelView.DAYS) onClose?.()
  }

  /**
   * On date range selection, the calendar is closed when conditions are met:
   * the end date is greater than the start date.
   *
   * If the component is controlled, the passed callback is called and emits the dates in UTC time.
   *
   * @param dateRange - Array of two dates representing the start and end date of the range in UTC time
   */
  const handleOnDateRangeChange = (dateRange: DateRange) => {
    if (isControlled) {
      onDateRangeChange?.(dateRange)
    }

    // Close the panel only if the date range is valid
    if (
      dateRange[0] !== undefined &&
      dateRange[1] !== undefined &&
      dateRange[0] < dateRange[1]
    )
      onClose?.()
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
                pickerMode === 'TIME' ? PanelView.TIME : PanelView.DAYS
              )
            }, FADE_ANIMATION_DURATION)
            onClickOutside()
          }}
          ignoreClickAwayRef={ignoreClickAwayRef}
        >
          <div
            aria-label="Choose a date"
            aria-modal="true"
            className={clsx('Panel', size, {
              portal: enablePortal,
              'not-range-picker': isNotDateRangePicker,
            })}
            ref={nodeRef}
            onKeyDown={handleKeyDown}
            role="dialog"
            style={{
              position: 'absolute',
              top: `${position.top.toString()}px`,
              left: `${position.left.toString()}px`,
            }}
          >
            {pickerMode === 'DATERANGE' && (
              <DateRangePanelProvider
                dateRange={localeDateRange}
                dateRangePickerTimeOffsets={dateRangePickerTimeOffsets}
              >
                <DateRangePanel
                  size={size}
                  onDateRangeChange={handleOnDateRangeChange}
                />
              </DateRangePanelProvider>
            )}
            {pickerMode === 'DATETIME' && (
              <DateTimeSwitcher
                panelView={panelView}
                ref={dateTimeSwitcherRef}
                size={size}
              />
            )}
            {pickerMode !== 'DATERANGE' && panelView === PanelView.DAYS && (
              <DatePanel size={size} onDateChange={handleOnDateChange} />
            )}
            {pickerMode !== 'DATERANGE' && panelView === PanelView.MONTHS && (
              <MonthsPanel size={size} onDateChange={handleOnDateChange} />
            )}
            {pickerMode !== 'DATERANGE' && panelView === PanelView.YEARS && (
              <YearsPanel size={size} onDateChange={handleOnDateChange} />
            )}
            {pickerMode !== 'DATERANGE' && panelView === PanelView.TIME && (
              <TimePanel size={size} onDateChange={handleOnDateChange} />
            )}
          </div>
        </ClickAwayListener>
      </CSSTransition>
    </ConditionalWrapper>
  )
}

export default memo(Panel)
