import { DateTimePicker, I18nDate } from '@components'
import { PickerMode } from '@enums'

import type { FC, ReactNode } from 'react'
import type { DateTimePickerProps } from '@types'

const ControlledExample: FC<DateTimePickerProps & { title: ReactNode }> = ({
  date,
  locale = 'en_US',
  onChange,
  timezone,
  title,
  ...rest
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="p-4 border rounded-lg">
        <DateTimePicker
          date={date}
          enablePortal
          locale={locale}
          onChange={onChange}
          pickerMode={PickerMode.DATETIME}
          timezone={timezone}
          {...rest}
        />
        <div className="mt-4 flex">
          <p>
            Selected value: {date ? date.toString() : 'None'}&nbsp;|&nbsp;
            <I18nDate
              locale={locale}
              localeAwareFormat="L LT"
              timezone={timezone}
              value={date}
            />
          </p>
        </div>
      </div>
    </div>
  )
}

export default ControlledExample
