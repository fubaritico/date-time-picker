import { createContext } from 'react'

import { PanelView } from './DateTimePicker.types'
import { DATE_TIME_FORMAT } from './formats'

import type { PickerState } from './DateTimePicker.types'

const DateTimePickerContext = createContext<PickerState>({
  gmtMsOffset: 0,
  msOffset: 0,
  ignoreClickAwayRef: { current: null },
  innerDate: new Date().getTime(),
  isControlled: false,
  locale: 'en',
  panelRect: new DOMRectReadOnly(),
  panelView: PanelView.DAYS,
  pickerFormat: DATE_TIME_FORMAT.en,
  setIgnoreClickAwayRef: () => {},
  setInnerDate: () => {},
  setPanelRect: () => {},
  setPanelView: () => {},
})

export default DateTimePickerContext
