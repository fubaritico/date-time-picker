import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  addYears,
  formatToYYYYMMDD,
  getAllMonthNames,
  getLongMonthNameFromTs,
  getTimestampsForEachMonth,
  subtractYears,
} from '@utils'

import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'

import PanelHeader from './PanelHeader'
import PanelHeaderButton from './PanelHeaderButton'

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
      className={clsx('ChoicePanel', size, className)}
      data-test="month-panel"
      ref={panelRef}
    >
      <PanelHeader
        size={size}
        nextButtonAriaLabel="Previous Year"
        onNextButtonClick={gotoNextYear}
        onPrevButtonClick={gotoPrevYear}
        prevButtonAriaLabel="Next Year"
      >
        <PanelHeaderButton
          aria-label={formatToYYYYMMDD(date).split('-')[0]}
          color={color}
          label={formatToYYYYMMDD(date).split('-')[0]}
        />
      </PanelHeader>
      <div role="grid" className="panel-grid">
        {getAllMonthNames('long', locale).map((monthName, i, allMonthNames) => {
          return (
            <button
              aria-label={`Choose ${allMonthNames[i]}`}
              className={clsx('PanelButton', color, size, {
                selected:
                  allMonthNames[i] === getLongMonthNameFromTs(date, locale),
              })}
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
