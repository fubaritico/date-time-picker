import { useContext } from 'react'

import {
  DateRangePanelContext,
  DateRangePanelState,
  initialState,
} from '../context'

const useDateRangePanel = (): DateRangePanelState => {
  const context = useContext(DateRangePanelContext)

  if (typeof context === 'undefined') {
    return initialState
  }

  return context
}

export default useDateRangePanel
