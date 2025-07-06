import type { ChangeEvent, KeyboardEvent } from 'react'

/**
 * Checks if a given value is a timestamp is valid
 *
 * @param {number} ts - number representing a unix timestamp
 *
 * @returns {boolean} - true if the timestamp is valid, false otherwise
 */
const checkTsValidity = (ts: number): boolean => {
  return !isNaN(ts) && ts > 0
}

/**
 * Converts 24-hour format to 12-hour format
 *
 * @param hour24 - Hour in 24-hour format (0-23)
 * @returns Hour in 12-hour format (1-12)
 */
export const convertTo12Hour = (hour24: number): number => {
  if (hour24 === 0) return 12
  if (hour24 > 12) return hour24 - 12
  return hour24
}

/**
 * Pads a number with a leading zero if it is less than 10
 *
 * @param {number} num - The number to pad
 *
 * @returns {string} The padded number as a string
 */
export const padNumber = (num: number): string => {
  return String(num).padStart(2, '0')
}

/**
 * Will return the number of minutes from the given timestamp
 *
 * @param {number} ts - number representing an unix timestamp
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} minutes
 */
export const getMinutes = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getMinutes] Invalid timestamp')
  }

  const date = new Date(ts)

  return date.getUTCMinutes()
}

/**
 * Will return the timestamp corresponding to exactly subtract the given number of minutes from the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {number} minutes - number representing the number of minutes
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp
 */
export const subtractMinutes = (ts?: number, minutes = 1): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[subtractMinutes] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setMinutes(date.getMinutes() - minutes)

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to exactly add the given number of minutes to the given timestamp
 *
 * @param {number} ts - number representing an unix timestamp
 * @param {number} minutes - number representing the number of minutes
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp
 */
export const addMinutes = (ts?: number, minutes = 1): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[addMinutes] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setMinutes(date.getMinutes() + minutes)

  return date.getTime()
}

/**
 * Will return the amount of hours from the given timestamp
 *
 * @param {number} ts - number representing an unix timestamp
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} hours
 */
export const getHours = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getHours] Invalid timestamp')
  }

  const date = new Date(ts)

  return date.getUTCHours()
}

/**
 * Will return the timestamp corresponding to exactly subtract the given number of hours from the given timestamp
 *
 * @param {number} ts - number representing an unix timestamp
 * @param {number} hours - number representing the number of hours
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp with hours subtracted
 */
export const subtractHours = (ts?: number, hours = 1): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[subtractHours] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setHours(date.getHours() - hours)

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to exactly add the given number of hours to the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {number} hours - number representing the number of hours
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp representing the added hours
 */
export const addHours = (ts?: number, hours = 1): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[addHours] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setHours(date.getHours() + hours)

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to the first instant of the month
 * @param ts
 */
export const getFirstInstantOfMonth = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getFirstInstantOfMonth] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setDate(1) // Set to the first day of the month

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to the minimum time of the day (00:00:00) for the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp
 */
export const getMinTimeOfDayAtMidnight = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getMinTimeOfDayPlusOneHour] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setHours(0, 0, 0, 0) // Set to the minimum time of the day

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to the minimum time of the day (00:00:00) plus one hour for the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp with one hour added
 */
export const getMinTimeOfDayPlusOneHour = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getMinTimeOfDayPlusOneHour] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setHours(0, 0, 0, 0) // Set to the minimum time of the day
  date.setHours(date.getHours() + 1) // Add one hour

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to the maximum time of the day (23:59:59) less one hour for the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp representing the maxTime in the range of the given timestamp
 */
export const getMaxTimeOfDayLessOneHour = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getMaxTimeOfDayLessOneHour] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setHours(23, 59, 59, 999) // Set to the maximum time of the day
  date.setHours(date.getHours() - 1) // Subtract one hour

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to the first day of the previous month
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} timestamp of the first day of the previous month
 */
