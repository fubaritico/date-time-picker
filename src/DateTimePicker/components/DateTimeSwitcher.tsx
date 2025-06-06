import clsx from 'clsx'
import { forwardRef } from 'react'

import { PanelView } from '@enums'

import Icon from '../../Icon/Icon'
import useDateTimePicker from '../hooks/useDateTimePicker'

interface DataTimeSwitcherProps {
  /* Type of view currently displayed: 'DAYS' or 'TIME' */
  panelView: PanelView
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

const DateTimeSwitcher = forwardRef<HTMLDivElement, DataTimeSwitcherProps>(
  ({ panelView, size }, ref) => {
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
          className={clsx(
            'flex justify-center items-center rounded-tl-lg transition duration-500 grow',
            {
              'hover:bg-gray-100 hover:gray-red-800 text-gray-500':
                panelView === PanelView.TIME,
            },
            {
              'bg-blue-illustration text-blue-700':
                panelView !== PanelView.TIME,
            }
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
          className={clsx(
            'flex justify-center items-center rounded-tr-lg transition duration-500 grow',
            {
              'hover:bg-gray-100 hover:gray-red-800 text-gray-500':
                panelView !== PanelView.TIME,
            },
            {
              'bg-blue-illustration text-blue-700':
                panelView === PanelView.TIME,
            }
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
