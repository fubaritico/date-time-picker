import { DateTimePicker, I18nDate } from '@components'

import type { FC, ReactNode } from 'react'
import type { CommonPickerProps } from '@types'

const ControlledDateTimePicker: FC<
  CommonPickerProps<'DATETIME'> & { title: ReactNode }
> = ({ date, locale = 'en_US', onChange, timezone, title, ...rest }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="p-4 border rounded-lg">
        <DateTimePicker
          enablePortal
          date={date}
          onChange={onChange}
          locale={locale}
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

export default ControlledDateTimePicker
