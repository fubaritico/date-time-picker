import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import {
  convertFormattedDateToTimestamp,
  formatTimestampForTextInput,
} from '@utils'

import { DATE_FORMAT } from '../formats'
import AbstractInputMask from '../formats/masks/AbstractInputMask'
import { DateRange, PickerMode } from '../types'

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
    innerDateRange,
    isControlled,
    locale,
    maxDate,
    minDate,
    pickerMode,
    setInnerDateRange,
    dateRangePickerOffsets,
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
  const offset = useMemo(
    () =>
      inputRole === 'start'
        ? dateRangePickerOffsets?.[0]
        : dateRangePickerOffsets?.[1],
    [dateRangePickerOffsets, inputRole]
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
    setInputValue((prevState) => {
      //console.log(inputRole, 'prevState', prevState)
      if (!date) return prevState

      return formatTimestampForTextInput(
        date,
        DATE_FORMAT[locale],
        offset?.msOffset
      )
    })
  }, [date, pickerMode, locale, offset?.msOffset, inputRole])

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
      const rawInputValue = e.currentTarget.value

      // It never happens, just here for correct inference
      const instance = inputMaskInstance ?? (await loadMaskClass())

      // Validate and format the input
      const validatedInputValue =
        (rawInputValue !== '' && instance.validate(rawInputValue)) ||
        rawInputValue

      setInputValue(validatedInputValue)

      // Always attempt to parse, even with potentially invalid input
      const formattedNewInputValue = formatNewInputValue(validatedInputValue)

      // Check if the date is valid and within bounds
      if (formattedNewInputValue) {
        const isAfterMin = !minDate || formattedNewInputValue >= minDate
        const isBeforeMax = !maxDate || formattedNewInputValue <= maxDate
        const newDate = formattedNewInputValue - (offset?.msOffset ?? 0)
        const newStarDate =
          inputRole === 'start'
            ? innerDateRange?.[1] && newDate > innerDateRange[1]
              ? innerDateRange[0]
              : newDate
            : innerDateRange?.[0]
        const newEndDate =
          inputRole === 'end'
            ? innerDateRange?.[0] && newDate < innerDateRange[0]
              ? innerDateRange[1]
              : newDate
            : innerDateRange?.[1]

        const newDateRange: DateRange = [newStarDate, newEndDate]

        setInputValue(() => {
          const newDate = inputRole === 'start' ? newStarDate : newEndDate

          if (!newDate) return undefined

          return formatTimestampForTextInput(newDate, DATE_FORMAT[locale])
        })

        if (isAfterMin && isBeforeMax) {
          setInnerErrors(undefined)

          if (isControlled) {
            onDateChange?.(newDateRange)
          } else {
            setInnerDateRange(newDateRange)
          }
        }
      } else {
        onDateChange?.([innerDateRange?.[0], innerDateRange?.[1]])
      }
    },
    [
      inputMaskInstance,
      loadMaskClass,
      formatNewInputValue,
      minDate,
      maxDate,
      offset?.msOffset,
      inputRole,
      innerDateRange,
      locale,
      isControlled,
      onDateChange,
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
