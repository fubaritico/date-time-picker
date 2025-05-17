import { useEffect, useMemo, useState } from 'react'

import { PanelView, PickerMode } from './DateTimePicker.types'
import DateTimePickerContext from './DateTimePickerContext'
import { ISO8601_FORMAT } from './formats'

import type { PickerProviderProps, PickerState } from './DateTimePicker.types'
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
  date: p_date, // Data
  msOffset = 0,
  gmtMsOffset = 0,
  minDate: p_minDate, // Data
  maxDate: p_maxDate, // Data
  isControlled,
  hasLabel,
  locale = 'en_US',
  noDefault,
  pickerMode = PickerMode.DATE,
}) => {
  const [panelView, setPanelView] = useState(
    pickerMode === PickerMode.TIME ? PanelView.TIME : PanelView.DAYS
  )

  const innerLocale = useMemo(() => {
    if (locale.startsWith('fr')) return 'fr'
    if (!locale.startsWith('en')) return 'en'
    return 'en'
  }, [locale])

  // DATE_TIME_FORMAT also includes time to be extracted
  const [innerDate, setInnerDate] = useState<number | undefined>(
    !p_date && !noDefault ? Date.now() + msOffset : undefined
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
  }, [msOffset, isControlled, p_date])

  const value = useMemo<PickerState>(() => {
    return {
      gmtMsOffset,
      hasLabel,
      ignoreClickAwayRef,
      innerDate,
      isControlled,
      locale: innerLocale,
      maxDate: p_maxDate ? p_maxDate + msOffset : undefined,
      minDate: p_minDate ? p_minDate + msOffset : undefined,
      msOffset,
      panelRect,
      panelView,
      pickerFormat: ISO8601_FORMAT,
      pickerMode: pickerMode,
      setIgnoreClickAwayRef,
      setInnerDate,
      setPanelRect,
      setPanelView,
    }
  }, [
    gmtMsOffset,
    hasLabel,
    ignoreClickAwayRef,
    innerDate,
    innerLocale,
    isControlled,
    msOffset,
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
