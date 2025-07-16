import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

import type { FC, KeyboardEvent } from 'react'

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
  const { color, innerDate, finalOffset, locale } = useDateTimePicker()
  const panelRef = usePanelDomRect()
  // State: Focus managed using arrows
  const [keyboardFocusedIndex, setKeyboardFocusedIndex] = useState<number>(-1)
  // State: Inner date
  const [date, setDate] = useState<number>(
    innerDate ?? Date.now() + finalOffset
  )

  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDate(innerDate ?? Date.now() + finalOffset)
  }, [innerDate, finalOffset])

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
   * Will set the focus on a specific date cell based on its index.
   */
  const setFocusOnDate = useCallback((index: number) => {
    const value = index >= 0 ? index : 0
    setKeyboardFocusedIndex(value)
    const cells = gridRef.current?.querySelectorAll('button')
    if (cells?.[value]) {
      ;(cells[value] as HTMLElement).focus()
    }
  }, [])

  /**
   * Callback function for handling date clicks.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event - The mouse event object.
   */
  const handleDateClick = useCallback(
    (el: HTMLButtonElement) => {
      const clickedDate = el.dataset.date

      if (clickedDate) {
        onDateChange?.(Number(clickedDate))
      }
    },
    [onDateChange]
  )

  /**
   * [a11y] Handles keyboard navigation within the grid.
   * @param {KeyboardEvent} e
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        ![
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'PageDown',
          'PageUp',
          'Enter',
          ' ',
        ].includes(e.key)
      )
        return
      const ROW_LENGTH = 3
      const TOTAL_CELLS = 12

      // Pour les flèches, on empêche le comportement par défaut

      e.preventDefault()

      const cells = gridRef.current?.querySelectorAll('button')
      let newIndex = keyboardFocusedIndex

      switch (e.key) {
        case 'ArrowLeft':
          newIndex = Math.max(0, keyboardFocusedIndex - 1)
          break
        case 'Tab':
        case 'ArrowRight':
          newIndex = Math.min(TOTAL_CELLS - 1, keyboardFocusedIndex + 1)
          break
        case 'ArrowUp':
          newIndex = Math.max(0, keyboardFocusedIndex - ROW_LENGTH)
          break
        case 'ArrowDown':
          newIndex = Math.min(
            TOTAL_CELLS - 1,
            keyboardFocusedIndex + ROW_LENGTH
          )
          break
        case 'PageDown':
          gotoPrevYear()
          break
        case 'PageUp':
          gotoNextYear()
          break
        case 'Enter':
        case ' ':
          if (cells?.[keyboardFocusedIndex]) {
            ;(cells[keyboardFocusedIndex] as HTMLElement).focus()
            handleDateClick(cells[keyboardFocusedIndex])
          }
          break
      }

      if (newIndex !== keyboardFocusedIndex) {
        setFocusOnDate(newIndex)
      }
    },
    [
      handleDateClick,
      keyboardFocusedIndex,
      gotoPrevYear,
      gotoNextYear,
      setFocusOnDate,
    ]
  )

  /**
   * Will set the initial keyboard focus index to the first date of the month.
   * This is useful for keyboard navigation.
   */
  useEffect(() => {
    let index = 0

    const months = getAllMonthNames('long', locale)

    if (date) {
      index = months.findIndex(
        (monthName) => monthName === getLongMonthNameFromTs(date, locale)
      )
    }

    setFocusOnDate(index)
  }, [locale, date, setFocusOnDate])

  return (
    <div
      className={clsx('ChoicePanel', size, className)}
      data-test="month-panel"
      ref={panelRef}
    >
      <PanelHeader
        size={size}
        nextButtonAriaLabel="Next Year"
        onNextButtonClick={gotoNextYear}
        onPrevButtonClick={gotoPrevYear}
        prevButtonAriaLabel="Previous Year"
      >
        <PanelHeaderButton
          aria-label={formatToYYYYMMDD(date).split('-')[0]}
          color={color}
          label={formatToYYYYMMDD(date).split('-')[0]}
        />
      </PanelHeader>
      <div
        role="grid"
        className="panel-grid"
        ref={gridRef}
        onKeyDown={handleKeyDown}
      >
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
              onClick={(e) => {
                handleDateClick(e.currentTarget)
              }}
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
