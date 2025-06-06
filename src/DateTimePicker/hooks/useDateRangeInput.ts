import { DateRange } from '@types'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { PickerMode } from '@enums'
import { DATE_FORMAT } from '@components'

import {
  convertFormattedDateToTimestamp,
  formatTimestampForTextInput,
  formatTimestampToDate,
} from '../DateTimePicker.utils'
import AbstractInputMask from '../formats/masks/AbstractInputMask'

import useDateTimePicker from './useDateTimePicker'

interface MaskClassType {
  default: new (
    date: number | undefined,
    mode: PickerMode | undefined
  ) => AbstractInputMask
}

interface DateRangeInputHookOptions {
  /* Handler to emit the new date range when controlled */
  onDateChange?: (date: DateRange) => void
  /* The role of the input whose logic is attached to */
  inputRole?: 'start' | 'end'
}

export default function useDateRangeInput({
  inputRole,
  onDateChange,
}: DateRangeInputHookOptions) {
  const {
    gmtMsOffset,
    innerDateRange,
    isControlled,
    locale,
    maxDate,
    minDate,
    msOffset,
    pickerMode,
    setInnerDateRange,
  } = useDateTimePicker()
  // INPUT STATE
  const [inputMaskInstance, setInputMaskInstance] =
    useState<AbstractInputMask | null>(null)
  const [inputValue, setInputValue] = useState<string | undefined>('')
  const [innerErrors, setInnerErrors] = useState<string[]>()
  // DERIVED STATE TO EXTRACT THE RIGHT DATE FROM THE RANGE
  const date = useMemo(
    () => (inputRole === 'start' ? innerDateRange?.[0] : innerDateRange?.[1]),
    [innerDateRange, inputRole]
  )

  /**
   * Dynamically import the appropriate mask class based on the locale.
   */
  const loadMaskClass = useCallback(async () => {
    const maskClass = (await import(
      /* @vite-ignore */
      `../formats/masks/${locale.toUpperCase()}InputMask.ts`
    )) as MaskClassType

    return new maskClass.default(date, pickerMode)
  }, [date, locale, pickerMode])

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
   * Set the input value to the date when the date is updated.
   */
  useEffect(() => {
    setInputValue(() => {
      if (!date) return undefined

      return formatTimestampForTextInput(date, DATE_FORMAT[locale], gmtMsOffset)
    })
  }, [date, pickerMode, locale, msOffset, gmtMsOffset])

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
        pickerMode === 'TIME' && !!date
          ? formatNewInputValue(
              formatTimestampToDate(date, locale) + ' ' + validatedInputValue
            )
          : formatNewInputValue(validatedInputValue)

      // Check if the date is valid and within bounds
      if (formattedNewInputValue) {
        const isAfterMin = !minDate || formattedNewInputValue >= minDate
        const isBeforeMax = !maxDate || formattedNewInputValue <= maxDate

        if (isAfterMin && isBeforeMax) {
          setInnerErrors(undefined)

          if (isControlled) {
            onDateChange?.(
              inputRole === 'start'
                ? [formattedNewInputValue - msOffset, innerDateRange?.[1]]
                : [innerDateRange?.[0], formattedNewInputValue - msOffset]
            )
          } else {
            setInnerDateRange(
              inputRole === 'start'
                ? [formattedNewInputValue - msOffset, innerDateRange?.[1]]
                : [innerDateRange?.[0], formattedNewInputValue - msOffset]
            )
          }
        } else {
          setInnerErrors(['Selected date is out of bounds.'])
          onDateChange?.(
            inputRole === 'start'
              ? [undefined, innerDateRange?.[1]]
              : [innerDateRange?.[0], undefined]
          )
        }
      } else {
        // Explicitly handle invalid input
        onDateChange?.(
          inputRole === 'start'
            ? [undefined, innerDateRange?.[1]]
            : [innerDateRange?.[0], undefined]
        )
      }
    },
    [
      innerDateRange,
      inputMaskInstance,
      inputRole,
      loadMaskClass,
      pickerMode,
      formatNewInputValue,
      date,
      locale,
      minDate,
      maxDate,
      isControlled,
      onDateChange,
      msOffset,
      setInnerDateRange,
    ]
  )

  return {
    inputValue,
    innerErrors,
    handleChange,
    inputMaskInstance,
  }
}
