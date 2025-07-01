import { useEffect, useMemo, useState } from 'react'

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
  msOffset = 0,
  gmtMsOffset = 0,
  minDate: p_minDate,
  maxDate: p_maxDate,
  isControlled,
  hasLabel,
  locale = 'en_US',
  noDefaultDate,
  open,
  pickerMode = 'DATE',
}) => {
  const [panelView, setPanelView] = useState(
    pickerMode === 'TIME' ? PanelView.TIME : PanelView.DAYS
  )

  const innerLocale = useMemo(() => {
    if (locale.startsWith('fr')) return 'fr'
    if (!locale.startsWith('en')) return 'en'
    return 'en'
  }, [locale])

  // DATE_TIME_FORMAT also includes time to be extracted
  const [innerDate, setInnerDate] = useState<number | undefined>(() => {
    if (!p_date && !noDefaultDate) {
      return Date.now() + msOffset
    }

    if (p_date && !noDefaultDate) {
      return p_date + msOffset
    }

    return undefined
  })

  // DATE_RANGE_FORMAT
  const [innerDateRange, setInnerDateRange] = useState<DateRange>(
    p_dateRange ?? [undefined, undefined]
  )

  const [panelRect, setPanelRect] = useState<DOMRectReadOnly>(
    new DOMRectReadOnly()
  )

  const [ignoreClickAwayRef, setIgnoreClickAwayRef] = useState<
    RefObject<HTMLButtonElement | null>
  >({ current: null })

  useEffect(() => {
    if (isControlled && p_date) {
      setInnerDate(p_date + msOffset)
    }

    if (isControlled && p_dateRange) {
      setInnerDateRange(p_dateRange.map((i) => (i ? i + msOffset : undefined)))
    }
  }, [msOffset, isControlled, p_date, p_dateRange])

  const value = useMemo<PickerState>(() => {
    return {
      color,
      gmtMsOffset,
      hasLabel,
      ignoreClickAwayRef,
      innerDate,
      innerDateRange,
      isControlled,
      locale: innerLocale,
      maxDate: p_maxDate ? p_maxDate + msOffset : undefined,
      minDate: p_minDate ? p_minDate + msOffset : undefined,
      msOffset,
      open,
      panelRect,
      panelView,
      pickerMode,
      setIgnoreClickAwayRef,
      setInnerDate,
      setInnerDateRange,
      setPanelRect,
      setPanelView,
    }
  }, [
    color,
    gmtMsOffset,
    hasLabel,
    ignoreClickAwayRef,
    innerDate,
    innerDateRange,
    innerLocale,
    isControlled,
    msOffset,
    open,
    panelRect,
    panelView,
    pickerMode,
    p_minDate,
    p_maxDate,
  ])

  return (
    <DateTimePickerContext.Provider value={value}>
      {children}
    </DateTimePickerContext.Provider>
  )
}

export default DateTimePickerProvider
