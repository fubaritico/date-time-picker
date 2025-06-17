import { I18nDate } from '@components'

import { DateTimePicker } from 'src/components/DateTimePicker'

import type { FC, ReactNode } from 'react'
import type { CommonPickerProps } from 'src/components/DateTimePicker/types'

const ControlledDateTimePicker: FC<
  CommonPickerProps<'DATETIME'> & { title: ReactNode }
> = ({
  date,
  locale = 'en_US',
  enablePortal = true,
  onChange,
  timezone,
  title,
  ...rest
}) => {
  return (
    <div className="controlled-date-time-picker">
      <h2>{title}</h2>
      <div>
        <DateTimePicker
          enablePortal={enablePortal}
          date={date}
          onChange={onChange}
          locale={locale}
          timezone={timezone}
          {...rest}
        />

        <div>
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
