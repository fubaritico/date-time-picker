import clsx from 'clsx'
import { forwardRef } from 'react'

import { Icon } from '@components'

import useDateTimePicker from '../hooks/useDateTimePicker'
import { PanelView } from '../types'

interface DataTimeSwitcherProps {
  /* Type of view currently displayed: 'DAYS' or 'TIME' */
  panelView: PanelView
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

const DateTimeSwitcher = forwardRef<HTMLDivElement, DataTimeSwitcherProps>(
  ({ panelView, size }, ref) => {
    const { color, setPanelView } = useDateTimePicker()

    return (
      <div className={clsx('DateTimeSwitcher', size)} ref={ref}>
        <button
          aria-label="Switch to days view"
          className={clsx('DateTimeSwitcherButton', color ?? 'blue', size, {
            selected: panelView !== PanelView.TIME,
          })}
          style={{
            borderTopLeftRadius: '0.5rem',
          }}
          onClick={() => {
            setPanelView(PanelView.DAYS)
          }}
        >
          <Icon
            aria-hidden
            name={size === 'sm' ? 'HiMiniCalendarDays' : 'HiCalendarDays'}
          />
        </button>
        <button
          aria-label="Switch to time view"
          className={clsx('DateTimeSwitcherButton', color, size, {
            selected: panelView === PanelView.TIME,
          })}
          style={{
            borderTopRightRadius: '0.5rem',
          }}
          onClick={() => {
            setPanelView(PanelView.TIME)
          }}
        >
          <Icon aria-hidden name={size === 'sm' ? 'HiMiniClock' : 'HiClock'} />
        </button>
      </div>
    )
  }
)

export default DateTimeSwitcher
