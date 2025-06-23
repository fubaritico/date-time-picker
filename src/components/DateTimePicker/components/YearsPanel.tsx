import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import { addYears, getYearFromTs, subtractYears } from '@utils'

import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'

import PanelHeader from './PanelHeader'

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
      className={clsx('ChoicePanel', size, className)}
      data-test="year-panel"
      ref={panelRef}
    >
      <PanelHeader
        size={size}
        nextButtonAriaLabel="Next 12 years"
        onNextButtonClick={gotoNextYearsRange}
        onPrevButtonClick={gotoPrevYearsRange}
        prevButtonAriaLabel="Previous 12 years"
      >
        <span aria-label={getYearFromTs(year).toString()}>
          {getYearFromTs(year).toString()}
        </span>
        {' - '}
        <span aria-label={getYearFromTs(addYears(year, 11)).toString()}>
          {getYearFromTs(addYears(year, 11)).toString()}
        </span>
      </PanelHeader>
      <div role="grid" className="panel-grid">
        {Array.from({ length: 12 }, (_, i) => i).map((offset) => {
          const yearWithOffset = getYearFromTs(addYears(year, offset))

          const selectedYear = getYearFromTs(innerDate ?? Date.now() + msOffset)

          return (
            <button
              aria-label={`Choose ${yearWithOffset.toString()}`}
              className={clsx('PanelButton', color, size, {
                selected: yearWithOffset === selectedYear,
              })}
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
