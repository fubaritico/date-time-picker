import { useEffect, useMemo, useState } from 'react'

import { getActualOffset } from '@utils'

import { PanelView } from '../types'

import DateTimePickerContext from './DateTimePickerContext'

import type { DateRange, PickerProviderProps, PickerState } from '../types'
import type { FC, PropsWithChildren, RefObject } from 'react'

/**
 * Provides simple state with essential data as date, panel mode, calendar mode and date, panel mode setters.
 * The setters are used when the component is uncontrolled (for preview).
 *
 * @param calendarMode Defines the behavior of the component (date, date and time, time)
 * @param children Component rendered in the provider scope
 */
const DateTimePickerProvider: FC<PropsWithChildren<PickerProviderProps>> = ({
  children,
  color = 'blue',
  dateRange: p_dateRange,
  date: p_date,
  timezoneMsOffset = 0,
  localeMsOffset = 0,
  minDate: p_minDate,
  maxDate: p_maxDate,
  isControlled,
  hasLabel,
  locale = 'en_US',
  noDefaultDate,
  open,
  pickerMode = 'DATE',
  dateRangePickerOffsets,
  timezone,
}) => {
  const [panelView, setPanelView] = useState(
    pickerMode === 'TIME' ? PanelView.TIME : PanelView.DAYS
  )

  const innerLocale = useMemo(() => {
    if (locale.startsWith('fr')) return 'fr'
    if (!locale.startsWith('en')) return 'en'
    return 'en'
  }, [locale])

  /**
   * Gets the actual offset combining the local offset and the GMT offset.
   */
  const finalOffset = useMemo(() => {
    return getActualOffset(timezoneMsOffset, localeMsOffset)
  }, [localeMsOffset, timezoneMsOffset])

  // DATE_TIME_FORMAT also includes time to be extracted
  const [innerDate, setInnerDate] = useState<number | undefined>(() => {
    if (!p_date && !noDefaultDate) {
      return Date.now() + finalOffset
    }

    if (p_date && !noDefaultDate) {
      return p_date + finalOffset
    }

    return undefined
  })

  // DATE_RANGE_FORMAT
  const [innerDateRange, setInnerDateRange] = useState<DateRange>(
    p_dateRange
      ? [
          p_dateRange[0]
            ? p_dateRange[0] +
              getActualOffset(
                dateRangePickerOffsets[0].timezoneMsOffset,
                dateRangePickerOffsets[0].localeMsOffset
              )
            : undefined,
          p_dateRange[1]
            ? p_dateRange[1] +
              getActualOffset(
                dateRangePickerOffsets[1].timezoneMsOffset,
                dateRangePickerOffsets[1].localeMsOffset
              )
            : undefined,
        ]
      : [undefined, undefined]
  )

  const [panelRect, setPanelRect] = useState<DOMRectReadOnly>(
    new DOMRectReadOnly()
  )

  const [ignoreClickAwayRef, setIgnoreClickAwayRef] = useState<
    RefObject<HTMLButtonElement | null>
  >({ current: null })

  useEffect(() => {
    if (isControlled && p_date) {
      setInnerDate(p_date + finalOffset)
    }

    if (isControlled && p_dateRange) {
      setInnerDateRange([
        p_dateRange[0]
          ? p_dateRange[0] +
            getActualOffset(
              dateRangePickerOffsets[0].timezoneMsOffset,
              dateRangePickerOffsets[0].localeMsOffset
            )
          : undefined,
        p_dateRange[1]
          ? p_dateRange[1] +
            getActualOffset(
              dateRangePickerOffsets[1].timezoneMsOffset,
              dateRangePickerOffsets[1].localeMsOffset
            )
          : undefined,
      ])
    }
  }, [
    timezoneMsOffset,
    isControlled,
    p_date,
    p_dateRange,
    dateRangePickerOffsets,
    finalOffset,
  ])

  const value = useMemo<PickerState>(() => {
    return {
      color,
      dateRangePickerOffsets,
      finalOffset,
      hasLabel,
      ignoreClickAwayRef,
      innerDate,
      innerDateRange,
      isControlled,
      locale: innerLocale,
      maxDate: p_maxDate ? p_maxDate + finalOffset : undefined,
      minDate: p_minDate ? p_minDate + finalOffset : undefined,
      open,
      panelRect,
      panelView,
      pickerMode,
      setIgnoreClickAwayRef,
      setInnerDate,
      setInnerDateRange,
      setPanelRect,
      setPanelView,
      timezone,
    }
  }, [
    color,
    dateRangePickerOffsets,
    finalOffset,
    hasLabel,
    ignoreClickAwayRef,
    innerDate,
    innerDateRange,
    isControlled,
    innerLocale,
    p_maxDate,
    p_minDate,
    open,
    panelRect,
    panelView,
    pickerMode,
    timezone,
  ])

  return (
    <DateTimePickerContext.Provider value={value}>
      {children}
    </DateTimePickerContext.Provider>
  )
}

export default DateTimePickerProvider