export const getFirstDayOfCurrentMonthTs = (ts: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[getFirstDayOfCurrentMonthTs] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setDate(1)

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to exactly one month before the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {number} months - number representing the amount of months to be subtracted
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp with one month removed
 */
export const subtractMonths = (ts: number, months: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[subtractMonths] Invalid timestamp')
  }

  const date = new Date(ts)
  const originalDate = date.getDate()

  date.setMonth(date.getMonth() - months)

  // Handle cases where the previous month has fewer days
  if (date.getDate() !== originalDate) {
    date.setDate(0)
  }

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to exactly one month after the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {number} months - number representing the number of added months
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp with the given months added
 */
export const addMonths = (ts: number, months: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[addOneMonth] Invalid timestamp')
  }

  const date = new Date(ts)
  const originalDate = date.getDate()

  date.setMonth(date.getMonth() + months)

  // Handle cases where the next month has fewer days
  if (date.getDate() !== originalDate) {
    date.setDate(0)
  }

  return date.getTime()
}

/**
 * Gets the number of days in a given month of a specific year.
 *
 * @param {number} year - The year.
 * @param {number} month - The month (0-11).
 *
 * @returns {number} - The number of days in the month.
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Will return the timestamp corresponding to the first day of the previous month
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {number} day - number representing the day to be found starting at 0.
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} timestamp of the first day of the previous month
 */
export const getDayOfCurrentMonthTs = (ts: number, day: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[getFirstDayOfCurrentMonthTs] Invalid timestamp')
  }

  const date = new Date(ts)
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = getDaysInMonth(year, month)

  if (day > daysInMonth) {
    throw new Error('[getFirstDayOfCurrentMonthTs] Invalid day')
  }

  date.setDate(day)

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to the end of the current month
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} timestamp of the last day of the current month
 */
export const getLastDayOfCurrentMonthTs = (ts: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[getLastDayOfCurrentMonthTs] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setMonth(date.getMonth() + 1) // Move to the next month
  date.setDate(0) // Set to the last day of the previous month (current month)

  return date.getTime()
}

/**
 * I18N - Will return a month name from a given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {string} locale - string representing the locale country code
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {string} month name
 */
export const getMonthNameFromTs = (ts: number, locale = 'en-US'): string => {
  if (!checkTsValidity(ts)) {
    throw new Error('[getMonthNameFromTs] Invalid timestamp')
  }

  return new Date(ts).toLocaleString(locale, { month: 'long' })
}

/**
 * Will return the timestamp corresponding to exactly one year before the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {number} years - the number of years to be subtracted
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp with one year removed
 */
export const subtractYears = (ts: number, years: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[subtractYears] Invalid timestamp')
  }

  const date = new Date(ts)
  const originalDate = date.getDate()

  date.setFullYear(date.getFullYear() - years)

  // Handle cases where the previous year has fewer days in the same month
  if (date.getDate() !== originalDate) {
    date.setDate(0)
  }

  return date.getTime()
}

/**
 * Will return the timestamp corresponding to exactly added years after the given timestamp, keeping the date, month, and time
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {number} years - number representing the number of years to add
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp
 */
export const addYears = (ts: number, years: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[addYears] Invalid timestamp')
  }

  const date = new Date(ts)
  const originalDate = date.getDate()

  date.setFullYear(date.getFullYear() + years)

  // Handle cases where the next year has fewer days in the same month
  if (date.getDate() !== originalDate) {
    date.setDate(0)
  }

  return date.getTime()
}

/**
 * Will return the year from a given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} year
 */
export const getYearFromTs = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getYearFromTs] Invalid timestamp')
  }

  return new Date(ts).getFullYear()
}

/**
 * Formats a given timestamp to 'YYYY-MM-DD'
 *
 * @param {number} ts - number representing a unix timestamp
 * @returns {string} formatted date string in 'YYYY-MM-DD' format
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {string} formatted date string
 */
export const formatToYYYYMMDD = (ts: number): string => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[formatToYYYYMMDD] Invalid timestamp')
  }

  const date = new Date(ts)

  return date.toISOString().split('T')[0]
}

/**
 * Will return the day of the week by its number for the starting day of the current month
 *
 * @param ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} day of the week (0 for Sunday, 1 for Monday, etc.)
 */
