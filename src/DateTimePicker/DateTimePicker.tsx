import { CommonPickerProps } from '@types'

import Picker from './components/Picker'

import type { FC } from 'react'

export type DateTimePickerProps = CommonPickerProps<'DATETIME'>

const DateTimePicker: FC<DateTimePickerProps> = ({
  date,
  onChange,
  locale,
  timezone,
  ...rest
}) => {
  return (
    <Picker
      {...rest}
      date={date}
      onChange={onChange}
      locale={locale}
      pickerMode="DATETIME"
      timezone={timezone}
    />
  )
}

export default DateTimePicker
