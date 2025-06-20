import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import {
  getAllWeekDaysNamesFromTs,
  getFirstDayOfCurrentMonthTs,
  getLastDayOfCurrentMonthTs,
  getStartDayOfWeekOfCurrentMonth,
  getStartOfDayTs,
} from '@utils'

import { useDateRangePanel, useDateTimePicker } from '../hooks'

import DaysGridCell from './DaysGridCell'

import type { BasicPickerProps } from '../types'
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
  /* Panel size: 'sm' | 'md' | 'lg' */
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
  const { color, innerDate, minDate, maxDate, msOffset, locale, pickerMode } =
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
   * DATE RANGE MODE ONLY
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

  /**
   * Will set the state of the grid cell based on the date and its properties.
   * It will be used to determine if the cell is clickable, selected, in range, etc.
   */
  const setDaysGridState = useCallback(
    (ts: number) => {
      const isClickable = isDateClickable(ts)
      const isToday =
        getStartOfDayTs(Date.now() + msOffset) === getStartOfDayTs(ts)
      const startDateIsSelected = tempStartDate === ts || dateRange[0] === ts
      const endDateIsSelected = tempEndDate === ts || dateRange[1] === ts
      const isSelected = isClickable && innerDate === ts
      const isInRange = dateIsInRange(ts)
      const defaultBehavior =
        getStartOfDayTs(Date.now() + msOffset) !== getStartOfDayTs(ts) &&
        innerDate !== ts &&
        isClickable &&
        !startDateIsSelected &&
        !endDateIsSelected &&
        !isInRange &&
        !isToday

      return {
        isClickable,
        isToday,
        startDateIsSelected,
        endDateIsSelected,
        isSelected,
        isInRange,
        defaultBehavior,
      }
    },
    [
      innerDate,
      msOffset,
      isDateClickable,
      tempStartDate,
      tempEndDate,
      dateRange,
      dateIsInRange,
    ]
  )

  return (
    <div
      className={clsx('dp-grid dp-grid-cols-7', {
        'dp-gap-2 dp-p-5': size === 'lg',
        'dp-gap-1 dp-p-4': size === 'md',
        'dp-gap-1 dp-p-3': size === 'sm',
      })}
      data-test="days-grid"
      role="grid"
    >
      {getAllWeekDaysNamesFromTs(date, locale).map(
        (name: string, index: number) => (
          <div
            key={`${name}-${index.toString()}`}
            className={clsx(
              'dp-flex dp-justify-center dp-items-center dp-font-bold dp-text-gray-500',
              {
                'dp-h-10 dp-w-10': size === 'lg',
                'dp-h-9 dp-w-9 dp-text-sm': size === 'md',
                'dp-h-[30px] dp-w-8 dp-text-xs': size === 'sm',
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
        return (
          <DaysGridCell
            {...setDaysGridState(value)}
            key={value}
            color={color}
            handleDateClick={handleDateClick}
            handleKeyDown={handleKeyDown}
            handleDateMouseEnter={handleDateMouseEnter}
            hasDateRangeMode={pickerMode === 'DATERANGE'}
            isSelectingRange={isSelectingRange}
            size={size}
            value={value}
          >
            {index + 1}
          </DaysGridCell>
        )
      })}
    </div>
  )
}

export default DaysGrid
