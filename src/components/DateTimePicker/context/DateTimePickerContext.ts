import { createContext } from 'react'

import { PanelView } from '../types'

import type { PickerState } from '../types'

const DateTimePickerContext = createContext<PickerState>({
  finalOffset: 0,
  ignoreClickAwayRef: { current: null },
  localeDate: new Date().getTime(),
  localeDateRange: undefined,
  isControlled: false,
  locale: 'en',
  panelRect: new DOMRectReadOnly(),
  panelView: PanelView.DAYS,
  setIgnoreClickAwayRef: () => {},
  setLocaleDate: () => {},
  setPanelRect: () => {},
  setPanelView: () => {},
  setLocaleDateRange: () => {},
  dateRangePickerTimeOffsets: [],
})

export default DateTimePickerContext
