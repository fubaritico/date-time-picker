import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import { addYears, getYearFromTs, subtractYears } from '@utils'

import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'

import PanelHeader from './PanelHeader'

import type { FC, KeyboardEvent } from 'react'

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
  const { color, localeDate, locale, finalOffset } = useDateTimePicker()
  const panelRef = usePanelDomRect()
  // State: Focus managed using arrows
  const [keyboardFocusedIndex, setKeyboardFocusedIndex] = useState<number>(-1)
  // State: Inner date
  const [date, setDate] = useState<number>(
    localeDate ?? Date.now() + finalOffset
  )

  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDate(localeDate ?? Date.now() + finalOffset)
  }, [localeDate, finalOffset])

  /**
   * Function to go to the previous years range.
   * It updates the date state using the `setDate` function.
   * The function uses `useCallback` to optimize performance.
   *
   * @function gotoPrevYearsRange
   * @returns {void}
   */
  const gotoPrevYearsRange = useCallback(() => {
    setDate((prev) => {
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
    setDate((prev) => {
      return addYears(prev, 12)
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
          gotoPrevYearsRange()
          break
        case 'PageUp':
          gotoNextYearsRange()
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
      gotoPrevYearsRange,
      gotoNextYearsRange,
      setFocusOnDate,
    ]
  )

  /**
   * Will set the initial keyboard focus index to the first date of the month.
   * This is useful for keyboard navigation.
   */
  useEffect(() => {
    let index = 0

    const years = Array.from({ length: 12 }, (_, i) => i).map((offset) =>
      getYearFromTs(addYears(date, offset))
    )

    if (date) {
      index = years.findIndex((year) => year === getYearFromTs(date))
    }

    setFocusOnDate(index)
  }, [locale, date, setFocusOnDate])

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
        <span aria-label={getYearFromTs(date).toString()}>
          {getYearFromTs(date).toString()}
        </span>
        {' - '}
        <span aria-label={getYearFromTs(addYears(date, 11)).toString()}>
          {getYearFromTs(addYears(date, 11)).toString()}
        </span>
      </PanelHeader>
      <div
        role="grid"
        className="panel-grid"
        ref={gridRef}
        onKeyDown={handleKeyDown}
      >
        {Array.from({ length: 12 }, (_, i) => i).map((offset) => {
          const yearWithOffset = getYearFromTs(addYears(date, offset))

          const selectedYear = getYearFromTs(
            localeDate ?? Date.now() + finalOffset
          )

          return (
            <button
              aria-label={`Choose ${yearWithOffset.toString()}`}
              className={clsx('PanelButton', color, size, {
                selected: yearWithOffset === selectedYear,
              })}
              key={yearWithOffset}
              data-date={addYears(date, offset).toString()}
              onClick={(e) => {
                handleDateClick(e.currentTarget)
              }}
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
