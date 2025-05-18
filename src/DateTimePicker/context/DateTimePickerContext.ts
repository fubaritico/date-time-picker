import { createContext } from 'react'

import { PanelView } from '@enums'

import type { PickerState } from '@types'

const DateTimePickerContext = createContext<PickerState>({
  gmtMsOffset: 0,
  msOffset: 0,
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
})

export default DateTimePickerContext
