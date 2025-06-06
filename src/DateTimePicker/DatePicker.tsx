import { CommonPickerProps } from '@types'

import Picker from './components/Picker'

import type { FC } from 'react'

export type DatePickerProps = CommonPickerProps<'DATE'>

const DatePicker: FC<DatePickerProps> = ({
  date,
  onChange,
  locale,
  timezone,
  ...rest
}) => {
  return (
    <Picker<'DATE'>
      {...rest}
      date={date}
      onChange={onChange}
      locale={locale}
      pickerMode="DATE"
      timezone={timezone}
    />
  )
}

export default DatePicker
