import { DateTimePicker } from '../src'

import type { FC, ReactNode } from 'react'
import type { CommonPickerProps } from '@types'

const UncontrolledDateTimePicker: FC<
  CommonPickerProps<'DATETIME'> & { title: ReactNode }
> = ({ locale = 'en_US', pickerMode, title, timezone, ...rest }) => {
  return (
    <div className="dp-mb-8">
      <h2 className="dp-text-xl dp-font-semibold dp-mb-4">{title}</h2>
      <div className="dp-p-4 dp-border dp-rounded-lg">
        <DateTimePicker
          enablePortal
          locale={locale}
          timezone={timezone}
          {...rest}
        />
      </div>
    </div>
  )
}

export default UncontrolledDateTimePicker
