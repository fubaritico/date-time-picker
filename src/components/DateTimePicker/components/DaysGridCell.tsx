import { cx } from '@utils'

import type {
  ComponentProps,
  FC,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
} from 'react'

export interface DaysGridCellProps
  extends Omit<ComponentProps<'div'>, 'color'> {
  /* Component theme color, overrides default color */
  color?: UIColor
  /* Called on clicking the cell */
  handleDateClick: (event: MouseEvent<HTMLDivElement>) => void
  /* A11y callback triggerred on keyboard interaction */
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  /* Only called when picker mode is date range */
  handleDateMouseEnter: (event: MouseEvent<HTMLDivElement>) => void
  /* Interstate, true when the date range selection is not completed */
  isSelectingRange: boolean
  /* If true, some CSS styles are applied */
  isToday: boolean
  /* If true, some CSS styles are applied if startDateIsSelected & endDateIsSelected are false */
  isInRange: boolean
  /* If true, the CSS transition duration is shorter */
  hasDateRangeMode: boolean
  /* True when the cell is in the range between min and max date, default to true */
  isClickable: boolean
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
  handleDateClick,
  handleKeyDown,
  handleDateMouseEnter,
  hasDateRangeMode,
  isClickable,
  isSelected,
  isToday,
  isInRange,
  isSelectingRange,
  startDateIsSelected,
  endDateIsSelected,
  size,
  value,
}) => (
  <div
    tabIndex={isClickable ? 0 : -1}
    role="button"
    aria-current={isSelected ?? 'false'}
    aria-disabled={!isClickable ? 'true' : 'false'}
    data-date={value}
    data-test={value}
    onClick={isClickable ? handleDateClick : undefined}
    onKeyDown={isClickable ? handleKeyDown : undefined}
    onMouseEnter={
      isClickable && isSelectingRange ? handleDateMouseEnter : undefined
    }
    className={cx(
      'DaysGridCell',
      {
        hasDateRangeMode: hasDateRangeMode,
        enabled: isClickable,
        selected: isSelected,
        inRange: isInRange,
        today: isToday,
        selectedStartDate: startDateIsSelected,
        selectedEndDate: endDateIsSelected,
      },
      color,
      size
    )}
  >
    {children}
  </div>
)

export default DaysGridCell