export const getStartDayOfWeekOfCurrentMonth = (ts: number): number => {
  if (!checkTsValidity(ts)) {
    throw new Error('[getStartDayOfWeekOfCurrentMonth] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setDate(1) // Set to the first day of the current month

  return date.getDay() // Return the day of the week (0 for Sunday, 1 for Monday, etc.)
}

/**
 * I18N - Will return all week day names from a given timestamp, starting with Monday as the first day of the week
 *
 * @param {number} ts - number representing an unix timestamp
 * @param {string} locale - string representing the locale country code
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {string[]} array of week day names
 */
export const getAllWeekDaysNamesFromTs = (
  ts: number,
  locale = 'en-US'
): { short: string; long: string }[] => {
  if (!checkTsValidity(ts)) {
    throw new Error('[getAllWeeksDayNamesFromTs] Invalid timestamp')
  }

  const date = new Date(ts)
  const weekdays: { short: string; long: string }[] = []

  // Get the first day of the week (Monday)
  const firstDayOfWeek = new Date(date)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day // Adjust if Sunday (0) to get Monday (-6), otherwise (1 - day)

  firstDayOfWeek.setDate(date.getDate() + diff)

  for (let i = 0; i < 7; i++) {
    const weekday = new Date(firstDayOfWeek)
    weekday.setDate(firstDayOfWeek.getDate() + i)
    weekdays.push({
      short: weekday.toLocaleString(locale, { weekday: 'short' }),
      long: weekday.toLocaleString(locale, { weekday: 'long' }),
    })
  }

  return weekdays
}

/**
 * I18N - Will return all month names in short or long format
 * @param {'long' | 'short'} style - string representing the type name styling
 * @param {string} locale - string representing the locale country code
 *
 * @returns {string[]} array of month names in short format
 */
export const getAllMonthNames = (
  style: 'long' | 'short' = 'short',
  locale = 'en-US'
): string[] => {
  const months: string[] = []
  const date = new Date()

  for (let i = 0; i < 12; i++) {
    date.setMonth(i)
    months.push(date.toLocaleString(locale, { month: style }))
  }

  return months
}

/**
 * I18N - Will return a long month name from a given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {string} locale - string representing the locale country code
 *
 * @throws {Error} if the timestamp is invalid
 * @returns {string} long month name
 */
export const getLongMonthNameFromTs = (
  ts?: number,
  locale = 'en-US'
): string => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getLongMonthNameFromTs] Invalid timestamp')
  }

  return new Date(ts).toLocaleString(locale, { month: 'long' })
}

/**
 * Will return an array of timestamps for each month of the same year, keeping the time
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number[]} array of timestamps for each month of the same year
 */
export const getTimestampsForEachMonth = (ts: number): number[] => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getTimestampsForEachMonth] Invalid timestamp')
  }

  const date = new Date(ts)
  const year = date.getFullYear()
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  const timestamps: number[] = []

  for (let month = 0; month < 12; month++) {
    const newDate = new Date(
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    )
    timestamps.push(newDate.getTime())
  }

  return timestamps
}

/**
 * Gets the msOffset in milliseconds from the given timezone.
 *
 * @see: https://stackoverflow.com/questions/1091372/getting-the-clients-time-zone-and-offset-in-javascript
 *
 * @param {Date} date - The local date for which to get the msOffset for display in the text input.
 * @param {string} timeZone - The IANA timezone string (e.g., 'America/New_York').
 *
 * @returns {number} - The msOffset in milliseconds from local timezone.
 */
export const getOffsetInMsFromTimezone = (
  date: Date,
  timeZone?: Timezone
): number => {
  if (!timeZone) {
    const dateToString = date.toString()
    const matches = /(GMT|UTC)(-|\+)(\d+)/.exec(dateToString)

    if (matches === null) {
      throw new Error('Invalid timezone')
    }

    const sign = matches[2] === '-' ? -1 : 1

    const hourOffset = parseInt(matches[3], 10) / 100

    return hourOffset * 60 * 60 * 1000 * sign
  }

  const formatter = new Intl.DateTimeFormat([], {
    timeZone,
    timeZoneName: 'longOffset',
  })
  const parts = formatter.formatToParts(date)
  const timeZoneName = parts.find((part) => part.type === 'timeZoneName')?.value

  if (!timeZoneName) {
    throw new Error('Invalid timezone')
  }

  const matches = /^(GMT|UTC)(-|−|\+)?(\d+)?/.exec(timeZoneName)

  if (!matches) {
    throw new Error('Unable to parse timezone msOffset')
  }

  const sign = matches[2] === '-' ? -1 : 1

  const hourOffset = parseInt(matches[3], 10)

  return hourOffset * 60 * 60 * 1000 * sign
}

