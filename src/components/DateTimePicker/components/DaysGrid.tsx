import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  getAllWeekDaysNamesFromTs,
  getFirstDayOfCurrentMonthTs,
  getLastDayOfCurrentMonthTs,
  getStartDayOfWeekOfCurrentMonth,
  getStartOfDayTs,
  getTimeOffset,
} from '@utils'

import { useDateRangePanel, useDateTimePicker } from '../hooks'

import DaysGridCell from './DaysGridCell'

import type { BasicPickerProps, DateOrigin } from '../types'
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
  /* Keyboard handler that allows navigating to the previous month from a focused date */
  onPrevMonthKeyPress: () => void
  /* Keyboard handler that allows navigating to the next month from a focused date */
  onNextMonthKeyPress: () => void
  /* In DATE_RANGE From where a date will be selected, left panel or right panel */
  panelRole?: DateOrigin
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
 * @param onNextMonthKeyPress
 * @param onPrevMonthKeyPress
 * @param panelRole - The role of the panel, either 'left' or 'right'.
 * @param size - Panel size: 'sm' | 'md' | 'lg'.
 *
 * @constructor
 */
const DaysGrid: FC<DaysGridProps> = ({
  date = Date.now(),
  onDateChange,
  onStartDateChangeHandler,
  onEndDateChangeHandler,
  onNextMonthKeyPress,
  onPrevMonthKeyPress,
  panelRole,
  size = 'md',
}) => {
  // State: Focus managed by using arrows
  const [keyboardFocusedIndex, setKeyboardFocusedIndex] = useState<number>(-1)
  // State: From where iteration starts in the grid
  const [startIndex, setStartIndex] = useState(0)
  // State: Array of dates in Unix timestamp format
  const [arrayOfDates, setArrayOfDates] = useState<number[]>([])
  // Référence pour la grille
  const gridRef = useRef<HTMLTableElement>(null)
  const dateFocusedOnInit = useRef<boolean>(false)
  // Shared state from the DateTimePicker context
  const {
    color,
    localeDate,
    minDate,
    maxDate,
    finalOffset,
    dateRangePickerTimeOffsets,
    locale,
    pickerMode,
  } = useDateTimePicker()
  // Shared state from the DateRangePanel context
  const {
    dateRange,
    tempStartDate,
    tempEndDate,
    setTempStartDate,
    setTempEndDate,
    isSelectingRange,
    setStartDateOrigin,
    setEndDateOrigin,
  } = useDateRangePanel()

  const offset = useMemo(() => {
    return panelRole
      ? panelRole === 'left'
        ? getTimeOffset(
            dateRangePickerTimeOffsets[0].timezoneMsOffset,
            dateRangePickerTimeOffsets[0].localeMsOffset
          )
        : getTimeOffset(
            dateRangePickerTimeOffsets[1].timezoneMsOffset,
            dateRangePickerTimeOffsets[1].localeMsOffset
          )
      : finalOffset
  }, [dateRangePickerTimeOffsets, finalOffset, panelRole])

  /**
   * Callback function for handling date clicks.
   *
   * @param {MouseEvent<HTMLButtonElement>} event - The mouse event object.
   */
  const handleDateClick = useCallback(
    (el: HTMLButtonElement) => {
      const clickedDate = el.dataset.date

      if (!clickedDate) {
        console.warn('The clicked date is undefined.')
      }

      const clickedTs = Number(clickedDate)

      if (pickerMode !== 'DATERANGE') {
        onDateChange?.(clickedTs)
        return
      }

      if (tempStartDate === undefined) {
        if (panelRole) setStartDateOrigin(panelRole)
        setTempStartDate(clickedTs)
        onStartDateChangeHandler?.(clickedTs)
        return
      }

      if (clickedTs > tempStartDate) {
        if (panelRole) setEndDateOrigin(panelRole)
        onEndDateChangeHandler?.(clickedTs)
      }
    },
    [
      pickerMode,
      tempStartDate,
      onDateChange,
      setStartDateOrigin,
      panelRole,
      setTempStartDate,
      onStartDateChangeHandler,
      setEndDateOrigin,
      onEndDateChangeHandler,
    ]
  )

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

      e.preventDefault()

      const cells = gridRef.current?.querySelectorAll('button')
      if (!cells || cells.length === 0) return

      // Get the current focused index from the actual focused element
      const currentFocusedElement = document.activeElement as HTMLButtonElement
      const currentIndex = Array.from(cells).indexOf(currentFocusedElement)
      const focusedIndex =
        currentIndex >= 0 ? currentIndex : keyboardFocusedIndex

      let newIndex = focusedIndex
      const DAYS_IN_WEEK = 7

      // Work with the actual available buttons
      const firstButtonIndex = 0 // First available button
      const lastButtonIndex = cells.length - 1 // Last available button

      switch (e.key) {
        case 'ArrowLeft':
          // If we're at the first button, go to the last button
          if (focusedIndex === firstButtonIndex) {
            newIndex = lastButtonIndex
          } else {
            // Otherwise go back one button
            newIndex = focusedIndex - 1
          }
          break

        case 'ArrowRight':
          // If we're at the last button, go to the first button
          if (focusedIndex === lastButtonIndex) {
            newIndex = firstButtonIndex
          } else {
            // Otherwise go forward one button
            newIndex = focusedIndex + 1
          }
          break

        case 'ArrowUp': {
          const previousWeekIndex = focusedIndex - DAYS_IN_WEEK
          // Stop if we go out of valid buttons
          if (previousWeekIndex >= firstButtonIndex) {
            newIndex = previousWeekIndex
          }
          // Otherwise don't move
          break
        }

        case 'ArrowDown': {
          const nextWeekIndex = focusedIndex + DAYS_IN_WEEK
          // Stop if we go out of valid buttons
          if (nextWeekIndex <= lastButtonIndex) {
            newIndex = nextWeekIndex
          }
          // Otherwise don't move
          break
        }

        case 'PageDown':
          onPrevMonthKeyPress()
          break

        case 'PageUp':
          onNextMonthKeyPress()
          break

        case 'Enter':
        case ' ':
          ;(cells[focusedIndex] as HTMLElement).focus()
          handleDateClick(cells[focusedIndex])
          break
      }

      if (newIndex !== focusedIndex) {
        setFocusOnDate(newIndex)
      }
    },
    [
      handleDateClick,
      keyboardFocusedIndex,
      onNextMonthKeyPress,
      onPrevMonthKeyPress,
      setFocusOnDate,
    ]
  )

  /**
   * DATE RANGE MODE ONLY
   * Will set a temporary value for the end date when hovering over a date.
   * It is meant to manage display when selecting only.
   *
   * @param event
   */
  const handleDateMouseEnter = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
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
   *
   * @param ts - The date as a Unix timestamp.
   *
   * @return {boolean} - Returns true if the date is clickable, false otherwise.
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
   *
   * @param ts - The date as a Unix timestamp.
   *
   * @return {boolean} - Returns true if the date is in range, false otherwise.
   */
  const dateIsInRange = useCallback(
    (ts: number) => {
      const inRangeOnInit =
        dateRange[0] !== undefined &&
        dateRange[1] !== undefined &&
        ts >= dateRange[0] &&
        ts <= dateRange[1]

      const temporaryInRange =
        tempStartDate !== undefined &&
        tempEndDate !== undefined &&
        ts > tempStartDate &&
        ts <= tempEndDate

      return inRangeOnInit || temporaryInRange
    },
    [tempStartDate, tempEndDate, dateRange]
  )

  /**
   * Will set the state of the grid cell based on the date and its properties.
   * It will be used to determine if the cell is clickable, selected, in range, etc.
   *
   * @param ts - The date as a Unix timestamp.
   *
   * @return An object containing the state of the cell.
   */
  const setDaysGridState = useCallback(
    (ts: number) => {
      const disabled = !isDateClickable(ts)
      const isToday =
        getStartOfDayTs(Date.now() + finalOffset) === getStartOfDayTs(ts)
      const startDateIsSelected = tempStartDate === ts || dateRange[0] === ts
      const endDateIsSelected = tempEndDate === ts || dateRange[1] === ts
      const isSelected = localeDate === ts
      const isInRange = dateIsInRange(ts)

      return {
        disabled,
        isToday,
        startDateIsSelected,
        endDateIsSelected,
        isSelected,
        isInRange,
      }
    },
    [
      localeDate,
      finalOffset,
      isDateClickable,
      tempStartDate,
      tempEndDate,
      dateRange,
      dateIsInRange,
    ]
  )

  /**
   * Pads the array to ensure it has a specific size.
   * This is useful to ensure that the grid has a complete week (7 days).
   *
   * @template T
   *
   * @param array - The array to pad.
   * @param size - The size to pad the array to. It should be a multiple of 7 (i.e., a week).
   *
   * @return {(T | null)[]} - The padded array.
   */
  const padArray = <T,>(array: (T | null)[], size: number): (T | null)[] => {
    const padding = size - (array.length % size)
    if (padding === size) return array
    const paddedArray = Array.from({ length: padding }, () => null)
    return [...array, ...paddedArray]
  }

  /**
   * Splits the array into chunks of a specific size.
   * This is useful to display the dates in a grid format.
   *
   * @template T
   *
   * @param array - The array to chunk.
   * @param size - The size of each chunk. It should be a multiple of 7 (i.e., a week).
   *
   * @return {(T | null)[][]} - An array of arrays, each containing a chunk of the original array.
   */
  const chunk = <T,>(array: T[], size: number): (T | null)[][] => {
    const chunks: (T | null)[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(padArray(array.slice(i, i + size), size))
    }
    return chunks
  }

  /**
   * Checks if a date cell is accessible based on the picker mode and the current state.
   *
   * @param {number} weekIndex - The index of the week in the grid.
   * @param {number} dayIndex - The index of the day in the week.
   * @param {number} value - The date value as a Unix timestamp.
   *
   * @return {number} - Returns 0 if the cell is accessible, -1 if not.
   */
  const isAccessible = (
    weekIndex: number,
    dayIndex: number,
    value: number
  ): number => {
    if (pickerMode !== 'DATERANGE')
      return weekIndex === 0 && dayIndex === startIndex
        ? setDaysGridState(value).disabled
          ? -1
          : 0
        : -1

    return 0
  }

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
  }, [date, offset])

  /**
   * Will set the initial keyboard focus index to the first date of the month.
   * This is useful for keyboard navigation.
   */
  useEffect(() => {
    let index = 0

    if (!arrayOfDates.length || panelRole === 'right') return

    if (!date) {
      setFocusOnDate(index)
      return
    }

    if (date) {
      index = arrayOfDates.findIndex(
        (d) => getStartOfDayTs(d) === getStartOfDayTs(date)
      )
    }

    if (
      arrayOfDates.some((d) => getStartOfDayTs(d) === getStartOfDayTs(date))
    ) {
      index = arrayOfDates.findIndex(
        (d) => getStartOfDayTs(d) === getStartOfDayTs(date)
      )
    }

    setFocusOnDate(index)
    dateFocusedOnInit.current = true
  }, [arrayOfDates, date, panelRole, setFocusOnDate])

  return (
    <div className={clsx('DaysGrid', size)}>
      <table
        data-test="days-grid"
        ref={gridRef}
        role="grid"
        onKeyDown={handleKeyDown}
      >
        <thead>
          <tr>
            {getAllWeekDaysNamesFromTs(date, locale).map(
              ({ short, long }, index: number) => (
                <th key={`${short}-${index.toString()}`}>
                  <abbr className="week-day" title={long}>
                    {short.replace(/\.$/, '')}
                  </abbr>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {chunk(
            [
              ...Array.from({ length: startIndex }, () => null),
              ...arrayOfDates,
            ],
            7
          ).map((week, weekIndex) => (
            <tr key={`week-${weekIndex.toString()}`}>
              {week.map((value, dayIndex) => {
                if (value === null) {
                  return (
                    <td
                      key={`empty-${weekIndex.toString()}-${dayIndex.toString()}`}
                    />
                  )
                }

                return (
                  <td
                    key={`day-${value.toString()}`}
                    {...(setDaysGridState(value).isSelected && {
                      'aria-selected': 'true',
                    })}
                  >
                    <DaysGridCell
                      {...setDaysGridState(value)}
                      color={color}
                      locale={locale}
                      onClick={(e) => {
                        handleDateClick(e.currentTarget)
                      }}
                      onMouseEnter={handleDateMouseEnter}
                      onFocus={() => {
                        if (new Date(value + finalOffset).getDate() === 1) {
                          setKeyboardFocusedIndex(0)
                        }
                      }}
                      hasDateRangeMode={pickerMode === 'DATERANGE'}
                      isSelectingRange={isSelectingRange}
                      tabIndex={isAccessible(weekIndex, dayIndex, value)}
                      size={size}
                      value={value}
                    >
                      {new Date(value).getDate()}
                    </DaysGridCell>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DaysGrid
