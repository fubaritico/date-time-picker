import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import { PanelView, PickerMode } from '../DateTimePicker.types'
import {
  addHours,
  addMinutes,
  getCurrentAMPM,
  getHours,
  getMaxTimeOfDayLessOneHour,
  getMinTimeOfDayAtMidnight,
  getMinTimeOfDayPlusOneHour,
  getMinutes,
  padNumber,
  subtractHours,
  subtractMinutes,
} from '../DateTimePicker.utils'
import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'

import TimePanelSetter from './TimePanelSetter'

import type { FC } from 'react'

export interface TimePanelProps {
  /* Tailwind CSS classes overrides or extensions for more flexibility */
  className?: string
  /* Callback function called when a innerDate is selected */
  onDateChange?: (innerDate: number, from: PanelView) => void
  /* Panel size: 'small' | 'medium' | 'large' */
  size?: UISize
}

/**
 * The TimePanel component displays controls with arrow to set time (hours & minutes) in a numeric manner.
 * Only two cases are handled there either the time is in 12-hour format or 24-hour format (FR).
 *
 * @param className Tailwind CSS classes overrides or extensions for more flexibility
 * @param onDateChange Callback function called when a innerDate is selected
 * @param size
 *
 * @constructor
 */
const TimePanel: FC<TimePanelProps> = ({ className, onDateChange, size }) => {
  // COMPONENT STATE
  const { innerDate, inputOffset, locale, pickerMode } = useDateTimePicker()
  const [date, setDate] = useState<number>(
    innerDate ?? Date.now() + inputOffset
  )

  useEffect(() => {
    setDate(innerDate ?? Date.now() + inputOffset)
  }, [innerDate, inputOffset])

  // Use of an ante meridian/post meridian system
  const dateUsesAMPM = locale !== 'fr'

  const panelRef = usePanelDomRect()

  /**
   * Function to go to the previous hour.
   *
   * If the DateTime Picker is used as a time picker, the innerDate is not taken into account.
   * Here, the goal is to avoid changing innerDate when the expected time will change the innerDate time, keeping it in a loop
   *
   * @function gotoPrevHour
   * @returns {void}
   */
  const gotoPrevHour = useCallback((): void => {
    // In DATETIME mode, the entire innerDate is taken into account
    if (pickerMode === PickerMode.DATETIME) {
      onDateChange?.(subtractHours(date, 1), PanelView.TIME)
    } else if (pickerMode === PickerMode.TIME) {
      // Here we don't change the date part, only the time part,
      // so we can loop between 00:00 AM and 11:59 PM
      const oldTime = date
      const minimumTime = getMinTimeOfDayPlusOneHour(date)
      const newTime = subtractHours(date, 1)

      const isAnteMeridian = dateUsesAMPM && getCurrentAMPM(date) === 'AM'
      const isBeforeMinimumTime = oldTime && oldTime < minimumTime

      if (isAnteMeridian && isBeforeMinimumTime) {
        onDateChange?.(addHours(date, 23), PanelView.TIME)
      } else {
        onDateChange?.(newTime, PanelView.TIME)
      }
    }
  }, [pickerMode, onDateChange, date, dateUsesAMPM])

  /**
   * Function to go to the next hour.
   *
   * If the DateTime Picker is used as a time picker, the date is not taken into account.
   * Here, the goal is to avoid changing date when the expected time will change the date time, keeping it in a loop
   *
   * @function gotoNextHour
   * @returns {void}
   */
  const gotoNextHour = useCallback((): void => {
    // In DATETIME mode, the entire date is taken into account
    if (pickerMode === PickerMode.DATETIME) {
      onDateChange?.(addHours(date, 1), PanelView.TIME)
    } else if (pickerMode === PickerMode.TIME) {
      // Here we don't change the date part, only the time part,
      // so we can loop between 00:00 AM and 11:59 PM
      const oldTime = date
      const maximumTime = getMaxTimeOfDayLessOneHour(date)
      const newTime = addHours(date, 1)

      const isPostMeridian = dateUsesAMPM && getCurrentAMPM(date) === 'PM'
      const isAfterMaximumTime = oldTime && oldTime > maximumTime

      if (isPostMeridian && isAfterMaximumTime) {
        onDateChange?.(subtractHours(date, 23), PanelView.TIME)
      } else {
        onDateChange?.(newTime, PanelView.TIME)
      }
    }
  }, [pickerMode, onDateChange, date, dateUsesAMPM])

  /**
   * Function to go to the previous hour.
   *
   * If the DateTime Picker is used as a time picker, the date is not taken into account.
   * Here, the goal is to avoid changing date when the current time is 23:59 PM, keeping it in a loop.
   *
   * @function gotoPrevHour
   * @returns {void}
   */
  const gotoPrevMinute = useCallback((): void => {
    // In DATETIME mode, the entire date is taken into account
    if (pickerMode === PickerMode.DATETIME) {
      onDateChange?.(subtractMinutes(date, 1), PanelView.TIME)
    } else if (pickerMode === PickerMode.TIME) {
      // Here we don't change the date part, only the time part,
      // so we can loop between 00:00 AM and 11:59 PM
      const oldTime = date
      const minimumTime = getMinTimeOfDayAtMidnight(date)
      const newTime = subtractMinutes(date)

      const isAnteMeridian = dateUsesAMPM && getCurrentAMPM(date) === 'AM'
      const isSameAsMinimumTime = oldTime === minimumTime

      if (isAnteMeridian && isSameAsMinimumTime) {
        onDateChange?.(addMinutes(addHours(date, 23), 59), PanelView.TIME)
      } else {
        onDateChange?.(newTime, PanelView.TIME)
      }
    }
  }, [pickerMode, onDateChange, date, dateUsesAMPM])

  /**
   * Function to go to the next hour.
   *
   * If the DateTime Picker is used as a time picker, the date is not taken into account.
   * Here, the goal is to avoid changing date when the current time is 12:00 AM, keeping it in a loop.
   *
   * @function gotoNextHour
   * @returns {void}
   */
  const gotoNextMinute = useCallback((): void => {
    // In DATETIME mode, the entire date is taken into account
    if (pickerMode === PickerMode.DATETIME) {
      onDateChange?.(addMinutes(date), PanelView.TIME)
    } else if (pickerMode === PickerMode.TIME) {
      // Here we don't change the date part, only the time part,
      // so we can loop between 00:00 AM and 11:59 PM
      const oldTime = date
      const maximumTime = addMinutes(addHours(date, 23), 59)
      const newTime = addMinutes(date)

      const isPostMeridian = dateUsesAMPM && getCurrentAMPM(date) === 'PM'
      const isSameAsMaximumTime = oldTime === maximumTime

      if (isPostMeridian && isSameAsMaximumTime) {
        onDateChange?.(
          subtractMinutes(subtractHours(date, 23), 59),
          PanelView.TIME
        )
      } else {
        onDateChange?.(newTime, PanelView.TIME)
      }
    }
  }, [pickerMode, onDateChange, date, dateUsesAMPM])

  /**
   * Function to switch between AM and PM.
   *
   * @function toggleAMPM
   * @returns {void}
   */
  const toggleAMPM = useCallback((): void => {
    const newDate =
      getCurrentAMPM(date) === 'AM'
        ? addHours(date, 12)
        : subtractHours(date, 12)
    onDateChange?.(newDate, PanelView.TIME)
  }, [date, onDateChange])

  return (
    <div
      className={clsx('flex flex-col', className)}
      data-test="time-panel"
      ref={panelRef}
    >
      <div className="flex items-center justify-center gap-2 p-6">
        <TimePanelSetter
          date={
            dateUsesAMPM && getCurrentAMPM(date) === 'PM'
              ? padNumber(getHours(date) - 12)
              : padNumber(getHours(date))
          }
          onBottomButtonClick={gotoPrevHour}
          onTopButtonClick={gotoNextHour}
          unit="hour"
        />
        <div className="text-gray-900 text-[64px] font-bold leading-[64px]">
          :
        </div>
        <TimePanelSetter
          date={padNumber(getMinutes(date)).toString()}
          onBottomButtonClick={gotoPrevMinute}
          onTopButtonClick={gotoNextMinute}
          unit="minute"
        />
      </div>
      {dateUsesAMPM && (
        <div className="flex gap-3 p-3">
          <button
            aria-label="Choose AM"
            className={clsx(
              'p-2 rounded-lg truncate grow transition duration-200 ease-in-out',
              {
                'hover:bg-gray-100': getCurrentAMPM(date) !== 'AM',
                'bg-blue-600 text-white': getCurrentAMPM(date) === 'AM',
                'text-sm': size === 'medium',
                'text-xs': size === 'small',
              }
            )}
            onClick={() => {
              if (getCurrentAMPM(date) !== 'AM') toggleAMPM()
            }}
          >
            AM
          </button>
          <button
            aria-label="Choose PM"
            className={clsx(
              'p-2 rounded-lg truncate grow transition duration-200 ease-in-out',
              {
                'hover:bg-gray-100': getCurrentAMPM(date) !== 'PM',
                'bg-blue-600 text-white': getCurrentAMPM(date) === 'PM',
                'text-sm': size === 'medium',
                'text-xs': size === 'small',
              }
            )}
            onClick={() => {
              if (getCurrentAMPM(date) !== 'PM') toggleAMPM()
            }}
          >
            PM
          </button>
        </div>
      )}
    </div>
  )
}

export default TimePanel
