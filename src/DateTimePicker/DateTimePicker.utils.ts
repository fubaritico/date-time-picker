/**
 * Converts an en-GB moment formatted date to a unix(?) timestamp
 *
 * @param {string} date - an en-GB moment formatted date to a timestamp
 *
 * @returns {number} - unix(?) timestamp (strong risk that the time should be converted to locale)
 */
export const convertToTimestamp = (date?: string): number => {
  if (!date) throw Error('Date is undefined')
  return new Date(date).getTime()
}

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
 * Will return the amount of minutes from the given timestamp
 *
 * @param {number} ts - number representing an unix timestamp
 * @param {number} msOffset - because in this utility method, time is in locale time, it has to be reset to initial time zone time
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} minutes
 */
export const getMinutes = (ts?: number, msOffset = 0): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getMinutes] Invalid timestamp')
  }

  const date = new Date(ts - msOffset)

  return date.getMinutes()
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
 * @param {number} msOffset - because in this utility method, time is in locale time, it has to be reset to initial time zone time
 *
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} hours
 */
export const getHours = (ts?: number, msOffset = 0): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getHours] Invalid timestamp')
  }

  const date = new Date(ts - msOffset)

  return date.getHours()
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
 * Will return the timestamp corresponding to the last instant of the month
 * @param ts
 */
export const getLastInstantOfMonth = (ts?: number): number => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[getLastInstantOfMonth] Invalid timestamp')
  }

  const date = new Date(ts)
  date.setMonth(date.getMonth() + 1) // Move to the next month
  date.setDate(0) // Set to the last day of the previous month (current month)
  date.setHours(23, 59, 59, 999) // Set to the end of the day

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
): string[] => {
  if (!checkTsValidity(ts)) {
    throw new Error('[getAllWeeksDayNamesFromTs] Invalid timestamp')
  }

  const date = new Date(ts)
  const weekdays: string[] = []

  // Get the first day of the week (Monday)
  const firstDayOfWeek = new Date(date)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day // Adjust if Sunday (0) to get Monday (-6), otherwise (1 - day)

  firstDayOfWeek.setDate(date.getDate() + diff)

  for (let i = 0; i < 7; i++) {
    const weekday = new Date(firstDayOfWeek)
    weekday.setDate(firstDayOfWeek.getDate() + i)
    weekdays.push(weekday.toLocaleString(locale, { weekday: 'short' }))
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
 * Gets the offset in milliseconds from the given timezone.
 *
 * @see: https://stackoverflow.com/questions/1091372/getting-the-clients-time-zone-and-offset-in-javascript
 *
 * @param {Date} date - The local date for which to get the offset for display in the text input.
 * @param {string} timeZone - The IANA timezone string (e.g., 'America/New_York').
 *
 * @returns {number} - The offset in milliseconds from local timezone.
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
    throw new Error('Unable to parse timezone offset')
  }

  const sign = matches[2] === '-' ? -1 : 1

  const hourOffset = parseInt(matches[3], 10)

  return hourOffset * 60 * 60 * 1000 * sign
}

/**
 * Formats a timestamp, according to the given format, and locale to be displayed in the field
 *
 * @param {number} ts - number representing a unix timestamp
 * @param {string} format - the desired format ('YYYY-MM-DD', 'hh:mm A', 'YYYY-MM-DD hh:mm A')
 * @param {number} offset - the offset in milliseconds from GMT time zone (daylight taken into account)
 *
 * @throws {Error} if the timestamp is invalid or format is not supported
 *
 * @returns {string} formatted date string
 */
export const formatTimestampForTextInput = (
  ts: number,
  format: string,
  offset: number
): string => {
  if (!ts || !checkTsValidity(ts)) {
    throw new Error('[formatTimestamp] Invalid timestamp')
  }

  const date = new Date(ts - offset)

  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = String(hours % 12 || 12).padStart(2, '0')
  const formatted24Hours = String(hours).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
    case 'DD-MM-YYYY':
      return format === 'DD-MM-YYYY'
        ? `${day}-${month}-${year}`
        : `${year}-${month}-${day}`
    case 'hh:mm A':
    case 'HH:mm':
      return format === 'HH:mm'
        ? `${formatted24Hours}:${minutes}`
        : `${formattedHours}:${minutes} ${ampm}`
    case 'YYYY-MM-DD hh:mm A':
    case 'DD-MM-YYYY HH:mm':
      return format === 'DD-MM-YYYY HH:mm'
        ? `${day}-${month}-${year} ${formatted24Hours}:${minutes}`
        : `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`
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

  let year, month, day, hours, minutes

  const enDateTimeFormatMatch = enDateTimeFormat.exec(dateStr)
  const frDateTimeFormatMatch = frDateTimeFormat.exec(dateStr)
  const enDateFormatMatch = enDateFormat.exec(dateStr)
  const frDateFormatMatch = frDateFormat.exec(dateStr)

  if (enDateTimeFormatMatch !== null) {
    ;[year, month, day, hours, minutes] = enDateTimeFormatMatch.slice(1)
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
      hours ? parseInt(hours, 10) : 0,
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
 * Formats a given timestamp to 'YYYY-MM-DDTHH:mm:ss+00:00'
 *
 * @param {number} ts - number representing a unix timestamp
 * @returns {string} formatted date string in 'YYYY-MM-DDTHH:mm:ss+00:00' format
 */
export const formatTimestampToISO = (ts: number): string => {
  const date = new Date(ts)

  return date.toISOString()
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
 * Will return the timestamp corresponding to the end of the day for the given timestamp
 *
 * @param {number} ts - number representing a unix timestamp
 * @throws {Error} if the timestamp is invalid
 *
 * @returns {number} new timestamp
 */
export const getEndOfDayTs = (ts?: number): number => {
  const date = new Date(ts ?? Date.now())
  const offset = getOffsetInMsFromTimezone(date)
  const dateWithOffset = new Date(date.getTime() - offset)
  dateWithOffset.setHours(23, 59, 59, 0) // Set time components to 23:59:59

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
  const currentHour = new Date(altDate).getHours()

  return currentHour < 12 ? 'AM' : 'PM'
}
