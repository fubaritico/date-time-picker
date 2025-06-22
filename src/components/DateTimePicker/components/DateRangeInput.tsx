import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ClickAwayListener } from '@components'

import Label from '../../Label'
import useDateRangeInput from '../hooks/useDateRangeInput'
import useDateTimePicker from '../hooks/useDateTimePicker'

import InputWithMask from './InputWithMask'

import type { DateInputProps } from '../types'
import type { ChangeEvent, FC } from 'react'

const DateRangeInput: FC<DateInputProps> = ({
  onDateRangeChange,
  onIconClick,
  ...inputTextProps
}) => {
  // State to manage focus on the input
  const [focus, setFocus] = useState(false)
  // Value as a string formatted for display
  const clickAwayIgnoreRef = useRef<HTMLButtonElement>(null)
  // Shared state from the DateTimePicker context
  const { color, pickerMode, setIgnoreClickAwayRef } = useDateTimePicker()
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
   * On Icon click, calls the passed onIconClick function
   * and set the focus on false for the wrapper div element.
   */
  const handleOnIconClick = useCallback(() => {
    onIconClick?.()
    setFocus(false)
  }, [onIconClick])

  /**
   * Will set the open button to be ignored by the click away component wrapping the panel
   */
  useEffect(() => {
    setIgnoreClickAwayRef(clickAwayIgnoreRef)
  }, [setIgnoreClickAwayRef])

  return (
    <ClickAwayListener
      onClickAway={() => {
        setFocus(false)
      }}
    >
      <div className={clsx('DateRangeInput', color)}>
        {labelOnlyProperties(inputTextProps).label !== '' && (
          <Label
            style={{ marginBottom: '0.5rem' }}
            {...labelOnlyProperties(inputTextProps)}
          />
        )}
        <div data-focus={focus}>
          <InputWithMask
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
            hideFocus
            onFocus={() => {
              setFocus(true)
            }}
            iconRef={clickAwayIgnoreRef}
            onIconClick={handleOnIconClick}
            pickerMode={pickerMode}
            {...textInputOnlyProperties(inputTextProps)}
          />
          <InputWithMask
            key="end-input"
            alwaysShowMask
            hideFocus
            mask={endInputMaskInstance?.getMask()}
            value={endInputValue ?? ''}
            disabled={inputTextProps.disabled}
            required={inputTextProps.required}
            severity={endInnerErrors ? 'error' : undefined}
            errors={endInnerErrors}
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              await endHandleChange(e)
            }}
            onFocus={() => {
              setFocus(true)
            }}
            pickerMode={pickerMode}
            {...textInputOnlyProperties(inputTextProps)}
          />
        </div>
      </div>
    </ClickAwayListener>
  )
}

export default DateRangeInput
