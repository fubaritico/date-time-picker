import { PickerMode } from '@enums'
import { getStartOfDayTs } from '@components'

import { cx } from '../../utils'

import type { FC, KeyboardEvent, MouseEvent, PropsWithChildren } from 'react'

export interface DaysGridCellProps {
  /*  */
  handleDateClick: (event: MouseEvent<HTMLDivElement>) => void
  /*  */
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  /*  */
  handleDateMouseEnter: (event: MouseEvent<HTMLDivElement>) => void
  /*  */
  isClickable: boolean
  /* CVA */
  isSelected: boolean
  /* CVA */
  isToday: boolean
  /* CVA */
  isInRange: boolean
  /* CVA */
  startDateIsSelected: boolean
  /* CVA */
  endDateIsSelected: boolean
  /*  */
  isSelectingRange: boolean
  /*  */
  innerDate?: number
  /*  */
  msOffset: number
  /*  */
  pickerMode?: PickerMode
  /*  */
  size: UISize
  /*  */
  value: number
}

const DaysGridCell: FC<PropsWithChildren<DaysGridCellProps>> = ({
  children,
  handleDateClick,
  handleKeyDown,
  handleDateMouseEnter,
  isClickable,
  isSelected,
  isToday,
  isInRange,
  isSelectingRange,
  msOffset,
  pickerMode,
  startDateIsSelected,
  innerDate,
  endDateIsSelected,
  size,
  value,
}) => {
  return (
    <div
      key={value}
      tabIndex={isClickable ? 0 : -1}
      role="button"
      aria-current={isSelected}
      data-date={value}
      data-test={value}
      onClick={isClickable ? handleDateClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      onMouseEnter={
        isClickable && isSelectingRange ? handleDateMouseEnter : undefined
      }
      className={cx(
        'font-bold flex justify-center items-center transition rounded-lg',
        'focus:outline-none focus-visible:outline-blue-illustration focus-visible:outline-1',
        {
          'duration-500': pickerMode !== 'DATERANGE',
          'duration-200': pickerMode === 'DATERANGE',
          'h-10 w-10': size === 'lg',
          'h-9 w-9 text-sm': size === 'md',
          'h-[30px] w-8': size === 'sm',
          'bg-white text-gray-900 hover:bg-gray-100':
            getStartOfDayTs(Date.now() + msOffset) !== getStartOfDayTs(value) &&
            innerDate !== value &&
            isClickable,
          'text-gray-300 cursor-not-allowed': !isClickable,
          'text-white bg-blue-700 hover:bg-blue-800': isSelected,
          'border-r border-r-white last:border-r-0 -mx-0.5': isInRange,
          'w-11': size === 'lg' && isInRange,
          'w-10': size === 'md' && isInRange,
          'h-[30px] w-8.5': size === 'sm' && isInRange,
          'text-blue-800 bg-blue-100 hover:blue-800 hover:bg-blue-100 rounded-none':
            isInRange,
          'rounded-l-md text-white bg-blue-700 hover:bg-blue-700 rounded-r-none w-10 -mx-0.5 border-r border-r-white':
            startDateIsSelected,
          'rounded-r-md text-white bg-blue-700 hover:bg-blue-700':
            endDateIsSelected,
          'bg-white shadow-border border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600':
            isToday && !isInRange,
        }
      )}
    >
      {children}
    </div>
  )
}

export default DaysGridCell
