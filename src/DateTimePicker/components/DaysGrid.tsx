import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import {
  getAllWeekDaysNamesFromTs,
  getFirstDayOfCurrentMonthTs,
  getLastDayOfCurrentMonthTs,
  getStartDayOfWeekOfCurrentMonth,
  getStartOfDayTs,
} from '@components'

import { cx } from '../../utils'
import { useDateRangePanel, useDateTimePicker } from '../hooks'

import type { BasicPickerProps } from '@types'
import type { FC, KeyboardEvent, MouseEvent } from 'react'

export type DaysGridProps = Omit<BasicPickerProps, 'onChange'> & {
  /* Date formatted in a Unix timestamp format */
  date?: number
  /* Function called on date change */
  onDateChange?: (date: number) => void
  /* In DATE_RANGE picker mode, called on start date change */
  onStartDateChangeHandler?: (date: number) => void
  /* In DATE_RANGE picker mode, called on end date change */
  onEndDateChangeHandler?: (date: number) => void
  /* In DATE_RANGE .... */
  panelRole?: 'left' | 'right'
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

/**
 * The DaysGrid component displays the days of the month in a grid.
 *
 * @param date - date formatted in a ISO8601 format.
 * @param onDateChange - Function called on date change, will receive a date in Unix timestamp format.
 * @param onStartDateChangeHandler - In DATE_RANGE picker mode, called on start date change.
 * @param onEndDateChangeHandler - In DATE_RANGE picker mode, called on end date change.
 * @param size - Panel size: 'sm' | 'md' | 'lg'.
 *
 * @constructor
 */
const DaysGrid: FC<DaysGridProps> = ({
  date = Date.now(),
  onDateChange,
  onStartDateChangeHandler,
  onEndDateChangeHandler,
  size = 'md',
}) => {
  const [startIndex, setStartIndex] = useState(0)
  // State: Array of dates in Unix timestamp format
  const [arrayOfDates, setArrayOfDates] = useState<number[]>([])
  // Shared state from the DateTimePicker context
  const { innerDate, minDate, maxDate, msOffset, locale, pickerMode } =
    useDateTimePicker()
  // Shared state from the DateRangePanel context
  const {
    dateRange,
    tempStartDate,
    tempEndDate,
    setTempStartDate,
    setTempEndDate,
    isSelectingRange,
  } = useDateRangePanel()

  /**
   * Will check if the date timestamp is within the range of the min and max authorized dates.
   * If not, the date cell won't be clickable.
   */
  const isDateClickable = useCallback(
    (ts: number) => {
      const isAfterMin = !minDate || ts >= minDate
      const isBeforeMax = !maxDate || ts <= maxDate
      return isAfterMin && isBeforeMax
    },
    [minDate, maxDate]
  )

  /**
   * Will set all the necessary math to display the grid of dates.
   */
  useEffect(() => {
    const firstDayOfMonth = getStartDayOfWeekOfCurrentMonth(date)
    setStartIndex((firstDayOfMonth + 6) % 7) // Adjust to make Monday the first day
    setArrayOfDates(() => {
      const startOfMonth = getFirstDayOfCurrentMonthTs(date)
      const endOfMonth = getLastDayOfCurrentMonthTs(date)
      const arr = []
      const oneDayInMs = 86400000

      for (let day = startOfMonth; day <= endOfMonth; day += oneDayInMs) {
        arr.push(day)
      }
      return arr
    })
  }, [date])

  /**
   * Callback function for handling date clicks.
   *
   * @param {MouseEvent<HTMLDivElement>} event - The mouse event object.
   */
  const handleDateClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const clickedDate = event.currentTarget.dataset.date

      if (!clickedDate) {
        console.warn('The clicked date is undefined.')
      }

      const clickedTs = Number(clickedDate)

      if (pickerMode !== 'DATERANGE') {
        onDateChange?.(clickedTs)

        return
      }

      if (tempStartDate === undefined) {
        setTempStartDate(clickedTs)
        onStartDateChangeHandler?.(clickedTs)
        return
      }

      if (clickedTs >= tempStartDate) {
        onEndDateChangeHandler?.(clickedTs)
      }
    },
    [
      onDateChange,
      setTempStartDate,
      tempStartDate,
      pickerMode,
      onStartDateChangeHandler,
      onEndDateChangeHandler,
    ]
  )

  /**
   * When a date is selected, will trigger the onDateChange callback. (quite useless but nice though)
   *
   * @param event
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleDateClick(event as never)
    }
  }

  /**
   * Will set a temporary value for the end date when hovering over a date.
   * It is meant to manage display when selecting only.
   *
   * @param event
   */
  const handleDateMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isSelectingRange) {
        const hoveredDate = event.currentTarget.dataset.date
        if (hoveredDate) {
          const dateValue = Number(hoveredDate)
          if (tempStartDate && dateValue >= tempStartDate) {
            setTempEndDate(dateValue)
          }
        }
      }
    },
    [isSelectingRange, tempStartDate, setTempEndDate]
  )

  /**
   * On init/mount, it will check if the date is in the range of the date range prop start and end dates.
   *
   * On selecting a range, it will check if the date is in the range of the temporary start and end dates.
   * It will then not use the date range prop, but the temporary values set while selecting a range.
   */
  const dateIsInRange = useCallback(
    (value: number) => {
      const inRangeOnInit =
        tempStartDate === undefined &&
        dateRange[0] !== undefined &&
        dateRange[1] !== undefined &&
        value >= dateRange[0] &&
        value <= dateRange[1]

      const temporaryInRange =
        tempStartDate !== undefined &&
        tempEndDate !== undefined &&
        value > tempStartDate &&
        value <= tempEndDate

      return inRangeOnInit || temporaryInRange
    },
    [tempStartDate, tempEndDate, dateRange]
  )

  return (
    <div
      className={clsx('grid grid-cols-7', 'group', {
        'gap-2 p-5': size === 'lg',
        'gap-1 p-4': size === 'md',
        'gap-1 p-3': size === 'sm',
      })}
      data-test="days-grid"
      role="grid"
    >
      {getAllWeekDaysNamesFromTs(date, locale).map(
        (name: string, index: number) => (
          <div
            key={`${name}-${index.toString()}`}
            className={clsx(
              'flex justify-center items-center font-bold text-gray-500',
              {
                'h-10 w-10': size === 'lg',
                'h-9 w-9 text-sm': size === 'md',
                'h-[30px] w-8 text-xs': size === 'sm',
              }
            )}
          >
            {name.replace(/\.$/, '')}
          </div>
        )
      )}
      {Array.from({ length: startIndex }, (_, index) => index).map(
        (value: number, index: number) => (
          <div
            key={`${value.toString()}-${index.toString()}`}
            role="gridcell"
          />
        )
      )}
      {arrayOfDates.map((value: number, index: number) => {
        const isClickable = isDateClickable(value)
        const isToday =
          getStartOfDayTs(Date.now() + msOffset) === getStartOfDayTs(value) &&
          !isSelectingRange
        const startDateIsSelected =
          tempStartDate === value || dateRange[0] === value
        const endDateIsSelected =
          tempEndDate === value || dateRange[1] === value
        const isSelected =
          (isClickable && innerDate === value) ||
          startDateIsSelected ||
          endDateIsSelected
        const isInRange = dateIsInRange(value)

        return (
          <div
            key={value}
            tabIndex={isClickable ? 0 : -1}
            role="button"
            aria-current={isSelected}
            data-date={value}
            data-test={value}
            onClick={isClickable ? handleDateClick : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            onMouseEnter={
              isClickable && isSelectingRange ? handleDateMouseEnter : undefined
            }
            className={cx(
              'font-bold flex justify-center items-center transition rounded-lg',
              'focus:outline-none focus-visible:outline-blue-illustration focus-visible:outline-1',
              {
                'duration-500': pickerMode !== 'DATERANGE',
                'duration-200': pickerMode === 'DATERANGE',
                'h-10 w-10': size === 'lg',
                'h-9 w-9 text-sm': size === 'md',
                'h-[30px] w-8': size === 'sm',
                'bg-white text-gray-900 hover:bg-gray-100':
                  getStartOfDayTs(Date.now() + msOffset) !==
                    getStartOfDayTs(value) &&
                  innerDate !== value &&
                  isClickable,
                'text-gray-300 cursor-not-allowed': !isClickable,
                'text-white bg-blue-700 hover:bg-blue-800': isSelected,
                'border-r border-r-white last:border-r-0 -mx-0.5': isInRange,
                'w-11': size === 'lg' && isInRange,
                'w-10': size === 'md' && isInRange,
                'h-[30px] w-8.5': size === 'sm' && isInRange,
                'text-blue-800 bg-blue-100 hover:blue-800 hover:bg-blue-100 rounded-none':
                  isInRange,
                'rounded-l-md text-white bg-blue-700 hover:bg-blue-700 rounded-r-none w-10 -mx-0.5 border-r border-r-white':
                  startDateIsSelected,
                'rounded-r-md text-white bg-blue-700 hover:bg-blue-700':
                  endDateIsSelected,
                'bg-white shadow-border border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600':
                  isToday && !isInRange,
              }
            )}
          >
            {index + 1}
          </div>
        )
      })}
    </div>
  )
}

export default DaysGrid
