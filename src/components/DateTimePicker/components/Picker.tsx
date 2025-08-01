import { useMemo, useRef, useState } from 'react'

import { getLocaleAndTzTimeOffsets } from '../../../utils'
import { DateTimePickerProvider } from '../context'

import DateRangeInput from './DateRangeInput'
import DateTimeInput from './DateTimeInput'
import Panel from './Panel'

import type { CommonPickerProps, PickerMode } from '../types'

// Create a function component type that accepts either set of props
const Picker = <T extends PickerMode>({
  color,
  date,
  dateRange,
  enablePortal,
  errors,
  loading,
  locale,
  maxDate,
  minDate,
  noDefaultDate = false,
  onChange,
  onDateRangeChange,
  placement = 'bottom-start',
  pickerMode,
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
   * Passes pass the proper time timezone offset based on the timezone (in milliseconds).
   * It will adapt the offset only if the Picker is controlled.
   */
  const datePickerOffsets = useMemo(
    () => getLocaleAndTzTimeOffsets(date, timezone),
    [date, timezone]
  )

  /**
   * Passes the proper time timezone offsets for both panels based on the timezone (in milliseconds).
   * It will adapt the offsets only if the Picker is controlled.
   */
  const dateRangePickerTimeOffsets = useMemo(() => {
    return [
      getLocaleAndTzTimeOffsets(dateRange?.[0], timezone),
      getLocaleAndTzTimeOffsets(dateRange?.[1], timezone),
    ]
  }, [dateRange, timezone])

  return (
    <DateTimePickerProvider
      color={color}
      date={date}
      dateRange={dateRange}
      dateRangePickerTimeOffsets={dateRangePickerTimeOffsets}
      localeMsOffset={datePickerOffsets.localeMsOffset}
      hasLabel={!!textInputProps.label}
      isControlled={!!onChange || !!onDateRangeChange}
      loading={loading}
      locale={locale}
      maxDate={maxDate}
      minDate={minDate}
      timezoneMsOffset={datePickerOffsets.timezoneMsOffset}
      noDefaultDate={noDefaultDate}
      open={isOpen}
      pickerMode={pickerMode}
      timezone={timezone}
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
