import { useState } from 'react'

import { PickerType } from '@enums'
import { Button, DropdownMenu, I18nDate, languages } from '@components'

import FakeContent from './FakeContent'
import localeAwareFormatItems from './localeAwareFormatItems'

import type { AnyPickerComponent, CommonPickerProps } from '@types'

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
    <div className="flex flex-col min-h-screen w-full">
      {placement === 'bottom-start' && <FakeContent />}
      <div className="flex flex-col gap-4">
        {controls && (
          <div className="flex gap-4">
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
        <div className="flex gap-4">
          <PickerComponent
            date={date}
            onChange={handleDateChange}
            locale={locale}
            timezone={timezone}
          />
          <div className="flex items-center px-4 font-bold bg-white/50 text-blue-900 rounded">
            {date && (
              <I18nDate
                locale={locale}
                localeAwareFormat={localeAwareFormat}
                value={date}
                timezone={timezone}
              />
            )}
          </div>
        </div>
      </div>
      {placement === 'bottom-end' && <FakeContent />}
    </div>
  )
}

export default PickerIntegration
