import { useCallback, useEffect, useRef, useState } from 'react'

import {
  convertFormattedDateToTimestamp,
  formatTimestampForTextInput,
  formatTimestampToDate,
} from '@utils'

import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '../formats'
import AbstractInputMask from '../formats/masks/AbstractInputMask'
import useDateTimePicker from '../hooks/useDateTimePicker'

import InputWithMask from './InputWithMask'

import type { DateInputProps, PickerMode } from '../types'
import type { ChangeEvent, FC } from 'react'

interface MaskClassType {
  default: new (
    date: number | undefined,
    mode: PickerMode | undefined
  ) => AbstractInputMask
}
/**
 * IMPORTANT:
 * ----------
 * The TextField component can't be used by react-input-mask because there's an incompatibility between an input element,
 * the input element included in this component, and the properties passed by react-input-mask,
 * even by forwarding the reference of the input. So far no way has been found to use a custom component
 * with react-input-mask. So the DateTimeInput component will use its own input tag styled like the TextField component.
 *
 * The issue was due to the definition of the onChange native method.
 * React-input-mask takes all native properties and applies their value to the wrapped input/custom component.
 * The custom component doesn't override any native property.
 * The custom component has to forward a ref of the input tag to see its native values to be reapplied.
 *
 * @see: https://github.com/sanniassin/react-input-mask/tree/v2
 *
 * USE:
 * ---
 * Depends on the date variable stored in the context, has its own state allowing to control the masked input.
 * The regular expression are here to prevent any invalid input. But, for reliability purposes, the input is checked
 * again and corrected if needed. then it's reformated to be stored in the context.
 *
 */
const DateTimeInput: FC<DateInputProps> = ({
  onDateChange,
  onIconClick,
  errors,
  ...inputTextProps
}) => {
  const {
    color,
    gmtMsOffset,
    innerDate,
    isControlled,
    locale,
    maxDate,
    minDate,
    msOffset,
    pickerMode,
    setInnerDate,
    setIgnoreClickAwayRef,
  } = useDateTimePicker()

  // Value as a string formatted for display
  const [inputValue, setInputValue] = useState<string | undefined>()
  const [innerErrors, setInnerErrors] = useState<string[]>()
  const clickAwayIgnoreRef = useRef<HTMLButtonElement>(null)
  const [inputMaskInstance, setInputMaskInstance] =
    useState<AbstractInputMask | null>(null)

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
   * Set the input value to the date when the date is updated.
   */
  useEffect(() => {
    setInputValue(() => {
      if (!innerDate) return undefined

      if (!errors) setInnerErrors(undefined)

      switch (pickerMode) {
        case 'TIME':
          return formatTimestampForTextInput(
            innerDate,
            TIME_FORMAT[locale],
            gmtMsOffset
          )
        case 'DATE':
          return formatTimestampForTextInput(
            innerDate,
            DATE_FORMAT[locale],
            gmtMsOffset
          )
        case 'DATETIME':
          return formatTimestampForTextInput(
            innerDate,
            DATE_TIME_FORMAT[locale],
            gmtMsOffset
          )
        default:
          return undefined
      }
    })
  }, [pickerMode, innerDate, locale, errors, gmtMsOffset])

  /**
   * Set the input errors when anything from upper components happens
   */
  useEffect(() => {
    setInnerErrors(errors)
  }, [errors])

  /**
   * Will set the open button to be ignored by the click away component wrapping the panel
   */
  useEffect(() => {
    setIgnoreClickAwayRef(clickAwayIgnoreRef)
  }, [setIgnoreClickAwayRef])

  /**
   * Dynamically import the appropriate mask class based on the locale.
   */
  const loadMaskClass = useCallback(async () => {
    const maskClass = (await import(
      /* @vite-ignore */
      `../formats/masks/${locale.toUpperCase()}InputMask.ts`
    )) as MaskClassType

    return new maskClass.default(innerDate, pickerMode)
  }, [innerDate, locale, pickerMode])

  /**
   * Will dynamically import the appropriate mask class based on the locale on init
   */
  useEffect(() => {
    loadMaskClass()
      .then((instance) => {
        setInputMaskInstance(instance)
      })
      .catch((error: unknown) => {
        const errorMessage = error as Error
        console.error('Failed to load mask class:', errorMessage.message)
      })
  }, [loadMaskClass])

  /**
   * Reformats the new input value to an unix timestamp.
   * Only when the input value is completed and valid.
   * If the input value is not valid, the function will return false.
   *
   * @param newInputValue
   */
  const formatNewInputValue = useCallback(
    (newInputValue: string): number | undefined =>
      !newInputValue.includes('_')
        ? convertFormattedDateToTimestamp(newInputValue)
        : undefined,
    []
  )

  /**
   * Handles the input change event (performed on the InputMask component).
   *
   * @param e
   */
  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const rawInputValue = e.target.value

      // It never happens, just here for correct inference
      const instance = inputMaskInstance ?? (await loadMaskClass())

      // Validate and format the input
      const validatedInputValue =
        (rawInputValue !== '' && instance.validate(rawInputValue)) ||
        rawInputValue

      setInputValue(validatedInputValue)

      // Always attempt to parse, even with potentially invalid input
      const formattedNewInputValue =
        pickerMode === 'TIME' && !!innerDate
          ? formatNewInputValue(
              formatTimestampToDate(innerDate, locale) +
                ' ' +
                validatedInputValue
            )
          : formatNewInputValue(validatedInputValue)

      // Check if the date is valid and within bounds
      if (formattedNewInputValue) {
        const isAfterMin = !minDate || formattedNewInputValue >= minDate
        const isBeforeMax = !maxDate || formattedNewInputValue <= maxDate

        if (isAfterMin && isBeforeMax) {
          setInnerErrors(undefined)

          if (isControlled) {
            onDateChange?.(formattedNewInputValue - msOffset)
          } else {
            setInnerDate(formattedNewInputValue)
          }
        } else {
          setInnerErrors(['Selected date is out of bounds.'])
          onDateChange?.(undefined)
        }
      } else {
        // Explicitly handle invalid input
        onDateChange?.(undefined)
      }
    },
    [
      inputMaskInstance,
      loadMaskClass,
      pickerMode,
      formatNewInputValue,
      innerDate,
      locale,
      minDate,
      maxDate,
      isControlled,
      onDateChange,
      msOffset,
      setInnerDate,
    ]
  )

  return (
    <InputWithMask
      alwaysShowMask
      className="dp-font-roboto"
      color={color}
      mask={inputMaskInstance?.getMask()}
      value={inputValue ?? ''}
      disabled={inputTextProps.disabled}
      required={inputTextProps.required}
      severity={innerErrors ? 'error' : undefined}
      errors={innerErrors}
      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
        await handleChange(e)
      }}
      iconRef={clickAwayIgnoreRef}
      onIconClick={onIconClick}
      pickerMode={pickerMode}
      {...textInputOnlyProperties(inputTextProps)}
    />
  )
}

export default DateTimeInput
