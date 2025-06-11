import clsx from 'clsx'
import { forwardRef } from 'react'

import { PanelView } from '@enums'
import { cx } from '@utils'
import { Icon } from '@components'

import useDateTimePicker from '../hooks/useDateTimePicker'

import dateTimeSwitcherStyles from './styles/DateTimeSwitcher.styles'

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
      <div
        className={clsx(
          'dp-flex dp-justify-between dp-items-stretch dp-border-b dp-border-b-gray-100',
          {
            'dp-h-[36px]': size === 'sm',
            'dp-h-[46px]': size !== 'sm',
          }
        )}
        ref={ref}
      >
        <button
          aria-label="Switch to days view"
          className={cx(
            dateTimeSwitcherStyles({
              isSelected: panelView !== PanelView.TIME,
              color,
              size,
              className: 'dp-rounded-tl-lg',
            })
          )}
          onClick={() => {
            setPanelView(PanelView.DAYS)
          }}
        >
          <Icon
            aria-hidden
            className={size === 'sm' ? 'dp-h-5 dp-w-5' : 'dp-h-6 dp-w-6'}
            name={size === 'sm' ? 'HiMiniCalendarDays' : 'HiCalendarDays'}
          />
        </button>
        <button
          aria-label="Switch to time view"
          className={cx(
            dateTimeSwitcherStyles({
              isSelected: panelView === PanelView.TIME,
              color,
              size,
              className: 'dp-rounded-tr-lg',
            })
          )}
          onClick={() => {
            setPanelView(PanelView.TIME)
          }}
        >
          <Icon
            aria-hidden
            className={size === 'sm' ? 'dp-h-5 dp-w-5' : 'dp-h-6 dp-w-6'}
            name={size === 'sm' ? 'HiMiniClock' : 'HiClock'}
          />
        </button>
      </div>
    )
  }
)

export default DateTimeSwitcher
