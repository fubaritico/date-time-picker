import { DateTimePicker, I18nDate } from '@components'

import type { FC, ReactNode } from 'react'
import type { CommonPickerProps } from '@types'

const ControlledDateTimePicker: FC<
  CommonPickerProps<'DATETIME'> & { title: ReactNode }
> = ({ date, locale = 'en_US', onChange, timezone, title, ...rest }) => {
  return (
    <div className="dp-mb-8">
      <h2 className="dp-text-xl dp-font-semibold dp-mb-4">{title}</h2>
      <div className="dp-p-4 dp-border dp-rounded-lg">
        <DateTimePicker
          enablePortal
          date={date}
          onChange={onChange}
          locale={locale}
          timezone={timezone}
          {...rest}
        />

        <div className="dp-mt-4 dp-flex">
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
