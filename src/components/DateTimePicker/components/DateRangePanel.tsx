import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

import {
  addMonths,
  getActualOffset,
  getMonthNameFromTs,
  getYearFromTs,
  subtractMonths,
} from '@utils'

import { useDateRangePanel, useDateTimePicker } from '../hooks'
import { DateRange } from '../types'

import DaysGrid from './DaysGrid'
import PanelHeader from './PanelHeader'
import PanelHeaderButton from './PanelHeaderButton'

import type { FC } from 'react'

export interface DateRangePanelProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Function called on date range change. Meant to pass the value upper in the tree */
  onDateRangeChange?: (date: DateRange) => void
  /* Panel size: 'sm' | 'md' | 'lg' */
  size?: UISize
}

const DateRangePanel: FC<DateRangePanelProps> = ({
  className,
  onDateRangeChange,
  size,
}) => {
  // SHARED STATE FROM DATE RANGE PANEL CONTEXT
  const {
    endDateOrigin,
    leftGridMonth,
    rightGridMonth,
    setLeftGridMonth,
    setRightGridMonth,
    startDateOrigin,
  } = useDateRangePanel()
  // SHARED STATE FROM DATE TIME PICKER CONTEXT
  const {
    color,
    dateRangePickerOffsets,
    innerDateRange,
    locale,
    setInnerDateRange,
  } = useDateTimePicker()

  /**
   * Gets the actual offset combining the local offset and the GMT offset.
   */
  const daysGridsMsOffsets = useMemo(() => {
    return [
      getActualOffset(
        dateRangePickerOffsets[0].timezoneMsOffset,
        dateRangePickerOffsets[0].localeMsOffset
      ),
      getActualOffset(
        dateRangePickerOffsets[1].timezoneMsOffset,
        dateRangePickerOffsets[1].localeMsOffset
      ),
    ]
  }, [dateRangePickerOffsets])

  /**
   * Function to set the left grid month to the previous month when possible.
   */
  const onPrevMonthClickFromLeftGrid = useCallback(() => {
    setLeftGridMonth((prevState) => subtractMonths(prevState, 1))
  }, [setLeftGridMonth])

  /**
   * Function to set the left grid month to the next month when possible.
   */
  const onNextMonthClickFromLeftGrid = useCallback(() => {
    setLeftGridMonth((prevState) => {
      const nextMonth = addMonths(prevState, 1)
      // Ensure the next month is not after the right grid month
      if (nextMonth < rightGridMonth) {
        return nextMonth
      }
      return prevState
    })
  }, [rightGridMonth, setLeftGridMonth])

  /**
   * Function to set the right grid month to the previous month when possible.
   */
  const onPrevMonthClickFromRightGrid = useCallback(() => {
    setRightGridMonth((prevState) => {
      const prevMonth = subtractMonths(prevState, 1)
      if (prevMonth > leftGridMonth) {
        return prevMonth
      }

      return prevState
    })
  }, [leftGridMonth, setRightGridMonth])

  /**
   * Function to set the right grid month to the next month.
   */
  const onNextMonthClickFromRightGrid = useCallback(() => {
    setRightGridMonth((prevState) => addMonths(prevState, 1))
  }, [setRightGridMonth])

  /**
   * Function to select the start date of the date range.
   * On selecting the start date, the end date is set to undefined.
   * Here only the controlled date Range is set,
   * the innerDateRange is updated from the DaysGrid component.
   *
   * @param date - The selected start date in milliseconds with the offset applied
   * @param panelRole - The role of the panel ('left' or 'right')
   */
  const onStartDateChangeHandler = useCallback(
    (date: number) => {
      const newDateRange: DateRange = [
        date - daysGridsMsOffsets[startDateOrigin === 'left' ? 0 : 1], // removing offset
        undefined,
      ]
      // Controlled component: call the onDateRangeChange callback
      if (onDateRangeChange) {
        onDateRangeChange(newDateRange)
      } else {
        setInnerDateRange([date, undefined])
      }
    },
    [daysGridsMsOffsets, onDateRangeChange, setInnerDateRange, startDateOrigin]
  )

  /**
   * Function to select the end date of the date range.
   * Here only the external controlled date Range is set,
   * the innerDateRange is updated from the DaysGrid component.
   *
   * @param date - The selected end date in milliseconds with the offset applied
   * @param panelRole - The role of the panel ('left' or 'right')
   */
  const onEndDateChangeHandler = useCallback(
    (date: number) => {
      if (date === innerDateRange?.[0]) {
        // If the selected date is the same as the start date, do not update
        return
      }
      const newDateRange: DateRange = [
        innerDateRange?.[0]
          ? innerDateRange[0] -
            daysGridsMsOffsets[startDateOrigin === 'left' ? 0 : 1]
          : undefined,
        date - daysGridsMsOffsets[endDateOrigin === 'left' ? 0 : 1],
      ]

      // Controlled component: call the onDateRangeChange callback
      if (onDateRangeChange) {
        onDateRangeChange(newDateRange)
      } else {
        setInnerDateRange([innerDateRange?.[0], date])
      }
    },
    [
      daysGridsMsOffsets,
      endDateOrigin,
      innerDateRange,
      onDateRangeChange,
      setInnerDateRange,
      startDateOrigin,
    ]
  )

  return (
    <div
      className={clsx('DateRangePanel', size, className)}
      data-test="date-range-panel"
    >
      <div className="left-panel" data-test="left-panel">
        <PanelHeader
          size={size}
          nextButtonAriaLabel="Next Month"
          onNextButtonClick={onNextMonthClickFromLeftGrid}
          onPrevButtonClick={onPrevMonthClickFromLeftGrid}
          disableNextButton={addMonths(leftGridMonth, 1) >= rightGridMonth}
          prevButtonAriaLabel="Previous Month"
        >
          <PanelHeaderButton
            aria-label={getMonthNameFromTs(
              leftGridMonth + daysGridsMsOffsets[0],
              locale
            )}
            color={color}
            label={getMonthNameFromTs(leftGridMonth, locale)}
          />
          <PanelHeaderButton
            aria-label={getYearFromTs(leftGridMonth).toString()}
            color={color}
            label={getYearFromTs(leftGridMonth)}
          />
        </PanelHeader>
        <DaysGrid
          date={leftGridMonth}
          size={size}
          onNextMonthKeyPress={onNextMonthClickFromLeftGrid}
          onPrevMonthKeyPress={onPrevMonthClickFromLeftGrid}
          onStartDateChangeHandler={onStartDateChangeHandler}
          onEndDateChangeHandler={onEndDateChangeHandler}
          panelRole="left"
        />
      </div>
      <div className="separator" />
      <div className="right-panel" data-test="right-panel">
        <PanelHeader
          nextButtonAriaLabel="Next Month"
          onNextButtonClick={onNextMonthClickFromRightGrid}
          onPrevButtonClick={onPrevMonthClickFromRightGrid}
          disablePrevButton={subtractMonths(rightGridMonth, 1) <= leftGridMonth}
          prevButtonAriaLabel="Previous Month"
          size={size}
        >
          <PanelHeaderButton
            aria-label={getMonthNameFromTs(rightGridMonth, locale)}
            color={color}
            label={getMonthNameFromTs(rightGridMonth, locale)}
          />
          <PanelHeaderButton
            aria-label={getYearFromTs(rightGridMonth).toString()}
            color={color}
            label={getYearFromTs(rightGridMonth)}
          />
        </PanelHeader>
        <DaysGrid
          date={rightGridMonth}
          onNextMonthKeyPress={onNextMonthClickFromRightGrid}
          onPrevMonthKeyPress={onPrevMonthClickFromRightGrid}
          onStartDateChangeHandler={onStartDateChangeHandler}
          onEndDateChangeHandler={onEndDateChangeHandler}
          panelRole="right"
          size={size}
        />
      </div>
    </div>
  )
}

export default DateRangePanel
