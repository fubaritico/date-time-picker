import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { cx } from '@utils'
import {
  addYears,
  formatToYYYYMMDD,
  getAllMonthNames,
  getLongMonthNameFromTs,
  getTimestampsForEachMonth,
  subtractYears,
} from '@components'

import Icon from '../../Icon'
import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'

import panelButtonStyles from './PanelButton.styles'

import type { FC, MouseEvent } from 'react'

export interface MonthsPanelProps {
  /* Tailwind CSS classes overrides or extensions for more flexibility */
  className?: string
  /* Callback function called when a date is selected */
  onDateChange?: (date: number) => void
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

/**
 * The MonthsPanel component displays the months of the year in a grid.
 *
 * @param className Tailwind CSS classes overrides or extensions for more flexibility
 * @param onDateChange Callback function called when a date is selected
 * @param size Panel size: 'sm' | 'md' | 'lg'
 * @constructor
 */
const MonthsPanel: FC<MonthsPanelProps> = ({
  className,
  onDateChange,
  size,
}) => {
  const { color, innerDate, msOffset, locale } = useDateTimePicker()
  const [date, setDate] = useState<number>(innerDate ?? Date.now() + msOffset)

  const panelRef = usePanelDomRect()

  useEffect(() => {
    setDate(innerDate ?? Date.now() + msOffset)
  }, [innerDate, msOffset])

  /**
   * Memoized array of Unix timestamps for each month of the year.
   * With same time
   */
  const monthsTimestamps = useMemo(
    () => getTimestampsForEachMonth(date),
    [date]
  )

  /**
   * Function to go to the previous year.
   * It updates the date state using the `setMonth` function.
   * The function uses `useCallback` to optimize performance.
   *
   * @function gotoPrevYear
   * @returns {void}
   */
  const gotoPrevYear = useCallback(() => {
    setDate((prev) => {
      return subtractYears(prev, 1)
    })
  }, [])

  /**
   * A callback function that advances the date to the next year.
   * It updates the date state using the `setMonth` function.
   * The function uses `useCallback` to optimize performance.
   *
   * @function gotoNextYear
   * @returns {void}
   */
  const gotoNextYear = useCallback(() => {
    setDate((prev) => {
      return addYears(prev, 1)
    })
  }, [])

  /**
   * Callback function for handling date clicks.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event - The mouse event object.
   */
  const handleDateClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const clickedDate = event.currentTarget.dataset.date

      if (clickedDate) {
        onDateChange?.(Number(clickedDate))
      }
    },
    [onDateChange]
  )

  return (
    <div
      className={clsx('flex flex-col', className)}
      data-test="month-panel"
      ref={panelRef}
    >
      <div
        className={clsx('flex gap-4 text-gray-600 justify-between', {
          'px-6 pt-6 pb-3': size === 'lg',
          'px-4 pt-4 pb-2': size === 'md' || size === 'sm',
        })}
      >
        <button
          aria-label="Previous Year"
          className={clsx(
            'appearance-none border-none bg-transparent cursor-pointer w-6'
          )}
          onClick={gotoPrevYear}
        >
          <Icon aria-hidden name="HiChevronLeft" className="w-6" />
        </button>
        <div
          className={clsx('font-bold', {
            'text-sm': size === 'md',
            'text-xs': size === 'sm',
          })}
        >
          {formatToYYYYMMDD(date).split('-')[0]}
        </div>
        <button
          aria-label="Next Year"
          className={clsx(
            'appearance-none border-none bg-transparent cursor-pointer w-6'
          )}
          onClick={gotoNextYear}
        >
          <Icon aria-hidden name="HiChevronRight" className="w-6" />
        </button>
      </div>
      <div role="grid" className="grid grid-cols-3 gap-4 p-4">
        {getAllMonthNames('long', locale).map((monthName, i, allMonthNames) => {
          return (
            <button
              aria-label={`Choose ${allMonthNames[i]}`}
              className={cx(
                panelButtonStyles({
                  isSelected:
                    allMonthNames[i] === getLongMonthNameFromTs(date, locale),
                  color,
                  size,
                })
              )}
              data-date={monthsTimestamps[i]}
              key={monthName}
              onClick={handleDateClick}
            >
              {monthName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthsPanel
