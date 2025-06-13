import { useContext } from 'react'

import { DateTimePickerContext } from '../context'

import type { PickerState } from '../types'

const useDateTimePicker = (): PickerState => {
  const context = useContext(DateTimePickerContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useDateTimePicker must be used within a DateTimePickerProvider'
    )
  }
  return context
}

export default useDateTimePicker
