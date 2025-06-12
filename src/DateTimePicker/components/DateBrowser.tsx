import clsx from 'clsx'

import { PanelView } from '@enums'
import { Icon, getMonthNameFromTs, getYearFromTs } from '@components'

import { useDateTimePicker } from '../hooks'

import DateBrowserButton from './DateBrowserButton'

import type { FC } from 'react'

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
        className="dp-appearance-none dp-border-none dp-bg-transparent dp-cursor-pointer dp-w-6"
        onClick={onPrevMonthClick}
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
        className="dp-appearance-none dp-border-none dp-bg-transparent dp-cursor-pointer dp-w-6"
        onClick={onNextMonthClick}
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
