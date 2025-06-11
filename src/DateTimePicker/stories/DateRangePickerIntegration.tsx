import { useState } from 'react'

import { Button, DropdownMenu, I18nDate, languages } from '@components'

import DateRangePicker from '../DateRangePicker'

import FakeContent from './FakeContent'
import localeAwareFormatItems from './localeAwareFormatItems'

import type { CommonPickerProps, DateRange } from '@types'
import type { FC } from 'react'

export interface DateRangePickerIntegrationProps
  extends CommonPickerProps<'DATERANGE'> {
  /* Time setting controls will be displayed, defaults to true */
  controls?: boolean
  /* Locale Aware Format for easy formatting  */
  outputFormat?: LocaleAwareFormat
  /* Fake content placement: 'bottom-start' | 'bottom-end' */
  placement?: Extract<Placement, 'bottom-start' | 'bottom-end'>
  /* Moment Timezone list member */
  timezone?: Timezone
}

/**
 * The DateTimePickerIntegration component is a simple integration of the DateTimePicker component with a date output.
 * It displays the selected date in a formatted string.
 *
 */
const DateRangePickerIntegration: FC<DateRangePickerIntegrationProps> = ({
  controls = true,
  placement,
  timezone = 'America/New_York',
  locale: l,
  outputFormat,
  ...props
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    props.dateRange
  )
  const [locale, setLocale] = useState(l ?? 'fr_FR')
  const [localeAwareFormat, setLocaleAwareFormat] = useState<LocaleAwareFormat>(
    outputFormat ?? (localeAwareFormatItems[0].value as LocaleAwareFormat)
  )

  const handleActionSelection = (value: string) => {
    setLocale(value)
  }

  const handleFormatSelection = (p_value: string) => {
    setLocaleAwareFormat(p_value as LocaleAwareFormat)
  }

  const handleDateRangeChange = (p_dateRange?: DateRange) => {
    setDateRange(p_dateRange)
  }

  return (
    <div className="dp-flex dp-flex-col dp-min-h-screen dp-w-full">
      {placement === 'bottom-start' && <FakeContent />}
      <div className="dp-flex dp-flex-col dp-gap-4">
        {controls && (
          <div className="dp-flex dp-gap-4">
            <DropdownMenu
              size="md"
              buttonComponent={Button}
              variant="primary"
              label="Language"
              placement="bottom-start"
              items={languages}
              onValueChange={handleActionSelection}
              showSelectedValue
              value={locale}
              width={200}
            />
            <DropdownMenu
              size="md"
              buttonComponent={Button}
              variant="primary"
              label="Locale aware format"
              placement="bottom-start"
              items={localeAwareFormatItems}
              onValueChange={handleFormatSelection}
              showSelectedValue
              value={localeAwareFormat}
              width={200}
              menuWidth={400}
            />
          </div>
        )}
        <div className="dp-flex dp-gap-4">
          <DateRangePicker
            {...props}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            locale={locale}
            timezone={timezone}
          />
          <div className="dp-flex dp-items-center dp-gap-0.dp-5 dp-px-4 dp-font-bold dp-bg-white/50 dp-text-blue-900 dp-rounded">
            {dateRange && (
              <>
                <span>From</span>
                <I18nDate
                  locale={locale}
                  localeAwareFormat={localeAwareFormat}
                  value={dateRange[0]}
                  timezone={timezone}
                />
                <span>to</span>
                <I18nDate
                  locale={locale}
                  localeAwareFormat={localeAwareFormat}
                  value={dateRange[1]}
                  timezone={timezone}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {placement === 'bottom-end' && <FakeContent />}
    </div>
  )
}

export default DateRangePickerIntegration
