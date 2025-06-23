import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

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
} from '@utils'

import useDateTimePicker from '../hooks/useDateTimePicker'
import usePanelDomRect from '../hooks/usePanelDomRect'
import { PanelView } from '../types'

import TimePanelSetter from './TimePanelSetter'

import type { FC } from 'react'

export interface TimePanelProps {
  /* Tailwind CSS classes overrides or extensions for more flexibility */
  className?: string
  /* Callback function called when a date is selected */
  onDateChange?: (innerDate: number, from: PanelView) => void
  /* Panel size: 'sm' | 'md' | 'lg' */
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
  const {
    color,
    //gmtMsOffset,
    innerDate,
    msOffset,
    locale,
    pickerMode,
    //isControlled,
  } = useDateTimePicker()
  const [date, setDate] = useState<number>(innerDate ?? Date.now() + msOffset)

  useEffect(() => {
    setDate(innerDate ?? Date.now() + msOffset)
  }, [innerDate, msOffset])

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
    if (pickerMode === 'DATETIME') {
      onDateChange?.(subtractHours(date, 1), PanelView.TIME)
    } else if (pickerMode === 'TIME') {
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
    if (pickerMode === 'DATETIME') {
      onDateChange?.(addHours(date, 1), PanelView.TIME)
    } else if (pickerMode === 'TIME') {
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
    if (pickerMode === 'DATETIME') {
      onDateChange?.(subtractMinutes(date, 1), PanelView.TIME)
    } else if (pickerMode === 'TIME') {
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
    if (pickerMode === 'DATETIME') {
      onDateChange?.(addMinutes(date), PanelView.TIME)
    } else if (pickerMode === 'TIME') {
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
      className={clsx('TimePanel', className)}
      data-test="time-panel"
      ref={panelRef}
    >
      <div className="TimePanel-setters">
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
        <div className="separator">:</div>
        <TimePanelSetter
          date={padNumber(getMinutes(date)).toString()}
          onBottomButtonClick={gotoPrevMinute}
          onTopButtonClick={gotoNextMinute}
          unit="minute"
        />
      </div>
      {dateUsesAMPM && (
        <div className="TimePanel-buttons">
          <button
            aria-label="Choose AM"
            className={clsx('PanelButton', color, size, {
              selected: getCurrentAMPM(date) === 'AM',
            })}
            onClick={() => {
              if (getCurrentAMPM(date) !== 'AM') toggleAMPM()
            }}
          >
            AM
          </button>
          <button
            aria-label="Choose PM"
            className={clsx('PanelButton', color, size, {
              selected: getCurrentAMPM(date) === 'PM',
            })}
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
