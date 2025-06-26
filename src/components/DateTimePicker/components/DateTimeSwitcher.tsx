import clsx from 'clsx'
import { forwardRef } from 'react'

import useDateTimePicker from '../hooks/useDateTimePicker'
import { PanelView } from '../types'

import { ReactComponent as HiCalendarDays } from '../../../assets/svg/HiCalendarDays.svg'
import { ReactComponent as HiClock } from '../../../assets/svg/HiClock.svg'
import { ReactComponent as HiMiniCalendarDays } from '../../../assets/svg/HiMiniCalendarDays.svg'
import { ReactComponent as HiMiniClock } from '../../../assets/svg/HiMiniClock.svg'

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
          {size === 'sm' ? (
            <HiMiniCalendarDays aria-hidden />
          ) : (
            <HiCalendarDays aria-hidden />
          )}
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
          {size === 'sm' ? (
            <HiMiniClock aria-hidden />
          ) : (
            <HiClock aria-hidden />
          )}
        </button>
      </div>
    )
  }
)

export default DateTimeSwitcher