/**
 * Formats a timestamp, according to the given format, and locale to be displayed in the field
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {string} format - the desired format ('YYYY/MM/DD', 'hh:mm A', 'YYYY/MM/DD hh:mm A')
 * @param {number} offset - the msOffset in milliseconds from GMT time zone (daylight taken into account)
 *
 * @throws {Error} if the timestamp is invalid or format is not supported
 *
 * @returns {string} formatted date string
 */
export const formatTimestampForTextInput = (
  ts: number,
  format: string,
  offset?: number
): string => {
  if (!checkTsValidity(ts)) {
    throw new Error('[formatTimestampForTextInput] Invalid timestamp')
  }

  const date = new Date(ts + (offset ?? 0))

  const year = date.getUTCFullYear().toString()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = date.getUTCHours()
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = String(hours % 12 || 12).padStart(2, '0')
  const formatted24Hours = String(hours).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
    case 'DD-MM-YYYY':
      return format === 'DD-MM-YYYY'
        ? `${day}/${month}/${year}`
        : `${year}/${month}/${day}`
    case 'hh:mm A':
    case 'HH:mm':
      return format === 'HH:mm'
        ? `${formatted24Hours}:${minutes}`
        : `${formattedHours}:${minutes} ${ampm}`
    case 'YYYY-MM-DD hh:mm A':
    case 'DD-MM-YYYY HH:mm':
      return format === 'DD-MM-YYYY HH:mm'
        ? `${day}/${month}/${year} ${formatted24Hours}:${minutes}`
        : `${year}/${month}/${day} ${formattedHours}:${minutes} ${ampm}`
    default:
      throw new Error('[formatTimestampForTextInput] Unsupported format')
  }
}

/**
 * Converts a date string formatted as 'YYYY-MM-DD hh:mm A' or 'DD-MM-YYYY HH:mm' to a unix timestamp
 *
 * @param {string} dateStr - The date string to convert
 *
 * @throws {Error} if the date string or format is invalid
 *
 * @returns {number} - The corresponding unix timestamp
 */
export const convertFormattedDateToTimestamp = (
  dateStr: string
): number | undefined => {
  if (dateStr === '') return

  const frDateTimeFormat = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/
  const enDateTimeFormat = /(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}) (AM|PM)/
  const enDateFormat = /(\d{2})\/(\d{2})\/(\d{4})/
  const frDateFormat = /(\d{4})\/(\d{2})\/(\d{2})/

  let year, month, day, hours, minutes, ampm

  const enDateTimeFormatMatch = enDateTimeFormat.exec(dateStr)
  const frDateTimeFormatMatch = frDateTimeFormat.exec(dateStr)
  const enDateFormatMatch = enDateFormat.exec(dateStr)
  const frDateFormatMatch = frDateFormat.exec(dateStr)

  if (enDateTimeFormatMatch !== null) {
    ;[year, month, day, hours, minutes, ampm] = enDateTimeFormatMatch.slice(1)
  } else if (frDateTimeFormatMatch !== null) {
    ;[day, month, year, hours, minutes] = frDateTimeFormatMatch.slice(1)
  } else if (enDateFormatMatch !== null) {
    ;[day, month, year] = enDateFormatMatch.slice(1)
  } else if (frDateFormatMatch !== null) {
    ;[year, month, day] = frDateFormatMatch.slice(1)
  } else {
    throw new Error('[convertFormattedDateToTimestamp] Unsupported format')
  }

  const date = new Date(
    Date.UTC(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      hours
        ? ampm === 'AM'
          ? parseInt(hours, 10)
          : parseInt(hours, 10) + 12
        : 0,
      minutes ? parseInt(minutes, 10) : 0
    )
  )

  return date.getTime()
}

/**
 * Formats a given timestamp to 'YYYY-MM-DD' or 'DD-MM-YYYY'
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {string} locale - the locale as fr or en
 *
 * @throws {Error} if the timestamp is invalid or format is not supported
 *
 * @returns {string} formatted date string
 */
export const formatTimestampToDate = (ts: number, locale: string): string => {
  if (isNaN(ts) || ts <= 0) {
    throw new Error('[formatTimestampToDate] Invalid timestamp')
  }

  const date = new Date(ts)
  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  switch (locale) {
    case 'fr':
      return `${day}/${month}/${year}`
    default:
      return `${year}/${month}/${day}`
  }
}

