import { useMemo, useRef, useState } from 'react'

import './Picker.styles.css'

import { PickerMode } from '@enums'
import { getOffsetInMsFromTimezone } from '@components'

import { DateTimePickerProvider } from '../context'

import DateRangeInput from './DateRangeInput'
import DateTimeInput from './DateTimeInput'
import Panel from './Panel'

import type { CommonPickerProps } from '@types'

// Create a function component type that accepts either set of props
const Picker = <T extends PickerMode>({
  date,
  extraIcon,
  enablePortal,
  errors,
  loading,
  locale,
  maxDate,
  minDate,
  pickerMode,
  noDefault = false,
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
   * Will pass the proper time offset from the timezone (in milliseconds)
   */
  const offsets = useMemo(() => {
    const d = new Date(Date.now())
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
  }, [timezone])

  return (
    <DateTimePickerProvider
      date={date}
      isControlled={!!onChange}
      gmtMsOffset={offsets.gmtMsOffset}
      hasLabel={!!textInputProps.label}
      loading={loading}
      locale={locale}
      maxDate={maxDate}
      minDate={minDate}
      noDefault={noDefault}
      msOffset={offsets.msOffset}
      pickerMode={pickerMode}
      dateRange={dateRange}
    >
      <div className="relative">
        <div ref={triggerRef} className="relative">
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
                <>
                  {loading && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-[10px]">
                      <div className="button-loader button-loader-sm border-gray-400/75 border-l-gray-400/25" />
                    </span>
                  )}
                  {extraIcon && (
                    <span className="absolute tw flew items-center justify-center top-1/2 -translate-y-1/2 right-[10px]">
                      {extraIcon}
                    </span>
                  )}
                </>
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
