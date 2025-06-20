import clsx from 'clsx'

import { getMonthNameFromTs, getYearFromTs } from '@utils'
import { Icon } from '@components'

import { useDateTimePicker } from '../hooks'
import { PanelView } from '../types'

import DateBrowserButton from './DateBrowserButton'

import type { FC } from 'react'

export interface DateBrowserProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* The date passed by the parent: DatePanel or DateRangePanel */
  date?: number
  /* If true, the next month button is disabled */
  disableNextMonth?: boolean
  /* If true, the previous month button is disabled */
  disablePrevMonth?: boolean
  /* Function called when clicking on the previous month button */
  onPrevMonthClick?: () => void
  /* Function called when clicking on the next month button */
  onNextMonthClick?: () => void
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

const DateBrowser: FC<DateBrowserProps> = ({
  className,
  disableNextMonth = false,
  disablePrevMonth = false,
  date = Date.now(),
  onPrevMonthClick,
  onNextMonthClick,
  size,
}) => {
  // SHARED STATE FROM DATE TIME PICKER CONTEXT
  const { color, locale, msOffset, pickerMode, setPanelView } =
    useDateTimePicker()

  return (
    <div
      className={clsx(
        'dp-flex dp-gap-4 dp-justify-between',
        'dp-text-gray-600 dark:dp-text-gray-300',
        {
          'dp-px-6 dp-pt-6 dp-pb-3': size === 'lg',
          'dp-px-4 dp-pt-4 dp-pb-2': size === 'md' || size === 'sm',
        },
        className
      )}
    >
      <button
        aria-label="Previous Month"
        className="dp-appearance-none dp-border-none dp-bg-transparent dp-cursor-pointer dp-w-6 disabled:dp-opacity-50 disabled:dp-cursor-default"
        onClick={onPrevMonthClick}
        disabled={disablePrevMonth}
      >
        <Icon
          aria-hidden
          name="HiChevronLeft"
          className="dp-w-6 dark:dp-text-white"
        />
      </button>
      <div className="dp-flex dp-font-bold dp-gap-1">
        <DateBrowserButton
          aria-label={getMonthNameFromTs(date + msOffset, locale)}
          color={color}
          hasDatePickerMode={pickerMode !== 'DATERANGE'}
          label={getMonthNameFromTs(date + msOffset, locale)}
          onClick={() => {
            setPanelView(PanelView.MONTHS)
          }}
        />
        <DateBrowserButton
          aria-label={getYearFromTs(date).toString()}
          color={color}
          hasDatePickerMode={pickerMode !== 'DATERANGE'}
          label={getYearFromTs(date)}
          onClick={() => {
            setPanelView(PanelView.YEARS)
          }}
        />
      </div>
      <button
        aria-label="Next Month"
        className="dp-appearance-none dp-border-none dp-bg-transparent dp-cursor-pointer dp-w-6 disabled:dp-opacity-50 disabled:dp-cursor-default"
        onClick={onNextMonthClick}
        disabled={disableNextMonth}
      >
        <Icon
          aria-hidden
          name="HiChevronRight"
          className="dp-w-6 dark:dp-text-white"
        />
      </button>
    </div>
  )
}

export default DateBrowser
