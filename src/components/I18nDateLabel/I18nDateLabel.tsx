import { formatToLocaleAwareFormat } from '@utils'

import type { FC } from 'react'

export interface I18nDateLabelProps {
  /* Locale as a string under the shape of 'en_US', defaults to 'en_US' */
  locale?: string
  /* Locale aware formats from momentJS for datetime, date or time */
  localeAwareFormat: LocaleAwareFormat
  /* Moment Timezone list member */
  timezone?: Timezone
  /* Unix time stamp (10 or 13 digits) */
  value?: number
}

const I18nDateLabel: FC<I18nDateLabelProps> = ({
  locale = 'en_US',
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

export default I18nDateLabel
