import clsx from 'clsx'
import { useCallback } from 'react'

import { addMonths, subtractMonths } from '@utils'

import { useDateRangePanel, useDateTimePicker } from '../hooks'

import DateBrowser from './DateBrowser'
import DaysGrid from './DaysGrid'

import type { DateRange } from '../types'
import type { FC } from 'react'

export interface DateRangePanelProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Function called on date range change. Meant to pass the value upper in the tree */
  onDateRangeChange?: (date: DateRange) => void
  /* Panel size: 'sm' | 'md' | 'lg' */
  size?: UISize
}

const DateRangePanel: FC<DateRangePanelProps> = ({
  className,
  onDateRangeChange,
  size,
}) => {
  // SHARED STATE FROM DATE RANGE PANEL CONTEXT
  const { leftGridMonth, rightGridMonth, setLeftGridMonth, setRightGridMonth } =
    useDateRangePanel()
  // SHARED STATE FROM DATE TIME PICKER CONTEXT
  const { innerDateRange, setInnerDateRange } = useDateTimePicker()

  /**
   * Function to set the left grid month to the previous month when possible.
   */
  const onPrevMonthClickFromLeftGrid = useCallback(() => {
    setLeftGridMonth((prevState) => subtractMonths(prevState, 1))
  }, [setLeftGridMonth])

  /**
   * Function to set the left grid month to the next month when possible.
   */
  const onNextMonthClickFromLeftGrid = useCallback(() => {
    setLeftGridMonth((prevState) => {
      const nextMonth = addMonths(prevState, 1)
      // Ensure the next month is not after the right grid month
      if (nextMonth < rightGridMonth) {
        return nextMonth
      }
      return prevState
    })
  }, [rightGridMonth, setLeftGridMonth])

  /**
   * Function to set the right grid month to the previous month when possible.
   */
  const onPrevMonthClickFromRightGrid = useCallback(() => {
    setRightGridMonth((prevState) => {
      const prevMonth = subtractMonths(prevState, 1)
      if (prevMonth > leftGridMonth) {
        return prevMonth
      }

      return prevState
    })
  }, [leftGridMonth, setRightGridMonth])

  /**
   * Function to set the right grid month to the next month.
   */
  const onNextMonthClickFromRightGrid = useCallback(() => {
    setRightGridMonth((prevState) => addMonths(prevState, 1))
  }, [setRightGridMonth])

  /**
   * Function to select the start date of the date range.
   * On selecting the start date, the end date is set to undefined.
   *
   * @param date
   */
  const onStartDateChangeHandler = (date: number) => {
    const newDateRange: DateRange = [date, undefined]
    // Setting the inner date range in the main context (new date range)
    setInnerDateRange(newDateRange)
  }

  /**
   * Function to select the end date of the date range.
   *
   * @param date
   */
  const onEndDateChangeHandler = useCallback(
    (date: number) => {
      const newDateRange: DateRange = [innerDateRange?.[0], date]
      // Controlled component: call the onDateRangeChange callback
      if (onDateRangeChange) {
        onDateRangeChange(newDateRange)
      }
      // Setting the inner date range in the main context
      setInnerDateRange(newDateRange)
    },
    [innerDateRange, onDateRangeChange, setInnerDateRange]
  )

  return (
    <div className={clsx('dp-flex dp-flex-nowrap dp-gap-2', className)}>
      <div
        className={clsx('dp-flex dp-flex-col', className)}
        data-test="date-panel-start"
      >
        <DateBrowser
          date={leftGridMonth}
          size={size}
          onNextMonthClick={onNextMonthClickFromLeftGrid}
          onPrevMonthClick={onPrevMonthClickFromLeftGrid}
          disableNextMonth={addMonths(leftGridMonth, 1) >= rightGridMonth}
        />
        <DaysGrid
          date={leftGridMonth}
          size={size}
          onStartDateChangeHandler={onStartDateChangeHandler}
          onEndDateChangeHandler={onEndDateChangeHandler}
        />
      </div>
      <div className="dp-w-auto dp-border-r dp-border-r-gray-100 dark:dp-border-r-gray-700" />
      <div
        className={clsx('dp-flex dp-flex-col', className)}
        data-test="date-panel-end"
      >
        <DateBrowser
          date={rightGridMonth}
          size={size}
          onNextMonthClick={onNextMonthClickFromRightGrid}
          onPrevMonthClick={onPrevMonthClickFromRightGrid}
          disablePrevMonth={subtractMonths(rightGridMonth, 1) <= leftGridMonth}
        />
        <DaysGrid
          date={rightGridMonth}
          size={size}
          onStartDateChangeHandler={onStartDateChangeHandler}
          onEndDateChangeHandler={onEndDateChangeHandler}
        />
      </div>
    </div>
  )
}

export default DateRangePanel
