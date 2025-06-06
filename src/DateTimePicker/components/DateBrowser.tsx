import clsx from 'clsx'

import { PanelView } from '@enums'
import {
  ConditionalWrapper,
  Icon,
  getMonthNameFromTs,
  getYearFromTs,
} from '@components'

import { useDateTimePicker } from '../hooks'

import type { FC, ReactNode } from 'react'

export interface DateBrowserProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* The date passed by the parent: DatePanel or DateRangePanel */
  date?: number
  /* Function called when clicking on the previous month button */
  onPrevMonthClick?: () => void
  /* Function called when clicking on the next month button */
  onNextMonthClick?: () => void
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

const DateBrowser: FC<DateBrowserProps> = ({
  className,
  date = Date.now(),
  onPrevMonthClick,
  onNextMonthClick,
  size,
}) => {
  // SHARED STATE FROM DATE TIME PICKER CONTEXT
  const { locale, msOffset, pickerMode, setPanelView } = useDateTimePicker()

  return (
    <div
      className={clsx(
        'flex gap-4 text-gray-600 justify-between',
        {
          'px-6 pt-6 pb-3': size === 'lg',
          'px-4 pt-4 pb-2': size === 'md' || size === 'sm',
        },
        className
      )}
    >
      <button
        aria-label="Previous Month"
        className="appearance-none border-none bg-transparent cursor-pointer w-6"
        onClick={onPrevMonthClick}
      >
        <Icon aria-hidden name="HiChevronLeft" className="w-6" />
      </button>
      <div className="flex font-bold gap-1">
        <ConditionalWrapper
          condition={pickerMode !== 'DATERANGE'}
          wrapper={(children: ReactNode) => (
            <button
              aria-label={getMonthNameFromTs(date + msOffset, locale)}
              className={clsx(
                'hover:text-blue-700 transition-colors duration-500',
                {
                  'text-sm': size === 'md',
                  'text-xs': size === 'sm',
                }
              )}
              onClick={() => {
                setPanelView(PanelView.MONTHS)
              }}
            >
              {children}
            </button>
          )}
        >
          <span>{getMonthNameFromTs(date + msOffset, locale)}</span>
        </ConditionalWrapper>
        <ConditionalWrapper
          condition={pickerMode !== 'DATERANGE'}
          wrapper={(children: ReactNode) => (
            <button
              aria-label={getYearFromTs(date).toString()}
              className={clsx(
                'hover:text-blue-700 transition-colors duration-500',
                {
                  'text-sm': size === 'md',
                  'text-xs': size === 'sm',
                }
              )}
              onClick={() => {
                setPanelView(PanelView.YEARS)
              }}
            >
              {children}
            </button>
          )}
        >
          <span>{getYearFromTs(date)}</span>
        </ConditionalWrapper>
      </div>
      <button
        aria-label="Next Month"
        className="appearance-none border-none bg-transparent cursor-pointer w-6"
        onClick={onNextMonthClick}
      >
        <Icon aria-hidden name="HiChevronRight" className="w-6" />
      </button>
    </div>
  )
}

export default DateBrowser
