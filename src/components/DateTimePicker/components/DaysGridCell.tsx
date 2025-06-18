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
  /*  */
  color: UIColor
  /*  */
  handleDateClick: (event: MouseEvent<HTMLDivElement>) => void
  /*  */
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  /*  */
  handleDateMouseEnter: (event: MouseEvent<HTMLDivElement>) => void
  /*  */
  isSelectingRange: boolean
  /*  */
  isToday: boolean
  /*  */
  isInRange: boolean
  /*  */
  hasDateRangeMode: boolean
  /*  */
  isClickable: boolean
  /*  */
  isSelected?: boolean
  /*  */
  startDateIsSelected: boolean
  /*  */
  endDateIsSelected: boolean
  /*  */
  size: UISize
  /*  */
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
