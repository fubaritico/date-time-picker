import { cx } from '../../utils'

import daysGridCellStyles from './DaysGridCell.styles'

import type { VariantDaysGridCellProps } from './DaysGridCell.styles'
import type {
  ComponentProps,
  FC,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
} from 'react'

export interface DaysGridCellProps
  extends Omit<ComponentProps<'div'>, 'color'>,
    VariantDaysGridCellProps {
  /*  */
  handleDateClick: (event: MouseEvent<HTMLDivElement>) => void
  /*  */
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
  /*  */
  handleDateMouseEnter: (event: MouseEvent<HTMLDivElement>) => void
  /*  */
  isSelectingRange: boolean
  /*  */
  value: number
}

const DaysGridCell: FC<PropsWithChildren<DaysGridCellProps>> = ({
  children,
  defaultBehavior,
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
      daysGridCellStyles({
        defaultBehavior,
        isToday,
        isInRange,
        hasDateRangeMode,
        isClickable,
        isSelected,
        startDateIsSelected,
        endDateIsSelected,
        size,
      })
    )}
  >
    {children}
  </div>
)

export default DaysGridCell
