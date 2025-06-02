import { useEffect, useRef } from 'react'

import useDateRangeInput from '../hooks/useDateRangeInput'
import useDateTimePicker from '../hooks/useDateTimePicker'

import InputWithMask from './InputWithMask'

import type { DateInputProps } from '@types'
import type { ChangeEvent, FC } from 'react'

const DateRangeInput: FC<DateInputProps> = ({
  onDateRangeChange,
  onIconClick,
  ...inputTextProps
}) => {
  // Value as a string formatted for display
  const clickAwayIgnoreRef = useRef<HTMLButtonElement>(null)
  // Shared state from the DateTimePicker context
  const { pickerMode, setIgnoreClickAwayRef } = useDateTimePicker()
  // Input state (left/start)
  const {
    inputValue: startInputValue,
    innerErrors: startInnerErrors,
    handleChange: startHandleChange,
    inputMaskInstance: startInputMaskInstance,
  } = useDateRangeInput({ onDateChange: onDateRangeChange, inputRole: 'start' })
  // Input state (right/end)
  const {
    inputValue: endInputValue,
    innerErrors: endInnerErrors,
    handleChange: endHandleChange,
    inputMaskInstance: endInputMaskInstance,
  } = useDateRangeInput({ onDateChange: onDateRangeChange, inputRole: 'end' })
  // Filtering/Omitting properties conflicting with react-input-mask
  const textInputOnlyProperties = ({
    helperText,
    label,
    labelInfo,
    severity,
    size,
  }: typeof inputTextProps): typeof inputTextProps => ({
    helperText,
    label,
    labelInfo,
    severity,
    size,
  })

  /**
   * Will set the open button to be ignored by the click away component wrapping the panel
   */
  useEffect(() => {
    setIgnoreClickAwayRef(clickAwayIgnoreRef)
  }, [setIgnoreClickAwayRef])

  return (
    <div className="flex gap-2">
      <InputWithMask
        className="font-roboto"
        key="start-input"
        alwaysShowMask
        mask={startInputMaskInstance?.getMask()}
        value={startInputValue ?? ''}
        disabled={inputTextProps.disabled}
        required={inputTextProps.required}
        severity={startInnerErrors ? 'error' : undefined}
        errors={startInnerErrors}
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          await startHandleChange(e)
        }}
        iconRef={clickAwayIgnoreRef}
        onIconClick={onIconClick}
        pickerMode={pickerMode}
        {...textInputOnlyProperties(inputTextProps)}
      />
      <InputWithMask
        className="font-roboto"
        key="end-input"
        alwaysShowMask
        mask={endInputMaskInstance?.getMask()}
        value={endInputValue ?? ''}
        disabled={inputTextProps.disabled}
        required={inputTextProps.required}
        severity={endInnerErrors ? 'error' : undefined}
        errors={endInnerErrors}
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          await endHandleChange(e)
        }}
        pickerMode={pickerMode}
        {...textInputOnlyProperties(inputTextProps)}
      />
    </div>
  )
}

export default DateRangeInput
