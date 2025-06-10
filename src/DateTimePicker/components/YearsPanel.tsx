import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import { cx } from '@utils'
import { addYears, getYearFromTs, subtractYears } from '@components'

import Icon from '../../Icon'
import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'

import panelButtonStyles from './PanelButton.styles'

import type { FC, MouseEvent } from 'react'

export interface YearsPanelProps {
  /* Tailwind CSS classes overrides or extensions for more flexibility */
  className?: string
  /* Callback function called when a date is selected */
  onDateChange?: (date: number) => void
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

/**
 * The YearsPanel component displays the years in a grid.
 *
 * @param className Tailwind CSS classes overrides or extensions for more flexibility
 * @param onDateChange Callback function called when a date is selected
 * @param size Panel size: 'sm' | 'md' | 'lg'
 * @constructor
 */
const YearsPanel: FC<YearsPanelProps> = ({ className, onDateChange, size }) => {
  const { color, innerDate, msOffset } = useDateTimePicker()
  const [year, setYear] = useState<number>(innerDate ?? Date.now() + msOffset)

  const panelRef = usePanelDomRect()

  useEffect(() => {
    setYear(innerDate ?? Date.now() + msOffset)
  }, [innerDate, msOffset])

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
          'px-6 pt-6 pb-3': size === 'lg',
          'px-4 pt-4 pb-2': size === 'md' || size === 'sm',
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
            'text-sm': size === 'md',
            'text-xs': size === 'sm',
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

          const selectedYear = getYearFromTs(innerDate ?? Date.now() + msOffset)

          return (
            <button
              aria-label={`Choose ${yearWithOffset.toString()}`}
              className={cx(
                panelButtonStyles({
                  isSelected: yearWithOffset === selectedYear,
                  color,
                  size,
                })
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
