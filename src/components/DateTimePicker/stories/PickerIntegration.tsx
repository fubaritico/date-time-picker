import { useState } from 'react'

import { Button, DropdownMenu, I18nDate, languages } from '@components'

import FakeContent from './FakeContent'
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
  placement,
  timezone = 'America/New_York',
  locale: l,
  outputFormat,
  ...props
}: PickerIntegrationProps) => {
  const [date, setDate] = useState<number | undefined>(props.date)
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

  const handleDateChange = (p_date?: number) => {
    setDate(p_date)
  }

  return (
    <div className="dp-flex dp-flex-col dp-min-h-screen dp-w-full dp-pt-[120px]">
      {placement === 'bottom-start' && <FakeContent />}
      {controls && (
        <div className="dp-flex dp-gap-4 dp-flex-start dp-items-end dp-border-bdp-border-l-gray-200 dp-border-b-gray-200 dark:dp-border-b-gray-700 dp-bg-white dark:dp-bg-gray-800 dp-fixed dp-p-6 dp-w-full dp-top-0 dp-left-0">
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
            width={400}
            menuWidth={400}
          />
          {date && (
            <div className="dp-flex dp-items-end dp-gap-1 dp-px-4 dp-self-stretch dp-grow dp-text-gray-900 dp-border-l dp-border-l-gray-200 dark:dp-text-white dark:dp-border-l-gray-700">
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
      <div className="dp-flex dp-gap-4">
        <PickerComponent
          date={date}
          onChange={handleDateChange}
          locale={locale}
          timezone={timezone}
        />
      </div>
      {placement === 'bottom-end' && <FakeContent />}
    </div>
  )
}

export default PickerIntegration
