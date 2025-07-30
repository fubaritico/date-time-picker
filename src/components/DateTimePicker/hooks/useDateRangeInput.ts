import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import {
  convertFormattedDateToTimestamp,
  formatTimestampForTextInput,
  getMillisecondsSinceMidnight,
  getTimeOffset,
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
    localeDateRange,
    isControlled,
    locale,
    maxDate,
    minDate,
    pickerMode,
    setLocaleDateRange,
    dateRangePickerTimeOffsets,
  } = useDateTimePicker()
  // INPUT STATE
  const [inputMaskInstance, setInputMaskInstance] =
    useState<AbstractInputMask | null>(null)
  const [inputValue, setInputValue] = useState<string | undefined>('')
  const [innerErrors, setInnerErrors] = useState<string[]>()
  // DERIVED STATE TO EXTRACT THE RIGHT DATE FROM THE RANGE
  const date = useMemo(
    () => (inputRole === 'start' ? localeDateRange?.[0] : localeDateRange?.[1]),
    [localeDateRange, inputRole]
  )

  /**
   * Gets the right set of offset according to the month date
   */
  const offset = useMemo(
    () =>
      inputRole === 'start'
        ? dateRangePickerTimeOffsets[0]
        : dateRangePickerTimeOffsets[1],
    [dateRangePickerTimeOffsets, inputRole]
  )

  /**
   * Gets the actual offset combining the local offset and the GMT offset.
   */
  const dateMsOffset = useMemo(() => {
    return getTimeOffset(offset.timezoneMsOffset, offset.localeMsOffset)
  }, [offset.localeMsOffset, offset.timezoneMsOffset])

  /**
   * Calculates the milliseconds since midnight for the given date.
   * This will be added to the typed date once it's valid to get the correct timestamp.
   */
  const millisecondsSinceMidnight = useMemo(() => {
    const localeNow = Date.now() + dateMsOffset
    return date
      ? getMillisecondsSinceMidnight(date)
      : getMillisecondsSinceMidnight(localeNow) // no offset because it's supposed to be the locale time in this very case
  }, [date, dateMsOffset])

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
      return date ? formatTimestampForTextInput(date, DATE_FORMAT[locale]) : ''
    })
  }, [date, locale])

  /**
   * Reformats the new input value to an unix timestamp.
   * Only when the input value is completed and valid.
   * If the input value is not valid, the function will return false.
   *
   * @param newInputValue
   */
  const toTimestamp = useCallback(
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
      const timestampValue = toTimestamp(validatedInputValue)

      // Check if the date is valid and within bounds
      if (timestampValue) {
        const timestampValueWithTime =
          timestampValue + millisecondsSinceMidnight
        const isAfterMin = !minDate || timestampValueWithTime >= minDate
        const isBeforeMax = !maxDate || timestampValueWithTime <= maxDate
        // no offset if not controlled, the value is received from the inner values
        const msOffset = isControlled ? dateMsOffset : 0
        const newDate = timestampValueWithTime - msOffset

        // Preparing the new start date to be emitted, also re-adapt the end date to get the correct time offset
        const newStarDate = (() => {
          if (localeDateRange?.[0] && newDate === localeDateRange[0] - msOffset)
            return localeDateRange[0] - msOffset
          if (inputRole === 'start') {
            // If the input is 'start', we need to ensure the end date is not before the start date
            return localeDateRange?.[1] &&
              newDate > localeDateRange[1] - msOffset
              ? localeDateRange[0]
                ? localeDateRange[0] - msOffset
                : undefined
              : newDate
          }
          // If the input is 'end', we need to ensure the start date is not after the end date
          return localeDateRange?.[0]
            ? localeDateRange[0] - msOffset
            : undefined
        })()

        // Preparing the new end date to be emitted, also re-adapt the start date to get the correct time offset
        const newEndDate = (() => {
          if (localeDateRange?.[1] && newDate === localeDateRange[1] - msOffset)
            return localeDateRange[1] - msOffset
          if (inputRole === 'end') {
            return localeDateRange?.[0] &&
              newDate < localeDateRange[0] - msOffset
              ? localeDateRange[1]
                ? localeDateRange[1] - msOffset
                : undefined
              : newDate
          }

          return localeDateRange?.[1]
            ? localeDateRange[1] - msOffset
            : undefined
        })()

        const newDateRange: DateRange = [newStarDate, newEndDate]

        setInputValue(() => {
          const newDate = inputRole === 'start' ? newStarDate : newEndDate

          if (!newDate) return undefined

          return formatTimestampForTextInput(
            newDate + msOffset,
            DATE_FORMAT[locale]
          )
        })

        if (isAfterMin && isBeforeMax) {
          setInnerErrors(undefined)

          if (isControlled) {
            onDateChange?.(newDateRange)
          } else {
            setLocaleDateRange(newDateRange)
          }
        }
      }
    },
    [
      inputMaskInstance,
      loadMaskClass,
      toTimestamp,
      millisecondsSinceMidnight,
      minDate,
      maxDate,
      dateMsOffset,
      inputRole,
      localeDateRange,
      locale,
      isControlled,
      onDateChange,
      setLocaleDateRange,
    ]
  )

  return {
    inputValue,
    innerErrors,
    handleChange,
    inputMaskInstance,
  }
}
