import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import { BasicPickerProps } from '../DateTimePicker.types'
import {
  getAllWeekDaysNamesFromTs,
  getFirstDayOfCurrentMonthTs,
  getLastDayOfCurrentMonthTs,
  getStartDayOfWeekOfCurrentMonth,
  getStartOfDayTs,
} from '../DateTimePicker.utils'
import useDateTimePicker from '../hooks/useDateTimePicker'

import type { FC, KeyboardEvent, MouseEvent } from 'react'

export type DaysGridProps = Omit<BasicPickerProps, 'onChange'> & {
  /* Date formatted in a Unix timestamp format */
  date: number
  /* Function called on date change */
  onDateChange?: (date: number) => void
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

/**
 * The DaysGrid component displays the days of the month in a grid.
 * @param date - date formatted in a ISO8601 format.
 * @param onDateChange
 * @param size
 * @constructor
 */
const DaysGrid: FC<DaysGridProps> = ({ date, onDateChange, size = 'md' }) => {
  const [startIndex, setStartIndex] = useState(0)
  // State: Array of dates in Unix timestamp format
  const [arrayOfDates, setArrayOfDates] = useState<number[]>([])

  const { innerDate, minDate, maxDate, inputOffset, locale } =
    useDateTimePicker()
  /**
   * Will check if the time stamp is within the range of the min & max dates
   */
  const isDateValid = useCallback(
    (ts: number) => {
      const isAfterMin = !minDate || ts >= minDate
      const isBeforeMax = !maxDate || ts <= maxDate
      return isAfterMin && isBeforeMax
    },
    [minDate, maxDate]
  )

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

      if (clickedDate) {
        onDateChange?.(Number(clickedDate))
      }
    },
    [onDateChange]
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

  return (
    <div
      className={clsx('grid grid-cols-7 h-full', {
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
            {name}
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
        const isValid = isDateValid(value)

        return (
          <div
            key={value}
            tabIndex={isValid ? 0 : -1}
            role={'button'}
            aria-current={innerDate === value}
            data-date={value}
            data-test={value}
            onClick={isValid ? handleDateClick : undefined}
            onKeyDown={isValid ? handleKeyDown : undefined}
            className={clsx(
              'font-bold flex justify-center items-center transition duration-500 rounded-lg',
              'focus:outline-none focus-visible:outline-blue-illustration focus-visible:outline-1',
              {
                'h-10 w-10': size === 'lg',
                'h-9 w-9 text-sm': size === 'md',
                'h-[30px] w-8 text-xs': size === 'sm',
                'bg-white text-gray-900 hover:bg-gray-100':
                  getStartOfDayTs(Date.now() + inputOffset) !==
                    getStartOfDayTs(value) &&
                  innerDate !== value &&
                  isValid,
                'text-gray-300 cursor-not-allowed': !isValid,
                '!text-white !bg-blue-700 hover:!bg-blue-800':
                  innerDate === value && isValid,
                'bg-white shadow-border shadow-blue-600 text-blue-600 hover:!text-white hover:!bg-blue-600':
                  getStartOfDayTs(Date.now() + inputOffset) ===
                    getStartOfDayTs(value) && isValid,
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
