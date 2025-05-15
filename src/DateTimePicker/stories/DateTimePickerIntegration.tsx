import { useState } from 'react'

import { DateTimePicker } from '..'
import { Button, DropdownMenu, I18nDate, languages } from '../..'

import type { LocaleAwareFormat, MenuItemConfig } from '../..'
import type { DateTimePickerProps } from '../DateTimePicker.types'
import type { FC } from 'react'

export interface DateTimePickerIntegrationProps extends DateTimePickerProps {
  /* Time setting controls will be displayed, defaults to true */
  controls?: boolean
  /* Locale Aware Format for easy formatting  */
  outputFormat?: LocaleAwareFormat
  /* Fake content placement: 'bottom-start' | 'bottom-end' */
  placement?: Extract<Placement, 'bottom-start' | 'bottom-end'>
  /* Moment Timezone list member */
  timezone?: Timezone
}

const FakeContent: FC = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-white/50 text-gray-900 rounded gap-4 my-4">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dapibus mi
        eget quam semper blandit. Nullam vel ullamcorper lacus. Nam in quam
        dignissim nibh sollicitudin tempus. Fusce sed finibus elit, at congue
        neque. Sed id mattis massa. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Nulla eu est laoreet, tempor dui eget, vestibulum arcu.
        Nunc mattis lorem eget est condimentum posuere in vel quam. Nunc a quam
        elementum, lacinia elit nec, porta tellus. Vivamus vel euismod mi, non
        efficitur turpis. Vivamus tempor, enim non malesuada varius, urna orci
        viverra massa, ut volutpat dui massa vitae lorem.
      </p>
      <p>
        Nunc et eleifend elit, vel dignissim ex. Vestibulum ante ipsum primis in
        faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse
        potenti. In semper vestibulum ligula in commodo. Phasellus iaculis magna
        eu turpis malesuada, eu finibus nulla pharetra. Ut vehicula ullamcorper
        mi, aliquet consectetur mauris varius vitae. Fusce vitae facilisis ante,
        sit amet venenatis turpis. Aenean id commodo turpis, vel tristique leo.
        Nulla commodo tellus ut finibus mattis. Etiam vitae nibh sem. Phasellus
        sed quam posuere, suscipit ligula ac, consequat massa. Phasellus
        ultricies est ante, quis porta nulla consequat eget. Morbi at nulla
        luctus, pellentesque orci sit amet, hendrerit ante. Aliquam ultricies
        tortor et pellentesque hendrerit.
      </p>
      <p>
        Sed venenatis felis vel risus semper efficitur. Aenean varius tempus
        sapien ultrices aliquam. Phasellus sagittis orci non arcu consectetur
        ultrices. Phasellus et lectus fermentum, vulputate erat eu, placerat
        orci. Aenean convallis lectus faucibus ante egestas imperdiet.
        Vestibulum ut eros id odio accumsan condimentum. Sed at pharetra eros,
        sed mattis ligula. Nullam et sodales lacus. Integer eget leo tincidunt,
        lacinia velit vitae, consectetur massa. Aliquam erat volutpat.
      </p>
      <p>
        Fusce a odio interdum, luctus velit at, mollis nisi. Cras venenatis,
        ligula in tempor efficitur, nibh est scelerisque diam, sed dapibus enim
        velit id erat. Ut imperdiet massa diam, eget sollicitudin mauris semper
        ac. Vivamus maximus facilisis ipsum. Nunc sit amet commodo massa. Aenean
        molestie feugiat purus, non euismod sapien malesuada non. Sed feugiat
        finibus erat, sed imperdiet risus ornare id. Nunc a finibus diam.
        Quisque sed aliquam mauris.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultricies
        efficitur nunc et vehicula. Nunc elementum lorem id velit maximus, nec
        volutpat arcu hendrerit. Vivamus dictum dolor non condimentum tristique.
        Integer euismod tortor diam, et porttitor libero interdum eu. Etiam
        posuere, velit sit amet imperdiet facilisis, orci justo pellentesque
        enim, nec eleifend tortor nulla vulputate ante. Vestibulum a lorem a
        dolor tincidunt mollis ac consequat lectus. Proin eleifend ultrices quam
        id cursus. Proin neque magna, luctus scelerisque laoreet ut, tincidunt
        et eros.
      </p>
    </div>
  )
}

const localeAwareFormatItems: MenuItemConfig[] = [
  { label: '[ 09/04/1986 ] - Date (in local format) SHORT', value: 'l' },
  {
    label: '[ Sept 4, 1986 ] - Month name, day of month, year SHORT',
    value: 'll',
  },
  {
    label:
      '[ Sept 4, 1986 8:30 PM ] - Month name, day of month, year, time SHORT',
    value: 'lll',
  },
  {
    label:
      '[ Thu, Sept 4, 1986 8:30 PM ] - Day of week, month name, day of month, year, time SHORT',
    value: 'llll',
  },
  { label: '[ 09/04/1986 ] - Date (in local format)', value: 'L' },
  {
    label: '[ September 4, 1986 ] - Month name, day of month, year',
    value: 'LL',
  },
  {
    label:
      '[ September 4, 1986 8:30 PM ] - Month name, day of month, year, time',
    value: 'LLL',
  },
  {
    label:
      '[ Thursday, September 4, 1986 8:30 PM ] - Day of week, month name, day of month, year, time',
    value: 'LLLL',
  },
  {
    label:
      '[ 09/04/1986 8:30 PM +2:00 ] - Date (in local format) with time and timezone',
    value: 'L LT Z',
  },
  { label: '8:30 PM Time (without seconds)', value: 'LT' },
  { label: '8:30:00 PM Time (with seconds)', value: 'LTS' },
]

/**
 * The DateTimePickerIntegration component is a simple integration of the DateTimePicker component with a date output.
 * It displays the selected date in a formatted string.
 *
 */
const DateTimePickerIntegration: FC<DateTimePickerIntegrationProps> = ({
  controls = true,
  placement,
  timezone = 'America/New_York',
  locale: l,
  outputFormat,
  ...props
}) => {
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
          <DateTimePicker
            {...props}
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

export default DateTimePickerIntegration
