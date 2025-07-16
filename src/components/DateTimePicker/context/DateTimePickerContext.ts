import { createContext } from 'react'

import { PanelView } from '../types'

import type { PickerState } from '../types'

const DateTimePickerContext = createContext<PickerState>({
  finalOffset: 0,
  ignoreClickAwayRef: { current: null },
  innerDate: new Date().getTime(),
  innerDateRange: undefined,
  isControlled: false,
  locale: 'en',
  panelRect: new DOMRectReadOnly(),
  panelView: PanelView.DAYS,
  setIgnoreClickAwayRef: () => {},
  setInnerDate: () => {},
  setPanelRect: () => {},
  setPanelView: () => {},
  setInnerDateRange: () => {},
  dateRangePickerOffsets: [],
})

export default DateTimePickerContext
