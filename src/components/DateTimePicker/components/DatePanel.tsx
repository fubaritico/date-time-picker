import { useCallback, useMemo } from 'react'

import {
  addMonths,
  getMonthNameFromTs,
  getYearFromTs,
  subtractMonths,
} from '@utils'

import { useDateTimePicker, usePanelDomRect } from '../hooks'
import { PanelView } from '../types'

import DaysGrid from './DaysGrid'
import PanelHeader from './PanelHeader'
import PanelHeaderButton from './PanelHeaderButton'

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
 * On input, the timestamp value gets the msOffset in milliseconds.
 * It keeps this msOffset throughout the edition of its value.
 * On output, the timestamp value gets its msOffset removed to come back to UTC..
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
  const { color, locale, msOffset, innerDate, setInnerDate, setPanelView } =
    useDateTimePicker()

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
      // Fine for now, but should be improved later by having some temp value for browsing before first date selection
      if (prev === undefined) return subtractMonths(Date.now() + msOffset, 1)
      return subtractMonths(prev, 1)
    })
  }, [setInnerDate, msOffset])

  /**
   * A callback function that advances the date to the next month.
   *
   * @function gotoNextMonth
   * @returns {void}
   */
  const gotoNextMonth = useCallback(() => {
    setInnerDate((prev) => {
      // Fine for now, but should be improved later by having some temp value for browsing before first date selection
      if (prev === undefined) return addMonths(Date.now() + msOffset, 1)
      return addMonths(prev, 1)
    })
  }, [setInnerDate, msOffset])

  return (
    <div
      className={className}
      data-test="date-panel"
      style={{ display: 'flex', flexDirection: 'column' }}
      ref={panelRef}
    >
      <PanelHeader
        size={size}
        prevButtonAriaLabel="Previous Month"
        nextButtonAriaLabel="Next Month"
        onNextButtonClick={gotoNextMonth}
        onPrevButtonClick={gotoPrevMonth}
      >
        <PanelHeaderButton
          aria-label={getMonthNameFromTs(panelDate + msOffset, locale)}
          color={color}
          disabled
          label={getMonthNameFromTs(panelDate + msOffset, locale)}
          onClick={() => {
            setPanelView(PanelView.MONTHS)
          }}
        />
        <PanelHeaderButton
          aria-label={getYearFromTs(panelDate).toString()}
          color={color}
          disabled
          label={getYearFromTs(panelDate)}
          onClick={() => {
            setPanelView(PanelView.YEARS)
          }}
        />
      </PanelHeader>
      <DaysGrid
        date={panelDate}
        size={size}
        onDateChange={onDateChange}
        onPrevMonthKeyPress={gotoPrevMonth}
        onNextMonthKeyPress={gotoNextMonth}
      />
    </div>
  )
}

export default DatePanel
