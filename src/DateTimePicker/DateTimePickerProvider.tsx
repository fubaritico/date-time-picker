import { useEffect, useMemo, useState } from 'react'

import { PanelView, PickerMode } from './DateTimePicker.types'
import DateTimePickerContext from './DateTimePickerContext'
import { ISO8601_FORMAT } from './formats'

import type { PickerProviderProps, PickerState } from './DateTimePicker.types'
import type { FC, PropsWithChildren, RefObject } from 'react'

/**
 * Provides simple state with essential data as date, panel mode, calendar mode and date, panel mode setters.
 * The setters are used when component is uncontrolled (for preview).
 *
 * @param calendarMode Defines the behavior of the component (date, date and time, time)
 * @param children Component rendered in the provider scope
 */
const DateTimePickerProvider: FC<PropsWithChildren<PickerProviderProps>> = ({
  children,
  date: p_date, // Data
  inputOffset = 0,
  outputOffset = 0,
  minDate: p_minDate, // Data
  maxDate: p_maxDate, // Data
  isControlled,
  hasLabel,
  locale = 'en_GB',
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
    !p_date && !noDefault ? Date.now() + inputOffset : undefined
  )

  const [panelRect, setPanelRect] = useState<DOMRectReadOnly>(
    new DOMRectReadOnly()
  )

  const [ignoreClickAwayRef, setIgnoreClickAwayRef] = useState<
    RefObject<HTMLButtonElement | null>
  >({ current: null })

  useEffect(() => {
    if (isControlled && p_date) {
      setInnerDate(p_date + inputOffset)
    }
  }, [inputOffset, isControlled, p_date])

  const value = useMemo<PickerState>(() => {
    return {
      ignoreClickAwayRef,
      innerDate,
      isControlled,
      hasLabel,
      locale: innerLocale,
      inputOffset,
      outputOffset,
      panelRect,
      panelView,
      pickerFormat: ISO8601_FORMAT,
      pickerMode: pickerMode,
      minDate: p_minDate ? p_minDate + inputOffset : undefined, // Use updated state for minDate
      maxDate: p_maxDate ? p_maxDate + inputOffset : undefined, // Use
      setIgnoreClickAwayRef,
      setInnerDate,
      setPanelRect,
      setPanelView,
    }
  }, [
    inputOffset,
    outputOffset,
    ignoreClickAwayRef,
    innerDate,
    innerLocale,
    isControlled,
    hasLabel,
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
