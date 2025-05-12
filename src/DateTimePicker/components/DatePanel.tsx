import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import Icon from '../../Icon'
import { PanelView } from '../DateTimePicker.types'
import {
  addMonths,
  getMonthNameFromTs,
  getYearFromTs,
  subtractMonths,
} from '../DateTimePicker.utils'
import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'

import DaysGrid from './DaysGrid'

import type { FC } from 'react'

export interface DatePanelProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Function called on date change */
  onDateChange?: (date: number) => void
  /* Panel size: 'small' | 'medium' | 'large'  */
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
 * @param size
 *
 * @constructor
 */
const DatePanel: FC<DatePanelProps> = ({ className, onDateChange, size }) => {
  // SHARED STATE
  const { innerDate, setPanelView, inputOffset, locale } = useDateTimePicker()
  // STATE: Unix timestamp representing the given date
  const [date, setDate] = useState<number>(
    innerDate ?? Date.now() + inputOffset
  )

  const panelRef = usePanelDomRect()

  useEffect(() => {
    setDate(innerDate ?? Date.now() + inputOffset)
  }, [innerDate, inputOffset])

  /**
   * Function to go to the previous month.
   * It updates the date state using the `setDate` function.
   * The function uses `useCallback` to optimize performance.
   *
   * @function gotoPrevMonth
   * @returns {void}
   */
  const gotoPrevMonth = useCallback(() => {
    setDate((prev) => {
      return subtractMonths(prev, 1)
    })
  }, [])

  /**
   * A callback function that advances the date to the next month.
   *
   * @function gotoNextMonth
   * @returns {void}
   */
  const gotoNextMonth = useCallback(() => {
    setDate((prev) => {
      return addMonths(prev, 1)
    })
  }, [])

  // 400, 280(4), 250(4)
  return (
    <div
      className={clsx('flex flex-col', className)}
      data-test="date-panel"
      ref={panelRef}
    >
      <div
        className={clsx('flex gap-4 text-gray-600 justify-between', {
          'px-6 pt-6 pb-3': size === 'large',
          'px-4 pt-4 pb-2': size === 'medium' || size === 'small',
        })}
      >
        <button
          aria-label="Previous Month"
          className={clsx(
            'appearance-none border-none bg-transparent cursor-pointer w-6'
          )}
          onClick={gotoPrevMonth}
        >
          <Icon aria-hidden name="HiChevronLeft" className="w-6" />
        </button>
        <div className="flex font-bold gap-1">
          <button
            aria-label={getMonthNameFromTs(date, locale)}
            className={clsx(
              'hover:text-blue-700 transition-colors duration-500',
              {
                'text-sm': size === 'medium',
                'text-xs': size === 'small',
              }
            )}
            onClick={() => {
              setPanelView(PanelView.MONTHS)
            }}
          >
            {getMonthNameFromTs(date, locale)}
          </button>
          <button
            aria-label={getYearFromTs(date).toString()}
            className={clsx(
              'hover:text-blue-700 transition-colors duration-500',
              {
                'text-sm': size === 'medium',
                'text-xs': size === 'small',
              }
            )}
            onClick={() => {
              setPanelView(PanelView.YEARS)
            }}
          >
            {getYearFromTs(date)}
          </button>
        </div>
        <button
          aria-label="Next Month"
          className={clsx(
            'appearance-none border-none bg-transparent cursor-pointer w-6'
          )}
          onClick={gotoNextMonth}
        >
          <Icon aria-hidden name="HiChevronRight" className="w-6" />
        </button>
      </div>
      <DaysGrid date={date} size={size} onDateChange={onDateChange} />
    </div>
  )
}

export default DatePanel
