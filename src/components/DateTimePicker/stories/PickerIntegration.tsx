import { useState } from 'react'

import {
  Button,
  DropdownMenu,
  I18nDate,
  languages,
  timezones,
} from '@components'

import localeAwareFormatItems from './localeAwareFormatItems'

import type {
  AnyPickerComponent,
  CommonPickerProps,
  PickerType,
} from '../types'

export type PickerIntegrationProps = CommonPickerProps<PickerType> & {
  /*  Picker component to use, defaults to DateTimePicker */
  PickerComponent: AnyPickerComponent
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
const PickerIntegration = ({
  PickerComponent,
  controls = true,
  outputFormat,
  ...props
}: PickerIntegrationProps) => {
  const [date, setDate] = useState<number | undefined>(props.date)
  const [timezone, setTimezone] = useState<Timezone | undefined>(props.timezone)
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

  const handleDateChange = (p_date?: number) => {
    setDate(p_date)
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
          {date && (
            <div className="picker-integration-value">
              <I18nDate
                locale={locale}
                localeAwareFormat={localeAwareFormat}
                value={date}
                timezone={timezone}
              />
            </div>
          )}
        </div>
      )}
      <div className="picker-integration-body">
        <PickerComponent
          date={date}
          onChange={handleDateChange}
          locale={locale}
          timezone={timezone}
        />
      </div>
    </div>
  )
}

export default PickerIntegration
