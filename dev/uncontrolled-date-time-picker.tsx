import { DateTimePicker } from '../src'

import type { FC, ReactNode } from 'react'
import type { CommonPickerProps } from '../src/components/DateTimePicker/types'

const UncontrolledDateTimePicker: FC<
  CommonPickerProps<'DATETIME'> & { title: ReactNode }
> = ({ locale = 'en_US', pickerMode, title, timezone, ...rest }) => {
  return (
    <section className="uncontrolled-date-time-picker">
      <h2>{title}</h2>
      <div>
        <DateTimePicker
          enablePortal
          locale={locale}
          timezone={timezone}
          {...rest}
        />
      </div>
    </section>
  )
}

export default UncontrolledDateTimePicker
