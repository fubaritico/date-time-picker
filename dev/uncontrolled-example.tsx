import { DateTimePicker } from '../src'

import type { FC, ReactNode } from 'react'
import type { DateTimePickerProps } from '@types'

const UncontrolledExample: FC<DateTimePickerProps & { title: ReactNode }> = ({
  locale = 'en_US',
  pickerMode,
  title,
  timezone,
  ...rest
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="p-4 border rounded-lg">
        <DateTimePicker
          enablePortal
          locale={locale}
          pickerMode={pickerMode}
          timezone={timezone}
          {...rest}
        />
      </div>
    </div>
  )
}

export default UncontrolledExample
