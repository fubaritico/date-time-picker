import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

import { addMonths, subtractMonths } from '../DateTimePicker.utils'
import { useDateTimePicker, usePanelDomRect } from '../hooks'

import DateBrowser from './DateBrowser'
import DaysGrid from './DaysGrid'

import type { FC } from 'react'

export interface DatePanelProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Function called on date change */
  onDateChange?: (date: number) => void
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

/**
 * The DatePanel component displays the current month and year.
 * It allows the user to navigate between months and years.
 * The component also displays the days of the month in a grid.
 * The user can select a day to change the date.
 * The component uses the `useCalendar` hook to access the date state.
 * The component doesn't use the `moment` library anymore to handle dates.
 *
 * FUCKING IMPORTANT:
 * ------------------
 * On input, the timestamp value gets the offset in milliseconds.
 * It keeps this offset throughout the edition of its value.
 * On output, the timestamp value gets its offset removed to come back to UTC..
 *
 * @param className
 * @param onDateChange
 * @param range
 * @param size
 *
 * @constructor
 */
const DatePanel: FC<DatePanelProps> = ({ className, onDateChange, size }) => {
  // SHARED STATE
  const { innerDate, msOffset, setInnerDate } = useDateTimePicker()

  const panelRef = usePanelDomRect()

  /**
   * Store and refresh the date for the panel based on picker mode and provider state.
   */
  const panelDate = useMemo(() => {
    const now = Date.now() + msOffset
    return innerDate ?? now
  }, [innerDate, msOffset])

  /**
   * Function to go to the previous month.
   * It updates the date state using the `setDate` function.
   * The function uses `useCallback` to optimize performance.
   *
   * @function gotoPrevMonth
   * @returns {void}
   */
  const gotoPrevMonth = useCallback(() => {
    setInnerDate((prev) => {
      if (prev === undefined) return prev
      return subtractMonths(prev, 1)
    })
  }, [setInnerDate])

  /**
   * A callback function that advances the date to the next month.
   *
   * @function gotoNextMonth
   * @returns {void}
   */
  const gotoNextMonth = useCallback(() => {
    setInnerDate((prev) => {
      if (prev === undefined) return prev
      return addMonths(prev, 1)
    })
  }, [setInnerDate])

  return (
    <div
      className={clsx('dp-flex dp-flex-col', className)}
      data-test="date-panel"
      ref={panelRef}
    >
      <DateBrowser
        date={panelDate}
        size={size}
        onNextMonthClick={gotoNextMonth}
        onPrevMonthClick={gotoPrevMonth}
      />
      <DaysGrid date={panelDate} size={size} onDateChange={onDateChange} />
    </div>
  )
}

export default DatePanel
