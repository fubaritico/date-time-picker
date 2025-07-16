import { useState } from 'react'

import {
  Button,
  DropdownMenu,
  I18nDateLabel,
  languages,
  timezones,
} from '@components'

import DateRangePicker from '../DateRangePicker'

import localeAwareFormatItems from './localeAwareFormatItems'

import type { CommonPickerProps, DateRange } from '../types'
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
  outputFormat,
  ...props
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    props.dateRange
  )
  const [timezone, setTimezone] = useState<Timezone | undefined>(
    props.timezone ?? ('America/New_York' as Timezone)
  )
  const [locale, setLocale] = useState(props.locale ?? 'fr_FR')
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

  const handleTimezoneChange = (p_timezone?: string) => {
    setTimezone(p_timezone as Timezone)
  }

  return (
    <div className="picker-integration">
      {controls && (
        <div className="picker-integration-header">
          <DropdownMenu
            size="md"
            buttonComponent={Button}
            dropdownFullWidth
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
            dropdownFullWidth
            variant="primary"
            label="Locale aware format"
            placement="bottom-start"
            items={localeAwareFormatItems}
            onValueChange={handleFormatSelection}
            showSelectedValue
            value={localeAwareFormat}
            width={200}
            menuWidth={500}
          />
          <DropdownMenu
            size="md"
            buttonComponent={Button}
            dropdownFullWidth
            variant="primary"
            label="Timezone"
            placement="bottom-start"
            items={timezones}
            onValueChange={handleTimezoneChange}
            showSelectedValue
            value={timezone}
            width={200}
            menuWidth={500}
          />
          {dateRange && (
            <div className="picker-integration-value">
              <I18nDateLabel
                locale={locale}
                localeAwareFormat={localeAwareFormat}
                value={dateRange[0]}
                timezone={timezone}
              />
              <span>|</span>
              <I18nDateLabel
                locale={locale}
                localeAwareFormat={localeAwareFormat}
                value={dateRange[1]}
                timezone={timezone}
              />
            </div>
          )}
        </div>
      )}
      <div className="picker-integration-body">
        <DateRangePicker
          {...props}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          locale={locale}
          timezone={timezone}
        />
      </div>
    </div>
  )
}

export default DateRangePickerIntegration
