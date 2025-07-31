import { useEffect, useMemo, useState } from 'react'

import { getTimeOffset } from '@utils'

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
  dateRange: p_utcDateRange,
  date: p_utcDate,
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
  dateRangePickerTimeOffsets,
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
    return getTimeOffset(timezoneMsOffset, localeMsOffset)
  }, [localeMsOffset, timezoneMsOffset])

  // DATE_TIME_FORMAT also includes time to be extracted
  const [localeDate, setLocaleDate] = useState<number | undefined>(() => {
    if (!p_utcDate && !noDefaultDate) {
      return Date.now()
    }

    if (p_utcDate && !noDefaultDate) {
      return p_utcDate + finalOffset
    }

    return undefined
  })

  // DATE_RANGE_FORMAT
  const [localeDateRange, setLocaleDateRange] = useState<DateRange>(
    p_utcDateRange
      ? [
          p_utcDateRange[0]
            ? p_utcDateRange[0] +
              getTimeOffset(
                dateRangePickerTimeOffsets[0].timezoneMsOffset,
                dateRangePickerTimeOffsets[0].localeMsOffset
              )
            : undefined,
          p_utcDateRange[1]
            ? p_utcDateRange[1] +
              getTimeOffset(
                dateRangePickerTimeOffsets[1].timezoneMsOffset,
                dateRangePickerTimeOffsets[1].localeMsOffset
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

  const start = p_utcDateRange?.[0]
  const end = p_utcDateRange?.[1]

  useEffect(() => {
    if (p_utcDate) {
      setLocaleDate(p_utcDate + finalOffset)
    }

    if (p_utcDateRange) {
      setLocaleDateRange([
        start
          ? start +
            getTimeOffset(
              dateRangePickerTimeOffsets[0].timezoneMsOffset,
              dateRangePickerTimeOffsets[0].localeMsOffset
            )
          : undefined,
        end
          ? end +
            getTimeOffset(
              dateRangePickerTimeOffsets[1].timezoneMsOffset,
              dateRangePickerTimeOffsets[1].localeMsOffset
            )
          : undefined,
      ])
    }
  }, [
    timezoneMsOffset,
    p_utcDate,
    start,
    end,
    dateRangePickerTimeOffsets,
    finalOffset,
    p_utcDateRange,
  ])

  const value = useMemo<PickerState>(() => {
    return {
      color,
      dateRangePickerTimeOffsets,
      finalOffset,
      hasLabel,
      ignoreClickAwayRef,
      localeDate,
      localeDateRange,
      isControlled,
      locale: innerLocale,
      maxDate: p_maxDate ? p_maxDate + finalOffset : undefined,
      minDate: p_minDate ? p_minDate + finalOffset : undefined,
      open,
      panelRect,
      panelView,
      pickerMode,
      setIgnoreClickAwayRef,
      setLocaleDate,
      setLocaleDateRange,
      setPanelRect,
      setPanelView,
      timezone,
    }
  }, [
    color,
    dateRangePickerTimeOffsets,
    finalOffset,
    hasLabel,
    ignoreClickAwayRef,
    localeDate,
    localeDateRange,
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
