import { CommonPickerProps } from '@types'

import Picker from './components/Picker'

import type { FC } from 'react'

export type TimePickerProps = CommonPickerProps<'TIME'>

const TimePicker: FC<TimePickerProps> = ({
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
      pickerMode="TIME"
      timezone={timezone}
    />
  )
}

export default TimePicker
