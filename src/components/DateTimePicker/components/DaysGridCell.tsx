import clsx from 'clsx'

import { formatHumanReadableDate } from '@utils'

import type { ComponentProps, FC, PropsWithChildren } from 'react'

export interface DaysGridCellProps
  extends Omit<ComponentProps<'button'>, 'color'> {
  /* Component theme color, overrides default color */
  color?: UIColor
  /* Interstate, true when the date range selection is not completed */
  isSelectingRange: boolean
  /* If true, some CSS styles are applied */
  isToday: boolean
  /* If true, some CSS styles are applied if startDateIsSelected & endDateIsSelected are false */
  isInRange: boolean
  /* If true, the CSS transition duration is shorter */
  hasDateRangeMode: boolean
  /* Locale language in international ISO-8601  */
  locale?: string
  /* True when the cell is in the range between min and max date, default to true */
  disabled: boolean
  /* True when the cell is selected */
  isSelected?: boolean
  /* True when, in date range mode, the cell is the start date of the range */
  startDateIsSelected: boolean
  /* True when, in date range mode, the cell is the end date of the range */
  endDateIsSelected: boolean
  /* Component size: 'sm' | 'md' | 'lg' */
  size?: UISize
  /* The date as a unix timestamp */
  value: number
}

const DaysGridCell: FC<PropsWithChildren<DaysGridCellProps>> = ({
  children,
  color,
  onClick,
  onKeyDown,
  onMouseEnter,
  hasDateRangeMode,
  disabled,
  isSelected,
  isToday,
  isInRange,
  isSelectingRange,
  locale,
  startDateIsSelected,
  endDateIsSelected,
  size,
  value,
  ...rest
}) => {
  return (
    <button
      aria-label={formatHumanReadableDate(value, locale)}
      aria-disabled={disabled}
      className={clsx(
        'DaysGridCell',
        {
          hasDateRangeMode: hasDateRangeMode,
          enabled: !disabled,
          selected: isSelected,
          inRange: isInRange,
          today: isToday,
          selectedStartDate: startDateIsSelected,
          selectedEndDate: endDateIsSelected,
        },
        color,
        size
      )}
      data-date={value}
      data-test={value}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={!disabled ? onKeyDown : undefined}
      onMouseEnter={!disabled && isSelectingRange ? onMouseEnter : undefined}
      tabIndex={rest.tabIndex}
      {...rest}
    >
      {children}
    </button>
  )
}

export default DaysGridCell
