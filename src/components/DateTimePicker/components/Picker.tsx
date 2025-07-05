import { useMemo, useRef, useState } from 'react'

import { getOffsetInMsFromTimezone } from '@utils'

import { DateTimePickerProvider } from '../context'

import DateRangeInput from './DateRangeInput'
import DateTimeInput from './DateTimeInput'
import Panel from './Panel'

import type { CommonPickerProps, PickerMode } from '../types'

// Create a function component type that accepts either set of props
const Picker = <T extends PickerMode>({
  color,
  date,
  enablePortal,
  errors,
  loading,
  locale,
  maxDate,
  minDate,
  pickerMode,
  noDefaultDate = false,
  onChange,
  onDateRangeChange,
  placement = 'bottom-start',
  dateRange,
  size = 'md',
  timezone,
  ...textInputProps
}: CommonPickerProps<T>) => {
  if (pickerMode === 'DATERANGE') {
    if (date || onChange) {
      throw Error(
        '"date" and "onChange" should be used with date, time or datetime component'
      )
    }
  } else {
    if (dateRange || onDateRangeChange) {
      throw Error(
        '"dateRange" and "onDateRangeChange" should be used with date range component only'
      )
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  /**
   * Function to handle toggling the visibility of the panel.
   *
   * @returns {void}
   */
  const handleTogglePanelVisibility = (): void => {
    setIsOpen(!isOpen)
  }

  /**
   * Function to close the panel.
   */
  const closePanel = (): void => {
    setIsOpen(false)
  }

  /**
   * Will pass the proper time msOffset from the timezone (in milliseconds)
   */
  const offsets = useMemo(() => {
    const d = new Date(date ?? Date.now())
    const utc = new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
        d.getUTCSeconds(),
        d.getUTCMilliseconds()
      )
    )

    return {
      gmtMsOffset: getOffsetInMsFromTimezone(utc),
      msOffset: getOffsetInMsFromTimezone(utc, timezone),
    }
  }, [timezone, date])

  return (
    <DateTimePickerProvider
      color={color}
      date={date}
      isControlled={!!onChange || !!onDateRangeChange}
      gmtMsOffset={offsets.gmtMsOffset}
      hasLabel={!!textInputProps.label}
      loading={loading}
      locale={locale}
      maxDate={maxDate}
      minDate={minDate}
      noDefaultDate={noDefaultDate}
      open={isOpen}
      msOffset={offsets.msOffset}
      pickerMode={pickerMode}
      dateRange={dateRange}
    >
      <div style={{ position: 'relative' }}>
        <div ref={triggerRef} style={{ position: 'relative' }}>
          {pickerMode === 'DATERANGE' ? (
            <DateRangeInput
              onDateRangeChange={onDateRangeChange}
              onIconClick={handleTogglePanelVisibility}
              size={size}
              errors={errors}
              timezone={timezone}
              {...textInputProps}
            />
          ) : (
            <DateTimeInput
              onDateChange={onChange}
              onIconClick={handleTogglePanelVisibility}
              size={size}
              errors={errors}
              timezone={timezone}
              {...textInputProps}
              stateIcon={
                loading ? (
                  <span className="spinner-container">
                    <div className="spinner" />
                  </span>
                ) : undefined
              }
            />
          )}
        </div>
        <Panel
          enablePortal={enablePortal}
          onChange={onChange}
          onDateRangeChange={onDateRangeChange}
          loading={loading}
          open={isOpen}
          onClickOutside={closePanel}
          onClose={closePanel}
          placement={placement}
          size={size}
          triggerRef={triggerRef}
        />
      </div>
    </DateTimePickerProvider>
  )
}

export default Picker
