import { useContext } from 'react'

import DateTimePickerContext from '../DateTimePickerContext'

import type { PickerState } from '../DateTimePicker.types'

const useDateTimePicker = (): PickerState => {
  const context = useContext(DateTimePickerContext)
  if (typeof context === 'undefined') {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}

export default useDateTimePicker
