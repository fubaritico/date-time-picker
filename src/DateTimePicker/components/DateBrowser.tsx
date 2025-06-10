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
        className="appearance-none border-none bg-transparent cursor-pointer w-6"
        onClick={onNextMonthClick}
      >
        <Icon aria-hidden name="HiChevronRight" className="w-6" />
      </button>
    </div>
  )
}

export default DateBrowser
