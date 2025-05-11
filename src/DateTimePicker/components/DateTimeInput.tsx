import InputMask from '@mona-health/react-input-mask'
import { useCallback, useEffect, useRef, useState } from 'react'

import { TextField } from '../..'
import { useCalendar } from '../DateTimePicker.context'
import { PickerMode } from '../DateTimePicker.types'
import {
  convertFormattedDateToTimestamp,
  formatTimestamp,
  formatTimestampToDate,
} from '../DateTimePicker.utils'
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '../formats'
import AbstractInputMask from '../formats/masks/AbstractInputMask'

import type { DateTimeInputProps } from '../DateTimePicker.types'
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
 * the input element included in this component and the properties passed by react-input-mask,
 * even by forwarding the reference of the input, so far no way has been found to use a custom component
 * with react-input-mask. So the DateTimeInput component will use its own input tag styled like the TextField component.
 *
 * The issue was due to the definition of the onChange native method.
 * React-input-mask takes all native properties and apply their value to the wrapped input/custom component.
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
const DateTimeInput: FC<DateTimeInputProps> = ({
  onDateChange,
  onIconClick,
  errors,
  ...inputTextProps
}) => {
  const {
    outputOffset,
    pickerMode,
    innerDate,
    isControlled,
    locale,
    minDate,
    maxDate,
    setInnerDate,
    setIgnoreClickAwayRef,
  } = useCalendar()

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
        case PickerMode.TIME:
          return formatTimestamp(innerDate, TIME_FORMAT[locale])
        case PickerMode.DATE:
          return formatTimestamp(innerDate, DATE_FORMAT[locale])
        case PickerMode.DATETIME:
          return formatTimestamp(innerDate, DATE_TIME_FORMAT[locale])
        default:
          return undefined
      }
    })
  }, [pickerMode, innerDate, locale, errors])

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
      `../formats/masks/${locale.toUpperCase()}InputMask`
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
   * Reformats the new input value to a unix timestamp.
   * Only when the input value is completed and valid.
   * If the input value is not valid, the function will return false.
   *
   * @param newInputValue
   */
  const formatNewInputValue = useCallback(
    (newInputValue: string): number | false => {
      return (
        !newInputValue.includes('_') &&
        convertFormattedDateToTimestamp(newInputValue)
      )
    },
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

      const instance = inputMaskInstance ?? (await loadMaskClass())

      // Validate and format the input
      const newInputValue =
        (rawInputValue !== '' && instance.validate(rawInputValue)) ||
        rawInputValue

      setInputValue(newInputValue)

      // Always attempt to parse, even with potentially invalid input
      const formattedNewInputValue =
        pickerMode === PickerMode.TIME && !!innerDate
          ? formatNewInputValue(
              formatTimestampToDate(innerDate, locale) + ' ' + newInputValue
            )
          : formatNewInputValue(newInputValue)

      // Check if date is valid and within bounds
      if (
        formattedNewInputValue &&
        typeof formattedNewInputValue === 'number'
      ) {
        const newDate = formattedNewInputValue

        const isAfterMin = !minDate || newDate >= minDate
        const isBeforeMax = !maxDate || newDate <= maxDate

        if (isAfterMin && isBeforeMax) {
          setInnerErrors(undefined)

          if (isControlled) {
            onDateChange?.(newDate - outputOffset)
          } else {
            setInnerDate(newDate)
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
      outputOffset,
      setInnerDate,
    ]
  )

  return (
    <div className="flex flex-col">
      <div className="flex flex-col relative">
        <InputMask
          mask={inputMaskInstance?.getMask()}
          value={inputValue ?? ''}
          disabled={inputTextProps.disabled}
          required={inputTextProps.required}
          severity={innerErrors ? 'error' : undefined}
          errors={innerErrors}
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
            await handleChange(e)
          }}
        >
          {/* Find a way to forward the reference and handle the onChange property properly */}
          <TextField
            className="font-roboto"
            iconAriaLabel="Open calendar panel"
            iconName={
              pickerMode === PickerMode.TIME ? 'HiClock' : 'HiMiniCalendarDays'
            }
            iconRef={clickAwayIgnoreRef}
            onIconClick={onIconClick}
            {...textInputOnlyProperties(inputTextProps)}
          />
        </InputMask>
      </div>
    </div>
  )
}

export default DateTimeInput
