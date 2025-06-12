import { useEffect, useRef } from 'react'

import Label from '../../Label'
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
    disabled,
    helperText,
    severity,
    size,
  }: typeof inputTextProps): typeof inputTextProps => ({
    disabled,
    helperText,
    severity,
    size,
  })
  // Extracting props for the label and make the label mandatory
  const labelOnlyProperties = ({
    disabled,
    label,
    labelInfo,
    required,
    size,
  }: typeof inputTextProps): Omit<typeof inputTextProps, 'label'> & {
    label: string
  } => ({
    disabled,
    label: label ?? '',
    labelInfo,
    required,
    size,
  })

  /**
   * Will set the open button to be ignored by the click away component wrapping the panel
   */
  useEffect(() => {
    setIgnoreClickAwayRef(clickAwayIgnoreRef)
  }, [setIgnoreClickAwayRef])

  return (
    <div className="dp-flex dp-flex-col dp-w-full">
      {labelOnlyProperties(inputTextProps).label !== '' && (
        <Label className="dp-mb-1" {...labelOnlyProperties(inputTextProps)} />
      )}
      <div className="dp-flex dp-rounded-md dp-border dp-border-gray-300 dark:dp-border-gray-600">
        <InputWithMask
          className="dp-font-roboto dp-border-0 dp-rounded-r-none dp-border-r dp-border-r-gray-200 dp-bordder-r-dotter"
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
          className="dp-font-roboto dp-border-0 dp-rounded-l-none"
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
          withPanel={false}
          {...textInputOnlyProperties(inputTextProps)}
        />
      </div>
    </div>
  )
}

export default DateRangeInput