/**
 * Will return the timestamp corresponding to the start of the day for the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp
 */
export const getStartOfDayTs = (ts: number): number => {
  const date = new Date(ts)
  const offset = getOffsetInMsFromTimezone(date)
  const dateWithOffset = new Date(date.getTime() - offset)
  dateWithOffset.setHours(0, 0, 0, 0) // Set time components to zero

  return dateWithOffset.getTime()
}

/**
 * Sets the year, month, date, hours, and minutes on a new Date object.
 *
 * @param {number} year - The year to set.
 * @param {number} month - The month to set (0-11).
 * @param {number} date - The date to set (1-31).
 * @param {number} hours - The hours to set (0-23).
 * @param {number} minutes - The minutes to set (0-59).
 *
 * @returns {Number} - The new Date object with the specified values as a timestamp.
 */
export const setNewUtcTimestamp = (
  year: number,
  month: number,
  date: number,
  hours: number,
  minutes: number
): number => {
  return new Date(Date.UTC(year, month, date, hours, minutes)).getTime()
}

/**
 * Determines if the current timestamp is AM or PM.
 *
 * @param {number} ts - number representing a unix timestamp
 *
 * @returns {string} - 'AM' if the current time is before noon, 'PM' otherwise.
 */
export const getCurrentAMPM = (ts?: number): string => {
  const altDate = ts ?? Date.now()
  const currentHour = new Date(altDate).getUTCHours()

  return currentHour < 12 ? 'AM' : 'PM'
}

/**
 * Debounce-function that will delay the execution of the passed function
 *
 * @param func - any function
 * @param {number} wait - delay applied to the function
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const debounce = <Fn extends (...args: never[]) => void>(
  func: Fn,
  wait: number
): ((...args: Parameters<Fn>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (...args: Parameters<Fn>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      func.apply(this, args)
    }, wait)
  }
}

/**
 * Handle key down event of 'enter' & 'space' keys for tags that need
 * to be clickable with keyboard due to accessibility reasons
 * Works when an element is focused.
 *
 * @param callback
 */
export const handleKeyDown =
  <Element>(callback: (e?: Event) => void) =>
  (event: KeyboardEvent<Element>): void => {
    event.preventDefault()
    if (event.key === 'Enter' || event.key === ' ') {
      // The passed callback has, most of the time, no event argument
      callback(event as never)
    }
  }

/**
 * Function to create a custom change event.
 * @param eventValue
 */
export const createCustomChangeEvent = (
  eventValue: string
): ChangeEvent<HTMLInputElement> => {
  const event = new Event('change', {
    bubbles: true,
    cancelable: true,
  }) as unknown as ChangeEvent<HTMLInputElement>
  Object.defineProperty(event, 'target', {
    writable: true,
    value: { value: eventValue } as HTMLInputElement,
  })
  return event
}

/**
 * Will return options for the Intl.DateTimeFormat constructor based on a format and timezone
 *
 * Important note: the returned option object used for formatting is supposed to mimic LocaleAwareFormat
 * used in momentJS, the goal is to avoid changing the signature (for now) of the method used in I18nDate if possible.
 *
 * @see: https://tc39.es/proposal-intl-datetime-style/
 *
 *    interface DateTimeFormatOptions {
 *         calendar?: string | undefined;
 *         dayPeriod?: "narrow" | "short" | "long" | undefined;
 *         numberingSystem?: string | undefined;
 *
 *         dateStyle?: "full" | "long" | "medium" | "short" | undefined;
 *         timeStyle?: "full" | "long" | "medium" | "short" | undefined;
 *         hourCycle?: "h11" | "h12" | "h23" | "h24" | undefined;
 *     }
 *
 *     interface DateTimeFormatOptions {
 *         localeMatcher?: "best fit" | "lookup" | undefined;
 *         weekday?: "long" | "short" | "narrow" | undefined;
 *         era?: "long" | "short" | "narrow" | undefined;
 *         year?: "numeric" | "2-digit" | undefined;
 *         month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
 *         day?: "numeric" | "2-digit" | undefined;
 *         hour?: "numeric" | "2-digit" | undefined;
 *         minute?: "numeric" | "2-digit" | undefined;
 *         second?: "numeric" | "2-digit" | undefined;
 *         timeZoneName?: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined;
 *         formatMatcher?: "best fit" | "basic" | undefined;
 *         hour12?: boolean | undefined;
 *         timeZone?: string | undefined;
 *     }
 *
 * @param pLocaleAwareFormat
 * @param timeZone
 */
