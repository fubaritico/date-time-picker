import { LocaleAwareFormat } from './I18nDate'

import type { ChangeEvent, KeyboardEvent } from 'react'

/**
 * Debounce function that will delay the execution of the passed function
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
 * @param {string} pTimezone - time to add/substract the hour offset, default
 */
export const formatToLocaleAwareFormat = (
  pValue: number,
  pLocale: string,
  pLocaleAwareFormat: LocaleAwareFormat,
  pTimezone?: Timezone
): string => {
  return (
    new Intl.DateTimeFormat(pLocale.replace('_', '-'), {
      ...getLocaleAwareFormat(pLocaleAwareFormat, pTimezone),
    })
      .format(new Date(pValue))
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
