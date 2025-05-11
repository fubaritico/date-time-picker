import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import Icon from '../../Icon'
import { useCalendar } from '../DateTimePicker.context'
import { addYears, getYearFromTs, subtractYears } from '../DateTimePicker.utils'
import usePanelDomRect from '../hooks/usePanelDomRect'

import type { FC, MouseEvent } from 'react'

export interface YearsPanelProps {
  /* Tailwind CSS classes overrides or extensions for more flexibility */
  className?: string
  /* Callback function called when a date is selected */
  onDateChange?: (date: number) => void
  /* Panel size: 'small' | 'medium' | 'large'  */
  size?: UISize
}

/**
 * The YearsPanel component displays the years in a grid.
 *
 * @param className Tailwind CSS classes overrides or extensions for more flexibility
 * @param onDateChange Callback function called when a date is selected
 * @param size Panel size: 'small' | 'medium' | 'large'
 * @constructor
 */
const YearsPanel: FC<YearsPanelProps> = ({ className, onDateChange, size }) => {
  const { innerDate, inputOffset } = useCalendar()
  const [year, setYear] = useState<number>(
    innerDate ?? Date.now() + inputOffset
  )

  const panelRef = usePanelDomRect()

  useEffect(() => {
    setYear(innerDate ?? Date.now() + inputOffset)
  }, [innerDate, inputOffset])

  /**
   * Function to go to the previous years range.
   * It updates the date state using the `setDate` function.
   * The function uses `useCallback` to optimize performance.
   *
   * @function gotoPrevYearsRange
   * @returns {void}
   */
  const gotoPrevYearsRange = useCallback(() => {
    setYear((prev) => {
      return subtractYears(prev, 12)
    })
  }, [])

  /**
   * A callback function that advances the date to the next years range.
   *
   * @function gotoNextYearsRange
   * @returns {void}
   */
  const gotoNextYearsRange = useCallback(() => {
    setYear((prev) => {
      return addYears(prev, 12)
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
      data-test="year-panel"
      ref={panelRef}
    >
      <div
        className={clsx('flex gap-4 text-gray-600 justify-between', {
          'px-6 pt-6 pb-3': size === 'large',
          'px-4 pt-4 pb-2': size === 'medium' || size === 'small',
        })}
      >
        <button
          aria-label="Previous 12 years"
          className={clsx(
            'appearance-none border-none bg-transparent cursor-pointer w-6'
          )}
          onClick={gotoPrevYearsRange}
        >
          <Icon aria-hidden name="HiChevronLeft" className="size-6" />
        </button>
        <div
          className={clsx('flex font-bold gap-1', {
            'text-sm': size === 'medium',
            'text-xs': size === 'small',
          })}
        >
          <span aria-label={getYearFromTs(year).toString()}>
            {getYearFromTs(year).toString()}
          </span>
          {'-'}
          <span aria-label={getYearFromTs(addYears(year, 11)).toString()}>
            {getYearFromTs(addYears(year, 11)).toString()}
          </span>
        </div>
        <button
          aria-label="Next 12 years"
          className={clsx(
            'appearance-none border-none bg-transparent cursor-pointer w-6'
          )}
          onClick={gotoNextYearsRange}
        >
          <Icon aria-hidden name="HiChevronRight" className="size-6" />
        </button>
      </div>
      <div role="grid" className="grid grid-cols-3 gap-4 p-4">
        {Array.from({ length: 12 }, (_, i) => i).map((offset) => {
          const yearWithOffset = getYearFromTs(addYears(year, offset))

          const selectedYear = getYearFromTs(
            innerDate ?? Date.now() + inputOffset
          )

          return (
            <button
              aria-label={`Choose ${yearWithOffset.toString()}`}
              className={clsx(
                'p-2 rounded-lg truncate',
                'transition duration-200 ease-in-out',
                {
                  'text-gray-900 hover:bg-gray-100':
                    yearWithOffset !== selectedYear,
                  'border-blue-600 bg-blue-600 text-white hover:text-white hover:border-blue-600 hover:bg-blue-600':
                    yearWithOffset === selectedYear,
                  'text-sm': size === 'medium',
                  'text-xs': size === 'small',
                }
              )}
              key={yearWithOffset}
              data-date={addYears(year, offset).toString()}
              onClick={handleDateClick}
            >
              {yearWithOffset.toString()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default YearsPanel
