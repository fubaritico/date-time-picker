import { formatToLocaleAwareFormat } from '../utils'

import type { FC } from 'react'

export type LocaleAwareFormat =
  | 'l'
  | 'll'
  | 'll LT'
  | 'lll'
  | 'llll'
  | 'lll • t'
  | 'L'
  | 'LL'
  | 'LLL'
  | 'LLLL'
  | 'L LT'
  | 'L LT Z'
  | 'LT'
  | 'LTS'

export interface I18nDateProps {
  /* Locale as a string under the shape of 'fr_FR', defaults to 'fr_FR' */
  locale?: string
  /* Locale aware formats from momentJS for datetime, date or time */
  localeAwareFormat: LocaleAwareFormat
  /* Moment Timezone list member */
  timezone?: Timezone
  /* Unix time stamp (10 or 13 digits number) */
  value?: number
}

const I18nDate: FC<I18nDateProps> = ({
  locale = 'fr_FR',
  localeAwareFormat = 'L LT',
  timezone,
  value,
}) => {
  return (
    <>
      {!value || isNaN(value)
        ? 'Value is not a number'
        : formatToLocaleAwareFormat(value, locale, localeAwareFormat, timezone)}
    </>
  )
}

export default I18nDate
