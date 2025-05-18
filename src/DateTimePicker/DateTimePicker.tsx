import { useMemo, useRef, useState } from 'react'

import './styles.css'

import DateTimeInput from './components/DateTimeInput'
import Panel from './components/Panel'
import { DateTimePickerProvider } from './context'
import { getOffsetInMsFromTimezone } from './DateTimePicker.utils'

import type { DateTimePickerProps } from '@types'
import type { FC } from 'react'

// SPECS
// -----------------------------------------------------------------------------
// [X] 1. a component panel to contain either date or time
// [X]  1a. Click away to hide the panel
// [X]  1b. Have the choice between date & time when date picker mode
// [X] 2. a component to display days in a month
// [X]  2a. a component for going backward/forward (months)
// [X]  2b. draw a seven-column grid based on week
// [ ]  2c. keep the necessary days for previous and next month
// [X]  2d. get the first month day, the week day of the first month day for the previous current and next month
// [X] 3. assign click event for days of the currently selected month of the currently selected year
// [X] 4. a component to display and edit datetime value (use an input mask) - missing time panel alone
// [X] 5. an onChange handler to emit the value
// [X] 6. have the component being controlled (display the value properly if passed)
// [X]  6a. have some locale labels and input masks (FR, EN)
// [X]  6b. type a masked value and populate state and children components
// [X] 7. Fill in the masked input when selecting values with the children components
// [X]  7a. validate and correct user input while typing (years, months, days according to months)
// [X] 8. Manage panel placement according to the position of the input field in the viewport
// [ ] 9. Add range selection for date

const DateTimePicker: FC<DateTimePickerProps> = ({
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
}) => {
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

export default DateTimePicker
