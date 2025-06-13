import { useEffect, useMemo, useState } from 'react'

import { addMonths, getFirstInstantOfMonth } from '@utils'

import DateTimePickerContext from './DateRangePanelContext'

import type { DateRangePanelState } from './DateRangePanelContext'
import type { PickerProviderProps } from '../types'
import type { FC, PropsWithChildren } from 'react'

const getMonthNameFromTimestamp = (
  timestamp: number,
  locale = 'en-US'
): string => {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
}

/**
 * Provides simple state with essential data as date, panel mode, calendar mode and date, panel mode setters.
 * The setters are used when the component is uncontrolled (for preview).
 *
 * @param dateRange
 * @param msOffset
 * @param children Component rendered in the provider scope
 */
const DateRangePanelProvider: FC<
  PropsWithChildren<Pick<PickerProviderProps, 'dateRange' | 'msOffset'>>
> = ({ children, msOffset, dateRange = [undefined, undefined] }) => {
  // Date range state for UI: start and end dates being selected
  const [tempStartDate, setTempStartDate] = useState<number>()
  const [tempEndDate, setTempEndDate] = useState<number>()
  const [leftGridMonth, setLeftGridMonth] = useState<number>(() => {
    const currentMonth = Date.now() + msOffset

    if (dateRange[0] && dateRange[1]) {
      return getFirstInstantOfMonth(dateRange[0])
    }

    return getFirstInstantOfMonth(currentMonth)
  })
  const [rightGridMonth, setRightGridMonth] = useState<number>(() => {
    const nextMont = addMonths(Date.now() + msOffset, 1)

    if (dateRange[0] && dateRange[1]) {
      // Months to work with
      const startDateMonth = getMonthNameFromTimestamp(dateRange[0])
      const endDateMonth = getMonthNameFromTimestamp(dateRange[1])

      if (startDateMonth === endDateMonth) {
        return getFirstInstantOfMonth(addMonths(dateRange[0], 1))
      }

      // If the start date is not selected in the current month
      if (startDateMonth !== endDateMonth) {
        return getFirstInstantOfMonth(dateRange[1])
      }
    }

    return getFirstInstantOfMonth(nextMont)
  })

  /**
   * Will reset the local context when the panel unmounts
   */
  useEffect(() => {
    return () => {
      setTempStartDate(undefined)
      setTempEndDate(undefined)
    }
  }, [])

  /**
   * Date range state: temporary state while selecting.
   *
   * Will be true if the first date in the range is selected, it will be reset on temp end date selection.
   */
  const isSelectingRange = useMemo(() => {
    return tempStartDate !== undefined
  }, [tempStartDate])

  /**
   * State of the date range panel, shared by the two day-grid components.
   */
  const state = useMemo<DateRangePanelState>(() => {
    return {
      dateRange,
      isSelectingRange,
      leftGridMonth,
      rightGridMonth,
      setLeftGridMonth,
      setRightGridMonth,
      setTempEndDate,
      setTempStartDate,
      tempEndDate,
      tempStartDate,
    }
  }, [
    dateRange,
    isSelectingRange,
    leftGridMonth,
    rightGridMonth,
    setLeftGridMonth,
    setRightGridMonth,
    setTempEndDate,
    setTempStartDate,
    tempEndDate,
    tempStartDate,
  ])

  return (
    <DateTimePickerContext.Provider value={state}>
      {children}
    </DateTimePickerContext.Provider>
  )
}

export default DateRangePanelProvider