const getLocaleAwareFormat = (
  pLocaleAwareFormat: LocaleAwareFormat,
  timeZone?: Timezone
): Intl.DateTimeFormatOptions | undefined => {
  switch (pLocaleAwareFormat) {
    case 'l':
      return {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }
    case 'll':
      return {
        dateStyle: 'medium',
      }
    case 'lll • t':
    case 'lll':
      return {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    case 'llll':
      return {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
    case 'L':
      return {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }
    case 'LL':
      return {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    case 'LLL':
      return {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
    case 'LLLL':
      return {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
    case 'L LT':
      return {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
    case 'L LT Z':
      return {
        dateStyle: 'short',
        timeStyle: 'long',
        timeZone,
      }
    case 'LT':
      return {
        hour: 'numeric',
        minute: 'numeric',
      }
    case 'LTS':
      return {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }
    default:
      return undefined
  }
}

/**
 * Locale aware formats
 * --------------------
 * Locale aware date and time formats are also available using LT LTS L LL LLL LLLL.
 * They were added in version 2.2.1, except LTS which was added 2.8.4.
 *
 * Tokens are case-sensitive.
 *
 * Input	Example	Description
 * L  	09/04/1986	Date (in local format)
 * LL 	September 4 1986	Month name, day of month, year
 * LLL	September 4 1986 8:30 PM	Month name, day of month, year, time
 * LLLL	Thursday, September 4 1986 8:30 PM	Day of week, month name, day of month, year, time
 * LT 	8:30 PM	Time (without seconds)
 * LTS	8:30:00 PM	Time (with seconds)
 *
 * See also: https://momentjs.com/docs/#/parsing/string/ (Supported ISO 8601 strings)
 * and the RFC 2822 date time format
 *
 * All country codes can be retrieved using method moment.tz.countries()
 *
 * @param {number} pValue - date under the shape of a unix timestamp UTC
 * @param {string} pLocale - locale as a string under the shape of 'fr_FR'
 * @param {string} pLocaleAwareFormat - format to apply to the date in a locale way
 * @param {string} pTimezone - time to add/substract the hour msOffset, default
 */
export const formatToLocaleAwareFormat = (
  pValue: number,
  pLocale: string,
  pLocaleAwareFormat: LocaleAwareFormat,
  pTimezone?: Timezone
): string => {
  const date = new Date(pValue)
  const gmtMsOffset = getOffsetInMsFromTimezone(date)
  const msOffset = getOffsetInMsFromTimezone(date, pTimezone)
  const utc = new Date(date.getTime() + msOffset - gmtMsOffset)

  return (
    new Intl.DateTimeFormat(pLocale.replace('_', '-'), {
      ...getLocaleAwareFormat(pLocaleAwareFormat, pTimezone),
    })
      .format(utc)
      // Removing à/at from the formatted date
      .replace(/\s(at|à)/, () => {
        return pLocaleAwareFormat === 'lll • t' ? ' •' : ''
      })
      // Adapting timezone to the format +1:00
      .replace(/\sGMT(-|\+)(\d+)/, (_match: string, p1: string, p2: string) => {
        return ` ${p1}${p2}:00`
      })
  )
}

/**
 *
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {string} locale - locale as a string under the shape of 'fr_FR'
 *
 * @throws {Error} if the timestamp is invalid or format is not supported
 *
 * @returns {string} formatted date string
 */
export const formatHumanReadableDate = (
  ts: number,
  locale = 'en_US',
  pickerMode = 'DATETIME'
): string => {
  if (isNaN(ts) || ts <= 0) {
    throw new Error('[formatHumanReadableDate] Invalid timestamp')
  }

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    ...dateFormatOptions,
    hour: '2-digit',
    minute: '2-digit',
  }

  const options =
    pickerMode === 'DATETIME' ? dateFormatOptions : dateTimeFormatOptions

  return new Intl.DateTimeFormat(locale.replace('_', '-'), options).format(
    new Date(ts)
  )
}
