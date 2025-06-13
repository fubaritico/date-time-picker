import Picker from './components/Picker'

import type { CommonPickerProps } from './types'
import type { FC } from 'react'

export type DateRangePickerProps = CommonPickerProps<'DATERANGE'>

const DateRangePicker: FC<DateRangePickerProps> = ({
  dateRange,
  onDateRangeChange,
  locale,
  timezone,
  ...rest
}) => {
  return (
    <Picker<'DATERANGE'>
      {...rest}
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      locale={locale}
      timezone={timezone}
    />
  )
}

export default DateRangePicker
