import clsx from 'clsx'
import { forwardRef } from 'react'

import { PanelView } from '@enums'
import { cx } from '@utils'
import { Icon } from '@components'

import useDateTimePicker from '../hooks/useDateTimePicker'

import dateTimeSwitcherStyles from './DateTimeSwitcher.styles'

interface DataTimeSwitcherProps {
  /* Tailwind color palette name for theming */
  color?: UIColor
  /* Type of view currently displayed: 'DAYS' or 'TIME' */
  panelView: PanelView
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

const DateTimeSwitcher = forwardRef<HTMLDivElement, DataTimeSwitcherProps>(
  ({ color, panelView, size }, ref) => {
    const { setPanelView } = useDateTimePicker()

    return (
      <div
        className={clsx(
          'flex justify-between items-stretch border-b border-b-gray-100',
          {
            'h-[36px]': size === 'sm',
            'h-[46px]': size !== 'sm',
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
              className: 'rounded-tl-lg',
            })
          )}
          onClick={() => {
            setPanelView(PanelView.DAYS)
          }}
        >
          <Icon
            aria-hidden
            className={size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'}
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
              className: 'rounded-tr-lg',
            })
          )}
          onClick={() => {
            setPanelView(PanelView.TIME)
          }}
        >
          <Icon
            aria-hidden
            className={size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'}
            name={size === 'sm' ? 'HiMiniClock' : 'HiClock'}
          />
        </button>
      </div>
    )
  }
)

export default DateTimeSwitcher
